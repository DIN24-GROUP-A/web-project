const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
})


exports.register = (req, res) =>{
    console.log(req.body)


    const {name, email, password, confirm_password } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results)=>{
        if(error){
            console.log(error);
            return
        }
        if(results.length>0){
            return res.render('register', {
                message:'Email already in use! Try logging in.'
            })}
            else if(password !== confirm_password){
                return res.render('register', {
                    message:'Passwords do not match'
                })
            
        }
        let hashedPassword = await bcrypt.hash(password, 8)
        console.log(hashedPassword)

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log(results)
                return res.render('register', {
                    message:'User Successfully Created'
                })
            
            }
        })
    })

}