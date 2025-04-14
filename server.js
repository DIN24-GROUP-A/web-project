const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');


const app = express();
app.use(cors());
app.use(express.json())
const port = 3001;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'db_name',
  password: '',
  port: 3306
});

app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.status(200).send("Database connection is working.");
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send("Database connection failed.");
  }
});

app.post('/new', async (req, res) => {
  const { name, data, user_id } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO calculations (name, data, user_id) VALUES (?, ?, ?)',
      [name, data, user_id]
    );

    res.status(200).json({ id: result.insertId });
  } catch (error) {
    console.error("Error during insert:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/calculations", async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM calculations');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`)
})