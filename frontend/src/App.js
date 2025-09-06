import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Marketplace from './components/Marketplace';
import AddProduct from './components/AddProduct';
import MyOrders from './components/MyOrders';
import MyListings from './components/MyListings';
import Profile from './components/Profile';
import Cart from './components/Cart';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated && <Navbar handleLogout={handleLogout} />}
        <Routes>
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/marketplace" />} />
          <Route path="/login" element={!isAuthenticated ? <Login handleLogin={handleLogin} /> : <Navigate to="/marketplace" />} />
          <Route path="/marketplace" element={isAuthenticated ? <Marketplace /> : <Navigate to="/login" />} />
          <Route path="/add-product" element={isAuthenticated ? <AddProduct /> : <Navigate to="/login" />} />
          <Route path="/my-orders" element={isAuthenticated ? <MyOrders /> : <Navigate to="/login" />} />
          <Route path="/my-listings" element={isAuthenticated ? <MyListings /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/marketplace" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;