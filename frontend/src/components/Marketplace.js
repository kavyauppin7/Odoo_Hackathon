import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/marketplace', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products');
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = category === 'All' ? products : products.filter(p => p.category === category);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Marketplace</h2>
      <div className="mb-4">
        <button onClick={() => setCategory('All')} className="px-4 py-2 mr-2 bg-gray-200 rounded">All</button>
        <button onClick={() => setCategory('Clothes')} className="px-4 py-2 mr-2 bg-gray-200 rounded">Clothes</button>
        <button onClick={() => setCategory('Shoes')} className="px-4 py-2 mr-2 bg-gray-200 rounded">Shoes</button>
        <button onClick={() => setCategory('Furniture')} className="px-4 py-2 mr-2 bg-gray-200 rounded">Furniture</button>
        <button onClick={() => setCategory('Electronics')} className="px-4 py-2 bg-gray-200 rounded">Electronics</button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="border p-4 rounded">
            {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover mb-2" />}
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p>{product.description}</p>
            <p>Rs{product.price}</p>
            <button
              onClick={async () => {
                try {
                  await axios.post('http://localhost:3000/api/cart', { product_id: product.id, quantity: 1 }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                  });
                  alert('Added to cart');
                } catch (err) {
                  alert('Failed to add to cart');
                }
              }}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;