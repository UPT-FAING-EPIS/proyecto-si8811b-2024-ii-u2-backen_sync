import axios from 'axios';
import { useState } from 'react';
import { useStore } from '../Auth/Login';

export function SyncPanel() {
    const [syncStatus, setSyncStatus] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPersonalSyncDone, setIsPersonalSyncDone] = useState(false);

    const { token } = useStore()
    console.log(token)
    const syncItems = [
        { id: 'schedule', label: 'Horarios', endpoint: 'http://52.225.232.58:3000/api/v1/sync/schedule' },
        { id: 'attendance', label: 'Asistencias', endpoint: 'http://52.225.232.58:3000/api/v1/sync/attendance' },
    ];

    const handleSync = async (endpoint, id) => {

        setSyncStatus((prev) => ({ ...prev, [id]: 'Sincronizando...' }));
        try {
            console.log({token,codigo:username,contrasena:password})
            const res = await axios.post(`http://52.225.232.58:3000/api/v1/sync/${id}`,{codigo:username,contrasena:password},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.data) {
                setSyncStatus((prev) => ({ ...prev, [id]: 'Sincronización exitosa' }));
            } else {
                throw new Error('Error en la sincronización');
            }
        } catch (error) {
            setSyncStatus((prev) => ({ ...prev, [id]: 'Error en la sincronización' }));
        }
    };

    const handlePersonalSync = async (e) => {
        e.preventDefault();
        setSyncStatus((prev) => ({ ...prev, personal: 'Sincronizando...' }));
        try {
            const res = await axios.post("http://52.225.232.58:3000/api/v1/sync/data",{codigo:username,contrasena:password},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(res.data.message){
                setIsPersonalSyncDone(true);
                setSyncStatus({personal: 'Sincronización exitosa' });
                console.log({res:res.data})
            }
        } catch (error) {
            console.log("asd",error)
            setSyncStatus((prev) => ({ ...prev, personal: 'Error en la sincronización' }));
        } finally {
            setIsModalOpen(false);
        }
    };

   

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Panel de Sincronización</h2>

            {/* Sincronización Personalizada */}
            <div className="card mb-3">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <span>Sincronización Personalizada</span>
                    <div className="d-flex align-items-center">
                        <span className="text-muted me-2">{syncStatus.personal}</span>
                        <button
                            className="btn btn-success btn-sm"
                            onClick={() => setIsModalOpen(true)}
                            disabled={isPersonalSyncDone}
                        >
                            <i className="bi bi-lock me-1"></i>
                            {isPersonalSyncDone ? 'Sincronizado' : 'Sincronizar'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sincronización de otros elementos */}
            {syncItems.map((item) => (
                <div key={item.id} className="card mb-3 cursor-pointer">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <span>{item.label}</span>
                        <div className="d-flex align-items-center">
                            <span className="text-muted me-2">{syncStatus[item.id]}</span>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSync(item.endpoint, item.id)}
                                disabled={!isPersonalSyncDone}
                            >
                                <i className="bi bi-arrow-clockwise me-1"></i>
                                Sincronizar
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {isModalOpen && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Sincronización Personalizada</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setIsModalOpen(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <form onSubmit={handlePersonalSync}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">
                                            Usuario
                                        </label>
                                        <input
                                            id="username"
                                            type="text"
                                            className="form-control"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Contraseña
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Sincronizar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
