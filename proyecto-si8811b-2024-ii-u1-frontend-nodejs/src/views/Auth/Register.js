// src/views/Auth/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import apiService from '../../services/apiService';  // Importar apiService
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/register.css';
import Alert from '../../components/Alert'; 
import logo from '../../assets/images/asistenciaupt.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Usar navigate para redirigir

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await apiService.createAccount({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      
      if (response.status === 201) {
        // Redirigir al usuario a la página de confirmación de cuenta
        navigate('/confirm-account');  // Redirigir a /confirm-account
      }
    } catch (error) {
      setError('Error en el registro. Por favor, verifica tus datos.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg" style={{ width: '400px' }}>
        <div className="card-body">
          
          <img src={logo} alt="Logo Asistencia UPT" className="logo-img" />
          {error && <Alert message={error} type="danger" />}
          <h5 className="card-title text-center title-custom">Registro</h5><br></br>
          <form onSubmit={handleSubmit} style={{ padding: '0px 20px 0px 20px' }}  className="shadow-none bg-transparent">
            {/* Input para nombre */}
            <div className="mb-3">
              <div className="input-group rounded-input">
                <span className="input-group-text rounded-start">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control rounded-end"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Input para correo electrónico */}
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

            {/* Input para contraseña */}
            <div className="mb-3">
              <div className="input-group rounded-input">
                <span className="input-group-text rounded-start">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control rounded-end"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input para confirmar contraseña */}
            <div className="mb-3">
              <div className="input-group rounded-input">
                <span className="input-group-text rounded-start">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control rounded-end"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Botón de registro */}
            <button 
              type="submit" 
              className="btn btn-primary w-100 rounded">
              Registrarse
            </button>
          </form>

          {/* Enlace a login */}
          <div className="footer mt-3 text-center">
            <p>
              ¿Ya tienes una cuenta? <Link to="/login">Inicia aquí</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
