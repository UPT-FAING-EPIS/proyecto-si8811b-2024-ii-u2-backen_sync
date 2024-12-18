// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = dateTime.toLocaleDateString();
  const formattedTime = dateTime.toLocaleTimeString();

  return (
    <div className="home-container">
      <div className="home-background"></div>

      <div className="home-content">
        <h1>Bienvenido al <br />Sistema de Asistencia</h1>

        <div className="date-time">
          <div className="date-time-box">
            <p className="date-time-text">
              {formattedDate} <br />
              {formattedTime}
            </p>
          </div>
        </div>
        <p>Por favor, inicia sesión para acceder a tu cuenta.</p>
        <Link to="/login" className="btn">Iniciar Sesión</Link>
      </div>
    </div>
  );
};

export default Home;
