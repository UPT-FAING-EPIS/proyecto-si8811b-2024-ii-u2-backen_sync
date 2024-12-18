import { useState, useEffect } from "react";
import { useStore } from '../Auth/Login';  // Importa el contexto de autenticación

export function JustificationHistory() {
    const { token } = useStore(); // Obtiene el token desde el contexto

    const [justifications, setJustifications] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    const fetchJustifications = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `http://52.225.232.58:3000/api/v1/justifications/history?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Error al obtener el historial de justificaciones.");
            }

            const data = await response.json();

            setJustifications(data.justifications || []); // Ajustado según la estructura de respuesta
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJustifications();
    }, [page]);

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    if (loading) return <div className="text-center mt-4">Cargando historial...</div>;
    if (error) return <div className="text-danger text-center mt-4">{error}</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Historial de Justificaciones</h2>
            {justifications.length === 0 ? (
                <p className="text-center">No hay justificaciones registradas.</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Razón</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Archivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {justifications.map((justification) => (
                            <tr key={justification.id}>
                                <td>{new Date(justification.date).toLocaleDateString()}</td>
                                <td>{justification.reason}</td>
                                <td>{justification.description}</td>
                                <td>
                                    <span
                                        className={`badge ${
                                            justification.status === "Aprobado"
                                                ? "bg-success"
                                                : justification.status === "Pendiente"
                                                ? "bg-warning"
                                                : "bg-danger"
                                        }`}
                                    >
                                        {justification.status}
                                    </span>
                                </td>
                                <td>
                                    {justification.attachmentUrl ? (
                                        <a
                                            href={`http://52.225.232.58:3000${justification.attachmentUrl}`} // Construye la URL completa
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-link btn-sm"
                                        >
                                            Descargar
                                        </a>
                                    ) : (
                                        "No disponible"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="d-flex justify-content-between mt-3">
                <button
                    className="btn btn-secondary"
                    onClick={handlePrevPage}
                    disabled={page === 1}
                >
                    Anterior
                </button>
                <span>
                    Página {page} de {totalPages}
                </span>
                <button
                    className="btn btn-secondary"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
