const express = require('express')
const router = express.Router()
const {
    calculationController,
    favoriteController,
    feedbackController,
    userController
} = require('../controllers/controllers.js');

router.get('/', (req, res) =>{
    res.render('index');
})
router.get('/register', (req, res) =>{
    res.render('register');
})
router.get('/login', (req, res) =>{
    res.render('login');
})

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
router.get('/feedback', feedbackController.getAll); 
router.get('/feedback/:id', feedbackController.getById); 
router.post('/feedback', feedbackController.add); 
router.put('/feedback/:id', feedbackController.updateResolution); 
router.delete('/feedback/:id', feedbackController.remove); 


// Routes for users
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getById); 
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.remove); 

module.exports = router;