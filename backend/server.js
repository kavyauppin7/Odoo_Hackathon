const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const listingRoutes = require('./routes/listings');
const profileRoutes = require('./routes/profile');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route setup
app.use('/api/auth', authRoutes);
app.use('/api/marketplace', productRoutes);
app.use('/api/my-orders', orderRoutes);
app.use('/api/my-listings', listingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
