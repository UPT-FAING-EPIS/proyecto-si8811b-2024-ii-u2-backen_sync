// src/components/Button.js
import React from 'react';

const Button = ({ label, onClick, className, type = 'button' }) => {
  return (
    <button type={type} className={`btn ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;