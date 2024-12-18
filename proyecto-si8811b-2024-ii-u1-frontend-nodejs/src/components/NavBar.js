import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Navbar() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email"); // Obtiene el correo del usuario desde localStorage

    const handleLogout = () => {
        // Limpia los datos de sesión
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        navigate('/'); // Redirige al login
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">
                <a className="navbar-brand text-primary fw-bold" href="#">
                    Portal Estudiantil
                </a>

                <ul className="navbar-nav ms-auto">
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle d-flex align-items-center"
                            href="#"
                            id="userDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi bi-person-circle fs-4 me-2 text-secondary"></i>
                            <span className="d-none d-lg-inline">{email || "Usuario"}</span> {/* Muestra el correo */}
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li>
                                <button
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={handleLogout}
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
