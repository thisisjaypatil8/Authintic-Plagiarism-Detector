import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.token) {
    // If no user/token is found, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If user is logged in, show the component
  return children;
};

export default PrivateRoute;