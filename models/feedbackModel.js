const db = require('../db');

// Get all feedback entries
const getAll = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM feedback WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

// Get a specific feedback entry by ID
const getById = async (id, userId) => {
  const [rows] = await db.query(
    'SELECT * FROM feedback WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return rows[0];
};

// Add new feedback
const add = async (userId, message) => {
  const [result] = await db.query(
    'INSERT INTO feedback (user_id, message) VALUES (?, ?)',
    [userId, message]
  );
  return result.insertId;
};

// Update feedback resolution status
const updateResolution = async (id, userId, resolved) => {
  const [result] = await db.query(
    'UPDATE feedback SET resolved = ? WHERE id = ? AND user_id = ?',
    [resolved, id, userId]
  );
  return result.affectedRows;
};

// Remove feedback entry
const remove = async (id, userId) => {
  const [result] = await db.query(
    'DELETE FROM feedback WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows;
};

// Export functions
module.exports = {
  getAll,
  getById,
  add,
  updateResolution,
  remove
};
