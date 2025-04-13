import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error message
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/signup`, formData, { withCredentials: true });
      console.log('Signup successful:', response.data);
      navigate('/'); // Redirect to LoginPage on successful signup
    } catch (error) {
      console.error('Error during signup:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-700">Sign Up</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Sign Up
          </button>
          <div className="text-center mt-4">
            Already a User?{' '}
            <a href="/" className="text-green-900 hover:underline">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
