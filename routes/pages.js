const express = require('express');
const router = express.Router();
const { isLoggedIn, redirectIfLoggedIn, isAdmin  } = require('../middleware/authMiddleware');
const {calculationController,favoriteController,feedbackController,userController} = require('../controllers/controllers.js');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
});

router.get('/', (req, res) => {
  const user = res.locals.user; // set by middleware
  res.render('index', {
    name: user ? user.name : null
  });
});

router.get('/register', redirectIfLoggedIn, (req, res) => {
  res.render('register');
});

router.get('/login', redirectIfLoggedIn, (req, res) => {
  res.render('login', {
    message: req.query.message || null  // Check if message exists in the query string
});
});

// Logout route
router.get('/logout', (req, res) => {
  // Clear the JWT token stored in the cookies
  res.clearCookie('auth_token');  // This removes the token from the user's browser
  
  // Redirect to the home page after logging out
  return res.redirect('/');  // Redirecting to the home page '/'
});

router.get('/feedback', (req, res) => {
  res.render('feedback');
});

router.get('/dashboard', isLoggedIn, (req, res) => {
  const user = res.locals.user;

  if (user.is_admin) {
    // Admin: Fetch users
    db.query('SELECT id, name, email, is_admin FROM users', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }

      // Fetch feedback data from the 'feedback' table
      db.query('SELECT feedback.id, users.name AS user_name, feedback.topic, feedback.message, feedback.isABug, feedback.resolved, feedback.created_at FROM feedback JOIN users ON feedback.user_id = users.id ORDER BY feedback.created_at DESC', (err, feedbackResults) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error fetching feedback');
        }

        // Render dashboard with both users and feedback
        res.render('dashboard', {
          name: user.name,
          isAdmin: true,
          users: results,
          feedbacks: feedbackResults
        });
      });
    });
  } else {
    // Regular user: Just pass the name
    res.render('dashboard', {
      name: user.name,
      isAdmin: false
    });
  }
});

router.post('/feedback/resolve/:id', (req, res) => {
  const feedbackId = req.params.id;
  db.query('UPDATE feedback SET resolved = 1 WHERE id = ?', [feedbackId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error marking feedback as resolved');
    }
    res.redirect('/dashboard');
  });
});

// Promote user to admin
router.post('/make-admin/:id', (req, res) => {
  const userId = req.params.id;
  db.query('UPDATE users SET is_admin = 1 WHERE id = ?', [userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error promoting user');
    }
    res.redirect('/dashboard');
  });
});

// Delete user
router.post('/delete-user/:id', (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting user');
    }
    res.redirect('/dashboard');
  });
});




// Routes for calculations
router.get('/calculations', calculationController.getAll); 
router.get('/calculations/:id', calculationController.getById); 
router.post('/calculations', calculationController.create); 
router.put('/calculations/:id', calculationController.update); 
router.delete('/calculations/:id', calculationController.remove);

// Routes for favorites
router.get('/favorites', favoriteController.getAll); 
router.get('/favorites/:id', favoriteController.getById); 
router.post('/favorites', favoriteController.add); 
router.delete('/favorites/:id', favoriteController.remove);

// Protected feedback routes
router.get('/feedback', isLoggedIn, feedbackController.getAll); 
router.get('/feedback/:id', isLoggedIn, feedbackController.getById); 
router.post('/feedback', isLoggedIn, feedbackController.add); 
router.put('/feedback/:id', isLoggedIn, feedbackController.updateResolution); 
router.delete('/feedback/:id', isLoggedIn, feedbackController.remove);

// Routes for users
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getById); 
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.remove); 

module.exports = router;