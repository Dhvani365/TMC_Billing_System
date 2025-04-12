import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

   // Static credentials
  const staticEmail = 'test@gmail.com';
  const staticPassword = 'testpassword';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error message

    // Check for static credentials first
    // if (formData.email === staticEmail && formData.password === staticPassword) {
    //     localStorage.setItem("token", "dummy-token");
    //     localStorage.setItem("username", "Test User");
    //     localStorage.setItem("userid", "123456");
    //     console.log('Static login successful');
    //     navigate('/home'); // Redirect to Homepage after successful static login
    //     return;
    // }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', formData, { withCredentials: true });
      const { name, _id, token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", name);
      localStorage.setItem("userid", _id);
      localStorage.setItem("role", role);
      console.log('Login successful:', response.data);
      if(role === 'Admin') {
        navigate('/home'); // Redirect to Homepage after successful login
      }else if(role === 'Associate') {
        navigate('/billing'); // Redirect to Billing page after successful login
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-700">Login</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <div className='text-center'>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          New User?{' '}
          <a href="/signup" className="text-green-900 hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
