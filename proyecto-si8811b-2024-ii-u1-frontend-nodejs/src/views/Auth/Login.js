import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/login.css';
import logo from '../../assets/images/asistenciaupt.png';
import apiService from '../../services/apiService';
import { create } from 'zustand';

// Función para obtener el token inicial desde el localStorage
const getInitialToken = () => {
  return localStorage.getItem("token") || "";
};

// Configuración de Zustand para el manejo del token
export const useStore = create((set) => ({
  token: getInitialToken(),
  setToken: (token) => {
    set(() => ({ token }));
    localStorage.setItem("token", token);
  },
  isAuthenticated: () => !!localStorage.getItem("token"),
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { setToken } = useStore();

  // Alternar visibilidad de la contraseña
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiService.login({ email, password });
      if (response.status === 200) {
        console.log(response.data);
        setToken(response.data);
        localStorage.setItem("email", email);
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Error de validación. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg" style={{ width: '400px' }}>
        <div className="card-body">
          <img src={logo} alt="Logo Asistencia UPT" className="logo-img" />
          <h5 className="card-title text-center title-custom">Iniciar Sesión</h5>
          <br />
          {error && (
            <div style={{ padding: '10px 0px 10px 20px' }} className="alert alert-danger">
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            style={{ padding: '0px 20px 0px 20px' }}
            className="shadow-none bg-transparent"
          >
            <div className="mb-3">
              <div className="input-group rounded-input">
                <span className="input-group-text rounded-start">
                  <i className="bi bi-person"></i>
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

            <div className="mb-3">
              <div className="input-group rounded-input">
                <span className="input-group-text rounded-start">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-blue text-white rounded-end"
                  onClick={toggleShowPassword}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 rounded">
              Iniciar Sesión
            </button>
          </form>

          <div className="footer mt-3 text-center">
            <p>
              ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
            <p>
              ¿Olvidaste tu contraseña? <Link to="/forgot-password">Restablece aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
