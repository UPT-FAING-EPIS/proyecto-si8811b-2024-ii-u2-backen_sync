import { useState } from "react";

export function Sidebar({ activeView, setActiveView }) {
    const [showJustificationsSubmenu, setShowJustificationsSubmenu] = useState(false);

    const navItems = [
        { id: 'sync', icon: 'bi-arrow-clockwise', label: 'Sincronizar' },
        { id: 'schedule', icon: 'bi-calendar', label: 'Horarios' },
        { id: 'attendance', icon: 'bi-clock', label: 'Asistencias' },
        {
            id: 'justifications',
            icon: 'bi-file-text',
            label: 'Justificaciones',
            submenu: [
                { id: 'justification-form', label: 'Formulario' },
                { id: 'justification-history', label: 'Historial' }
            ]
        }
    ];

    return (
        <aside className="d-none d-md-flex flex-column bg-white shadow h-100" style={{ width: '16rem' }}>
            <div className="p-4 border-bottom">
                <h2 className="h5 text-secondary">Menú</h2>
            </div>
            <nav className="flex-grow-1 overflow-auto">
                {navItems.map((item) => (
                    <div key={item.id}>
                        <button
                            onClick={() => {
                                if (item.submenu) {
                                    setShowJustificationsSubmenu(!showJustificationsSubmenu);
                                } else {
                                    setActiveView(item.id);
                                }
                            }}
                            className={`btn w-100 text-start d-flex align-items-center py-3 px-4 border-0 ${activeView === item.id ? 'bg-primary text-white' : 'text-secondary'
                                }`}
                        >
                            <i className={`bi ${item.icon} me-2`}></i>
                            <span>{item.label}</span>
                        </button>
                        {item.submenu && showJustificationsSubmenu && (
                            <div className="ps-4">
                                {item.submenu.map((submenuItem) => (
                                    <button
                                        key={submenuItem.id}
                                        onClick={() => setActiveView(submenuItem.id)}
                                        className={`btn w-100 text-start py-2 px-4 border-0 ${activeView === submenuItem.id ? 'bg-primary text-white' : 'text-secondary'
                                            }`}
                                    >
                                        {submenuItem.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
}
