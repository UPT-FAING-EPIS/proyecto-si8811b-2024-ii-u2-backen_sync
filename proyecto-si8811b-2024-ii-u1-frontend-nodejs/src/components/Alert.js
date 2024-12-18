// src/components/Alert.js
import React from 'react';

const Alert = ({ message, type }) => (
  <div className={`alert alert-${type}`} role="alert">
    {message}
  </div>
);

export default Alert;