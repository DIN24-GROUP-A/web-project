const express = require('express');
const router = express.Router();
const controller = require('../controllers/feedbackController');

router.get('/', controller.getAll); // Get all feedback for the logged-in user
router.get('/:id', controller.getById); // Get a specific feedback by ID
router.post('/', controller.add); // Add new feedback
router.put('/:id', controller.updateResolution); // Update the resolution status of feedback
router.delete('/:id', controller.remove); // Delete feedback

module.exports = router;
