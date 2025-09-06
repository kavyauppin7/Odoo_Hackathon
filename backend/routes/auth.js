const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ecofinds_jwt_secret_2025';  

router.post('/signup', async (req, res) => {
  const { displayName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO users (display_name, email, password, joined_date) VALUES (?, ?, ?, ?)',
      [displayName, email, hashedPassword, new Date()]
    );
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
