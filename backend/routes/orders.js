const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.execute(
      'SELECT o.*, p.name, p.price FROM orders o JOIN products p ON o.product_id = p.id WHERE o.user_id = ?',
      [req.user.id]
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;