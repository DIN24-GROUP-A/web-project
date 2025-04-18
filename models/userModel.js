const db = require('../db');
const bcrypt = require('bcryptjs'); // For hashing passwords

// Get all users
const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
  return rows;
};

// Get user by ID
const getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

// Create a new user
const create = async (username, email, password) => {
  // Hash password before saving to the database
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [result] = await db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );
  return result.insertId;
};

// Update user info
const update = async (id, username, email, password) => {
  let query = 'UPDATE users SET username = ?, email = ?';
  const params = [username, email];

  if (password) {
    // If password is provided, hash and update it as well
    const hashedPassword = await bcrypt.hash(password, 10);
    query += ', password = ?';
    params.push(hashedPassword);
  }

  query += ' WHERE id = ?';
  params.push(id);

  const [result] = await db.query(query, params);
  return result.affectedRows;
};

// Delete user
const remove = async (id) => {
  const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows;
};

// Check if email or username already exists
const checkUnique = async (email, username) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ? OR username = ?',
    [email, username]
  );
  return rows.length > 0;
};

// Export functions
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  checkUnique
};
