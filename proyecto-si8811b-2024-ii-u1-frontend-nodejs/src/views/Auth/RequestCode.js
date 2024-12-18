// src/views/Auth/RequestCode.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../../services/apiService'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/request-code.css';
import Alert from '../../components/Alert'; 
import logo from '../../assets/images/asistenciaupt.png';

const RequestCode = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validar formato del email antes de enviarlo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    try {
      const response = await apiService.requestCode({ email });
      
      if (response.status === 200) {
        setSuccessMessage('Código de confirmación enviado correctamente. Revisa tu correo.');
        setTimeout(() => {
          navigate('/confirm-account'); // Redirigir a la confirmación de cuenta
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const validationErrors = error.response.data.errors;
        const emailError = validationErrors.find(err => err.path === 'email');
        if (emailError) {
          setError('Correo electrónico no válido.');
        }
      } else {
        setError('Error al solicitar el código de confirmación. Inténtalo más tarde.');
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg" style={{ width: '400px' }}>
        <div className="card-body">
          <img src={logo} alt="Logo Asistencia UPT" className="logo-img" />
          <h5 className="card-title text-center title-custom">Solicitar Código de Confirmación</h5>
          <br />
          {error && <Alert message={error} type="danger" />}
          {successMessage && <Alert message={successMessage} type="success" />}

          <form onSubmit={handleSubmit} style={{ padding: '0px 20px 0px 20px' }} className='shadow-none bg-transparent'>
            <div className="mb-3">
              <div className="input-group rounded-input">
                <span className="input-group-text rounded-start">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control rounded-end"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 rounded">
              Enviar Código
            </button>
          </form>

          <div className="footer mt-3 text-center">
            <p>
              ¿Ya tienes el código? <Link to="/confirm-account">Confirma tu cuenta aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCode;
