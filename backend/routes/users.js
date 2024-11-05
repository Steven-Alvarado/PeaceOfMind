const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Database


// Route to get all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); // Adjust the query as needed
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Route to get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error retrieving user:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;

