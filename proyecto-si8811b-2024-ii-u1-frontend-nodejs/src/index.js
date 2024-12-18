import React from 'react';
import ReactDOM from 'react-dom/client'; // Usar createRoot
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/login.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Importa el contexto de autenticación

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);