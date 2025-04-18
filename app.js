const express = require('express');
const mysql = require('mysql');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
});

const publicDirectory = path.join(__dirname, './frontend');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')  // ✅ this is key
}));
app.set('views', path.join(__dirname, 'views'));
// Set up the view engine
app.set('view engine', 'hbs');
// app.engine('hbs', hbs.engine); // Pass the engine object here

app.use(express.static('frontend')); // Serving static files

// Connect to MySQL
db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('MYSQL Connected....');
    }
});

// Routes
app.use(cookieParser());
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

// Start the server
app.listen(5000, () => {
    console.log("Server started on port 5000");
});
