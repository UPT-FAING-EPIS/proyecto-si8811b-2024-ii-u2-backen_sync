import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { BottomNav } from '../../components/BottomNav';
import { SyncPanel } from '../Sync/SyncPanel';
import { ScheduleView } from '../Schedule/ScheduleView';
import { AttendanceView } from '../Attendance/AttendanceView';
import { JustificationForm } from '../Justification/JustificationForm';
import { JustificationHistory } from '../Justification/JustificationHistory';
import { Navbar } from '../../components/NavBar';

export default function Dashboard() {
    const [activeView, setActiveView] = useState('sync');

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f3f4f6'
    };

    const mainContentStyle = {
        display: 'flex',
        overflow: 'hidden'
    };

    const sidebarStyle = {
        display: 'flex',
        overflowY: 'auto',
        backgroundColor: '#ffffff',
    };

    const contentStyle = {
        flex: 1,
        padding: '1rem',
        overflowY: 'auto'
    };

    return (
        <div style={containerStyle}>
            <Navbar />
            <div style={mainContentStyle}>
                <div style={sidebarStyle}>
                    <Sidebar activeView={activeView} setActiveView={setActiveView} />
                </div>
                <main style={contentStyle}>
                    {activeView === 'sync' && <SyncPanel />}
                    {activeView === 'schedule' && <ScheduleView />}
                    {activeView === 'attendance' && <AttendanceView />}
                    {activeView === 'justification-form' && <JustificationForm />}
                    {activeView === 'justification-history' && <JustificationHistory />}
                </main>
            </div>
            <BottomNav activeView={activeView} setActiveView={setActiveView} />
        </div>
    );
}
