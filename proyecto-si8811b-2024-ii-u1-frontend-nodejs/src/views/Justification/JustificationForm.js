import { useState } from "react";
import { useStore } from '../Auth/Login'; // Importa el contexto de autenticación

export function JustificationForm() {
    const { token } = useStore() // Obtiene el token desde el contexto

    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]); // Lista de archivos
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const totalSize =
            selectedFiles.reduce((sum, file) => sum + file.size, 0) +
            files.reduce((sum, file) => sum + file.size, 0);

        if (totalSize > 10 * 1024 * 1024) {
            setMessage("El total de los archivos no debe exceder los 10 MB.");
        } else {
            setMessage("");
            setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        }
    };

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage("");

        if (files.length === 0) {
            setMessage("Debe adjuntar al menos un archivo.");
            setSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append("date", date);
        formData.append("reason", reason);
        formData.append("description", description);

        // Adjuntar todos los archivos con el nombre clave "attachment"
        files.forEach((file) => {
            formData.append("attachment", file);
        });

        try {
            console.log("Enviando datos:", {
                date,
                reason,
                description,
                files: files.map(file => file.name), // Solo mostrar los nombres para depuración
            });

            const response = await fetch(
                "http://52.225.232.58:3000/api/v1/justifications/submit",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`, // Usa el token del contexto
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message || "Justificación enviada exitosamente");
                setDate(new Date().toISOString().split("T")[0]); // Reinicia la fecha al día actual
                setReason("");
                setDescription("");
                setFiles([]);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Error al enviar la justificación.");
            }
        } catch (error) {
            console.error("Error al enviar la justificación:", error);
            setMessage("Error al enviar la justificación. Por favor, intente nuevamente.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Enviar Justificación</h2>
            <form onSubmit={handleSubmit}>
                {/* Campo Fecha */}
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                        Fecha
                    </label>
                    <input
                        id="date"
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                {/* Campo Razón */}
                <div className="mb-3">
                    <label htmlFor="reason" className="form-label">
                        Razón
                    </label>
                    <input
                        id="reason"
                        type="text"
                        className="form-control"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                    />
                </div>

                {/* Campo Descripción */}
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        required
                    ></textarea>
                </div>

                {/* Campo Archivos */}
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">
                        Adjuntar archivos
                    </label>
                    <div className="border border-dashed p-4 text-center rounded">
                        <i className="bi bi-upload fs-1 text-secondary"></i>
                        <div className="mt-2">
                            <label className="btn btn-outline-primary btn-sm">
                                Subir archivos
                                <input
                                    id="file"
                                    type="file"
                                    className="form-control d-none"
                                    onChange={handleFileChange}
                                    accept=".png,.jpg,.jpeg,.pdf"
                                    multiple
                                />
                            </label>
                            <p className="text-muted small mt-2">
                                PNG, JPG, PDF hasta 10MB en total
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vista previa de los archivos */}
                {files.length > 0 && (
                    <div className="mt-3">
                        <h6>Archivos seleccionados:</h6>
                        <ul className="list-group">
                            {files.map((file, index) => (
                                <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <span>
                                        <strong>Nombre:</strong> {file.name} <br />
                                        <strong>Tamaño:</strong>{" "}
                                        {(file.size / 1024).toFixed(2)} KB
                                    </span>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemoveFile(index)}
                                    >
                                        Quitar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Botón Enviar */}
                <div className="mt-3">
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={submitting}
                    >
                        {submitting ? "Enviando..." : "Enviar Justificación"}
                    </button>
                </div>
            </form>

            {/* Mensaje de resultado */}
            {message && (
                <div
                    className={`mt-4 alert ${
                        message.includes("Error") ? "alert-danger" : "alert-success"
                    }`}
                >
                    {message}
                </div>
            )}
        </div>
    );
}
