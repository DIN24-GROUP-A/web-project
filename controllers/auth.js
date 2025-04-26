const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
});
 
exports.register = (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
      if (error) {
          console.log(error);
          return;
      }
      if (results.length > 0) {
          return res.render('register', {
              message: 'Email already in use! Try logging in.'
          });
      } else if (password !== confirm_password) {
          return res.render('register', {
              message: 'Passwords do not match'
          });
      }

      let hashedPassword = await bcrypt.hash(password, 8);

      db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
          if (error) {
              console.log(error);
          } else {
              // Redirect to the login page with a success message
              return res.redirect('/login?message=User successfully created. You can now log in!');
          }
      });
  });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.render('login', {
        message: 'Please provide both email and password'
      });
    }
  
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Server error');
      }
  
      if (results.length === 0) {
        return res.render('login', {
          message: 'No user found with this email'
        });
      }
  
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.render('login', {
          message: 'Incorrect password'
        });
      }
  
      // Create a JWT token
      const token = jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        is_admin: user.is_admin
      }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
  
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });
  
      // Redirect based on admin status
      if (user.is_admin) {
        return res.redirect('/dashboard');
      } else {
        return res.redirect('/dashboard');
      }
    });
  };
  
