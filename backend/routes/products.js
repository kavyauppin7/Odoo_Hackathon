const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [products] = await pool.execute('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const { name, description, price, category, image_url } = req.body;

  try {
    await pool.execute(
      'INSERT INTO products (user_id, name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, name, description, price, category, image_url]
    );
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      'DELETE FROM products WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found or not owned by user' });
    }
    res.json({ message: 'Product removed from marketplace' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a product
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Delete related cart items
    await pool.execute('DELETE FROM cart WHERE product_id = ?', [id]);
    // Delete related orders (optional, depending on requirements)
    await pool.execute('DELETE FROM orders WHERE product_id = ?', [id]);
    // Delete the product
    const [result] = await pool.execute(
      'DELETE FROM products WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found or not owned by user' });
    }
    res.json({ message: 'Product removed from marketplace' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;