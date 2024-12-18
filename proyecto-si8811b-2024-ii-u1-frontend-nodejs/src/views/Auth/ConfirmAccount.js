// src/views/ConfirmAccount.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import '../../styles/confirm-account.css';
import logo from '../../assets/images/asistenciaupt.png';
import apiService from '../../services/apiService';  // Importar apiService

const ConfirmAccount = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await apiService.confirmAccount({ token: code });  // Enviar el token a la API

      if (response.status === 200) {
        setSuccessMessage('¡Tu cuenta ha sido confirmada exitosamente!');
        // Redirigir después de un corto periodo de tiempo
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setError('Código de confirmación inválido o expirado. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg" style={{ width: '400px' }}>
        <div className="card-body text-center">
          <img src={logo} alt="Logo Asistencia UPT" className="logo-img" />
          <h5 className="card-title title-custom">Confirmar Cuenta</h5>
          <br></br>
          {error && <Alert message={error} type="danger" />}
          {successMessage && <Alert message={successMessage} type="success" />}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Ingresa el código de confirmación"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded">
              Confirmar
            </button>
          </form>

          <div className="footer mt-3 text-center">
            <p>
              ¿Ya confirmaste tu cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAccount;
