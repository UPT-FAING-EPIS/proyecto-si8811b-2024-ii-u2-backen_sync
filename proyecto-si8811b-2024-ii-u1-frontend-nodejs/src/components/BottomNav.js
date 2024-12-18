export function BottomNav({ activeView, setActiveView }) {
  const navItems = [
      { id: 'sync', icon: 'bi-arrow-clockwise', label: 'Sincronizar' },
      { id: 'schedule', icon: 'bi-calendar', label: 'Horarios' },
      { id: 'attendance', icon: 'bi-clock', label: 'Asistencias' },
      { id: 'justification', icon: 'bi-file-text', label: 'Justificaciones' },
  ];

  return (
      <nav className="navbar navbar-light bg-white fixed-bottom shadow-sm d-md-none">
          <div className="container-fluid d-flex justify-content-around">
              {navItems.map((item) => (
                  <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`btn btn-link text-decoration-none d-flex flex-column align-items-center ${
                          activeView === item.id ? 'text-primary' : 'text-secondary'
                      }`}
                  >
                      <i className={`bi ${item.icon} fs-4`}></i>
                      <span className="small">{item.label}</span>
                  </button>
              ))}
          </div>
      </nav>
  );
}
