const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [listings] = await pool.execute('SELECT * FROM products WHERE user_id = ?', [req.user.id]);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;