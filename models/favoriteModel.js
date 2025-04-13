const db = require('../db');

// Get all favorites for a user
const getAll = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

// Get a favorite by ID
const getById = async (id, userId) => {
  const [rows] = await db.query(
    'SELECT * FROM favorites WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return rows[0];
};

// Add a new favorite
const add = async (userId, calculationId) => {
  const [result] = await db.query(
    'INSERT INTO favorites (user_id, calculation_id) VALUES (?, ?)',
    [userId, calculationId]
  );
  return result.insertId;
};

// Remove a favorite
const remove = async (id, userId) => {
  const [result] = await db.query(
    'DELETE FROM favorites WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows;
};

// Export all functions
module.exports = {
  getAll,
  getById,
  add,
  remove
};
