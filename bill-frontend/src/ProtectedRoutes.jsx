// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  // const token = Cookies.get('jwt'); // Get the JWT from local storage
  // if (!token) {
  //   return <Navigate to="/" />; // Redirect to login page if no token is found
  // }

  return children; // Render the child components (route) if authenticated
};

export default ProtectedRoute;
