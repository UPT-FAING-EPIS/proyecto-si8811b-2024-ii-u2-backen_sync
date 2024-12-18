// Input.js
import React from 'react';

const Input = ({ type, placeholder, value, onChange, label, id, required, className }) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        id={id}
        required={required}
        className={`form-control ${className}`} // Añadir className aquí
      />
    </div>
  );
};

export default Input;
