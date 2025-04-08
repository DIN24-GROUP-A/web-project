const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/', controller.getAll); // Get all users
router.get('/:id', controller.getById); // Get a user by ID
router.post('/', controller.create); // Create a new user
router.put('/:id', controller.update); // Update user info
router.delete('/:id', controller.remove); // Delete a user
router.post('/login', controller.login); // Login a user

module.exports = router;
