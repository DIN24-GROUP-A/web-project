const express = require('express');
const router = express.Router();
const controller = require('../controllers/favoriteController');

router.get('/', controller.getAll); // Get all favorites
router.get('/:id', controller.getById); // Get a specific favorite
router.post('/', controller.add); // Add a new favorite
router.delete('/:id', controller.remove); // Remove a favorite

module.exports = router;
