const express = require('express');
const mysql = require('mysql')
const app = express();
const dotenv = require('dotenv')
const path = require('path')
const bodyParser = require('body-parser');


dotenv.config( { path:"./.env" } )

const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
})

const publicDirectory = path.join(__dirname, './frontend')
app.use(express.static(publicDirectory))

app.use(express.urlencoded({extended:false }))
app.use(express.json())

app.set('view engine', 'hbs')

db.connect( (error)=> {
    if(error){
        console.log(error)
    } else {
        console.log('MYSQL Connected....')
    }
})

// Routes
const cookieParser = require('cookie-parser');
const { isLoggedIn } = require('./middleware/authMiddleware');
app.use(cookieParser());
app.use('/', require('./routes/pages'))
app.use('/auth',require('./routes/auth'))
app.get('/dashboard', isLoggedIn, (req, res) => {
    res.render('dashboard');
  });

app.listen(5000, ()=> {
    console.log("Server started on port 3307")
})