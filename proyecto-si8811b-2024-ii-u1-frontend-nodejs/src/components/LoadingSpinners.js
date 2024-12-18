// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);

export default LoadingSpinner;