// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if the user is authenticated

  if (!token) {
    return <Navigate to="/" />; // Redirect to login page if no token is found
  }

  return children; // Render the child components (route) if authenticated
};

export default ProtectedRoute;
