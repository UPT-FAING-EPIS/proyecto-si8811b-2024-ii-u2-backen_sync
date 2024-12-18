import JustificationForm from "./JustificationForm";
import JustificationHistory from "./JustificationHistory";
import Schedule from "./Schedule";
import Attendance from "./Attendance";
import SyncPanel from "./SyncPanel"; // Importa los componentes necesarios

export function MainContent({ activeView }) {
    switch (activeView) {
        case 'justification-form':
            return <JustificationForm />;
        case 'justification-history':
            return <JustificationHistory />;
        case 'schedule':
            return <Schedule />;
        case 'attendance':
            return <Attendance />;
        case 'sync':
            return <SyncPanel />;
        // Otros casos si hay más vistas...
        default:
            return <div>Selecciona una opción del menú</div>;
    }
}
