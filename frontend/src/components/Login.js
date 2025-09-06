import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ handleLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', formData);
      handleLogin(res.data.token);
      navigate('/marketplace');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-[#1a3c3c] to-[#0a1e2e] font-['Spline Sans']">
      <div
        className="text-white text-center p-8 rounded-2xl shadow-lg w-full max-w-md"
        style={{
          background: "rgba(30, 50, 50, 0.9)",
          backdropFilter: "blur(10px)"
        }}
      >

        <div className="flex justify-center">
  <img 
    src="/logo.png" 
    alt="Logo" 
    className="w-[150px] h-[150px] object-cover rounded-full" 
  />
</div>


        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-sm text-gray-300 mb-6">Login to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400">{error}</p>}

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-md focus:outline-none"
            style={{
              background: "#1e2e2e",
              border: "1px solid #2a4444",
              color: "#e0e0e0"
            }}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-md focus:outline-none"
            style={{
              background: "#1e2e2e",
              border: "1px solid #2a4444",
              color: "#e0e0e0"
            }}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-md text-white font-semibold"
            style={{ background: "#2ecc71" }}
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:text-green-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;