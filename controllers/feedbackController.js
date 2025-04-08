const Feedback = require('../models/feedbackModel');

// GET /api/feedback
const getAll = async (req, res) => {
  try {
    const feedback = await Feedback.getAll(req.user.id);
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

// GET /api/feedback/:id
const getById = async (req, res) => {
  try {
    const feedback = await Feedback.getById(req.params.id, req.user.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving feedback' });
  }
};

// POST /api/feedback
const add = async (req, res) => {
  try {
    const { message } = req.body;
    const id = await Feedback.add(req.user.id, message);
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error adding feedback' });
  }
};

// PUT /api/feedback/:id
const updateResolution = async (req, res) => {
  try {
    const { resolved } = req.body;
    const updated = await Feedback.updateResolution(req.params.id, req.user.id, resolved);
    if (!updated) {
      return res.status(404).json({ error: 'Feedback not found or unauthorized' });
    }
    res.json({ message: 'Feedback updated' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error updating feedback resolution' });
  }
};

// DELETE /api/feedback/:id
const remove = async (req, res) => {
  try {
    const deleted = await Feedback.remove(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Feedback not found or unauthorized' });
    }
    res.json({ message: 'Feedback removed' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error removing feedback' });
  }
};

// Export all functions
module.exports = {
  getAll,
  getById,
  add,
  updateResolution,
  remove
};
