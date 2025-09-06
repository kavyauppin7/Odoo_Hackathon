import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ handleLogout }) => {
  return (
    <nav className="bg-green-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">EcoFinds</h1>
        <div className="space-x-4">
          <Link to="/marketplace" className="text-white hover:underline">Marketplace</Link>
          <Link to="/add-product" className="text-white hover:underline">Sell</Link>
          <Link to="/my-orders" className="text-white hover:underline">My Orders</Link>
          <Link to="/my-listings" className="text-white hover:underline">My Listings</Link>
          <Link to="/profile" className="text-white hover:underline">Profile</Link>
          <Link to="/cart" className="text-white hover:underline">Cart</Link>
          <button onClick={handleLogout} className="text-white hover:underline">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;