// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="header">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Inicio</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/student-courses">Cursos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/attendance">Asistencia</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
);

export default Header;