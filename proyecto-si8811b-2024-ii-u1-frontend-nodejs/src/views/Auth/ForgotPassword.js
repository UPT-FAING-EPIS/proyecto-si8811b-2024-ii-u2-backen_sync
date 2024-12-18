// src/views/ForgotPassword.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../../components/Input'; // Asegúrate de que la ruta sea correcta
import Button from '../../components/Button'; // Asegúrate de que la ruta sea correcta
import Alert from '../../components/Alert'; // Asegúrate de que la ruta sea correcta
import '../../styles/forgot-password.css';
import logo from '../../assets/images/asistenciaupt.png'; // Asegúrate de que la ruta sea correcta

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar el error anterior
    setMessage(''); // Limpiar el mensaje anterior

    try {
      const response = await axios.post('http://52.250.122.8:3000/api/v1/auth/forgot-password', {
        email,
      });

      if (response.status === 200) {
        setMessage('Se ha enviado un código de confirmación a tu correo electrónico.');
        // Opcional: Redirigir a la página de inicio de sesión o a otra página
        // navigate('/login');
      }
    } catch (error) {
      setError('Ocurrió un error. Por favor, verifica tu correo electrónico.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg" style={{ width: '400px' }}>
        <div className="card-body text-center">
          {/* Logo */}
          <img src={logo} alt="Logo Asistencia UPT" className="logo-img" />
          
          <h5 className="card-title text-center title-custom">Restablecer Contraseña</h5><br></br>
          
          {/* Mensajes de error o éxito */}
          {error && <Alert message={error} type="danger" />}
          {message && <Alert message={message} type="success" />}

          <form onSubmit={handleSubmit} style={{ padding: '0px 20px 0px 20px' }} className="shadow-none bg-transparent">
            {/* Input para correo electrónico */}
            <div className="mb-3">
              <div className="input-group rounded-input">
                <span className="input-group-text rounded-start">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control rounded-end"
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Botón para enviar código */}
            <button type="submit" className="btn btn-primary w-100 rounded">Enviar Código</button>
          </form>

          {/* Enlace a iniciar sesión */}
          <div className="footer mt-3 text-center">
            <p>
              ¿Recuperaste tu contraseña? <Link to="/login">Inicia sesión aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
