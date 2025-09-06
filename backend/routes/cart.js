const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  const { product_id, quantity } = req.body;

  try {
    await pool.execute(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [req.user.id, product_id, quantity]
    );
    res.status(201).json({ message: 'Added to cart' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [cartItems] = await pool.execute(
      'SELECT c.*, p.name, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
      [req.user.id]
    );
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items: cartItems, total });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found or not owned by user' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    const [cartItems] = await pool.execute(
      'SELECT c.*, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
      [req.user.id]
    );

    for (const item of cartItems) {
      await pool.execute(
        'INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)',
        [req.user.id, item.product_id, item.quantity, item.price * item.quantity]
      );
    }

    await pool.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Checkout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;