const Favorite = require('../models/favoriteModel');

// GET /api/favorites
const getAll = async (req, res) => {
  try {
    const favorites = await Favorite.getAll(req.user.id);
    res.json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

// GET /api/favorites/:id
const getById = async (req, res) => {
  try {
    const favorite = await Favorite.getById(req.params.id, req.user.id);
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.json(favorite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving favorite' });
  }
};

// POST /api/favorites
const add = async (req, res) => {
  try {
    const { calculationId } = req.body;
    const id = await Favorite.add(req.user.id, calculationId);
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error adding favorite' });
  }
};

// DELETE /api/favorites/:id
const remove = async (req, res) => {
  try {
    const deleted = await Favorite.remove(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Favorite not found or unauthorized' });
    }
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error removing favorite' });
  }
};

// Export all controller functions
module.exports = {
  getAll,
  getById,
  add,
  remove
};
