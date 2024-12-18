// src/pages/NotFound.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/notfound.css'; // Asegúrate de tener un archivo de estilos

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1>Página No Encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className="btn btn-primary">Regresar a Inicio</Link>
    </div>
  );
};

export default NotFound;
