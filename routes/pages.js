const express = require('express');
const router = express.Router();
const { isLoggedIn, redirectIfLoggedIn } = require('../middleware/authMiddleware');
const {
    calculationController,
    favoriteController,
    feedbackController,
    userController
} = require('../controllers/controllers.js');

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

// Routes for feedback
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
