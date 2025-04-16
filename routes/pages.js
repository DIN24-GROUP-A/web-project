const express = require('express');
const router = express.Router();
const { isLoggedIn, redirectIfLoggedIn } = require('../middleware/authMiddleware');

// Public pages
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/register', redirectIfLoggedIn, (req, res) => {
  res.render('register');
});

router.get('/login', redirectIfLoggedIn, (req, res) => {
  res.render('login');
});

router.get('/feedback', (req, res) => {
  res.render('feedback');
});

// Protected page
router.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', { name: res.locals.user.name }); // user data available
});

module.exports = router;
