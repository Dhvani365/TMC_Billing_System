import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     try {
  //       const res = await axios.get(`${BACKEND_URL}/auth/check-auth`, {
  //         withCredentials: true,
  //       });
  //       const { _id, name, role } = res.data;
  //       console.log('Auto-login successful');
  //       if (role === 'Admin') {
  //         navigate('/home');
  //       } else if (role === 'Associate') {
  //         navigate('/billing');
  //       }
  //     } catch (err) {
  //       console.log('No valid JWT found. User must log in.');
  //     } finally {
  //       setAuthChecking(false); // Always set this to false after check
  //     }
  //   };

  //   checkLogin();
  // }, [authChecking, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormSubmitting(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, formData, {
        withCredentials: true,
      });
      const { name, _id, role } = response.data;
      localStorage.setItem('username', name);
      localStorage.setItem('userid', _id);
      localStorage.setItem('role', role);
      console.log(response.data);

      if (role === 'Admin') {
        navigate('/home');
      } else if (role === 'Associate') {
        navigate('/billing');
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setFormSubmitting(false);
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
              required
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
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              disabled={formSubmitting}
            >
              {formSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          New User?{' '}
          <button
            type="button"
            className="text-green-900 hover:underline"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
