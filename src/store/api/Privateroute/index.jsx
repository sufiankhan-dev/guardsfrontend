import React from 'react';
import { Navigate } from 'react-router-dom';
import store from '@/store';

const getUserDetails = () => {
  const state = store.getState();
  const user = state.auth.user || {};
  return {
    token: localStorage.getItem('token'),
    authType: user.type,
  };
};

const PrivateRoute = ({ element: Component, requiredAuthTypes, ...rest }) => {
  const { token, authType } = getUserDetails();
  const isAuthenticated = token && requiredAuthTypes.includes(authType);

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
