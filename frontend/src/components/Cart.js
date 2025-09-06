import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCart(res.data);
      } catch (err) {
        setError('Failed to load cart');
      }
    };
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    try {
      await axios.post('http://localhost:3000/api/cart/checkout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCart({ items: [], total: 0 });
      alert('Checkout successful');
    } catch (err) {
      setError('Failed to checkout');
    }
  };


  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Update cart state by removing the deleted item
      setCart(prevCart => ({
        items: prevCart.items.filter(item => item.id !== id),
        total: prevCart.items
          .filter(item => item.id !== id)
          .reduce((sum, item) => sum + item.price * item.quantity, 0)
      }));
      alert('Item removed from cart');
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {cart.items.map(item => (
          <div key={item.id} className="border p-4 rounded">
            <p><strong>Product:</strong> {item.name}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> Rs{item.price}</p>
          </div>
        ))}
        <p className="text-lg font-bold">Total to Pay: Rs{cart.total}</p>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;