const Calculation = require('../models/calculationModel');

// GET /api/calculations
const getAll = async (req, res) => {
  try {
    const calculations = await Calculation.getAll(req.user.id);
    res.json(calculations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch calculations' });
  }
};

// GET /api/calculations/:id
const getById = async (req, res) => {
  try {
    const calculation = await Calculation.getById(req.params.id, req.user.id);
    if (!calculation) {
      return res.status(404).json({ error: 'Calculation not found' });
    }
    res.json(calculation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving calculation' });
  }
};

// POST /api/calculations
const create = async (req, res) => {
  try {
    const { name, data } = req.body;
    const id = await Calculation.create(name, data, req.user.id);
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error creating calculation' });
  }
};

// PUT /api/calculations/:id
const update = async (req, res) => {
  try {
    const { name, data } = req.body;
    const updated = await Calculation.update(req.params.id, name, data, req.user.id);
    if (!updated) {
      return res.status(404).json({ error: 'Calculation not found or unauthorized' });
    }
    res.json({ message: 'Calculation updated' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error updating calculation' });
  }
};

// DELETE /api/calculations/:id
const remove = async (req, res) => {
  try {
    const deleted = await Calculation.remove(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Calculation not found or unauthorized' });
    }
    res.json({ message: 'Calculation deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error deleting calculation' });
  }
};

// Export all controller functions
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
