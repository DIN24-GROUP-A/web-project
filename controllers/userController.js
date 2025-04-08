const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // For generating JWT tokens

// GET /api/users
const getAll = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// GET /api/users/:id
const getById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving user' });
  }
};

// POST /api/users
const create = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email or username already exists
    const existingUser = await User.checkUnique(email, username);
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already taken' });
    }

    const id = await User.create(username, email, password);
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error creating user' });
  }
};

// PUT /api/users/:id
const update = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updated = await User.update(req.params.id, username, email, password);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error updating user' });
  }
};

// DELETE /api/users/:id
const remove = async (req, res) => {
  try {
    const deleted = await User.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error removing user' });
  }
};

// POST /api/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error during login' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  login
};
