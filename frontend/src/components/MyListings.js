import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/my-listings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setListings(res.data);
      } catch (err) {
        setError('Failed to load listings');
      }
    };
    fetchListings();
  }, []);

  const handleDeleteListing = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/marketplace/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Update listings state by removing the deleted product
      setListings(prevListings => prevListings.filter(listing => listing.id !== id));
      alert('Product removed from marketplace');
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Listings</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.map(listing => (
          <div key={listing.id} className="border p-4 rounded">
            {listing.image_url && <img src={listing.image_url} alt={listing.name} className="w-full h-48 object-cover mb-2" />}
            <h3 className="text-lg font-bold">{listing.name}</h3>
            <p>{listing.description}</p>
            <p>Rs{listing.price}</p>
            <p>{listing.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyListings;