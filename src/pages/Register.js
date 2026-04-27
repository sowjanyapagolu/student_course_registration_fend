import React from 'react';
import { Navigate } from 'react-router-dom';

const Register = () => {
  // Redirect to login since registration is handled there
  return <Navigate to="/login" replace />;
};

export default Register;