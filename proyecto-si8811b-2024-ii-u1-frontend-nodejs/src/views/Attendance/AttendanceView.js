import axios from 'axios'
import { useState, useEffect } from 'react'
import { useStore } from '../Auth/Login'

export function AttendanceView() {
    const [attendanceData, setAttendanceData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const { token } = useStore()

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get('http://52.225.232.58:3000/api/v1/attendance', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                console.log("API Response:", response.data)

                if (response.data.attendanceData) {
                    setAttendanceData(response.data.attendanceData)
                } else {
                    console.error("Error: Attendance data is missing in the response.")
                    throw new Error('Error al obtener las asistencias')
                }
            } catch (error) {
                console.error("Error fetching attendance:", error)
                setError('No se pudo cargar la asistencia. Por favor, intente más tarde.')
            } finally {
                setLoading(false)
            }
        }

        fetchAttendance()
    }, [token])

    if (loading) return <div style={styles.centerText}>Cargando asistencias...</div>
    if (error) return <div style={{ ...styles.centerText, color: 'red' }}>{error}</div>

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Mis Asistencias</h2>
            <div style={styles.attendanceContainer}>
                {attendanceData.length > 0 ? (
                    attendanceData.map((course, index) => (
                        <div key={index} style={styles.courseContainer}>
                            <h3 style={styles.courseName}>{course.curso}</h3>
                            {course.asistencias.length > 0 ? (
                                <table style={styles.attendanceTable}>
                                    <thead>
                                        <tr>
                                            <th style={styles.tableHeader}>Fecha</th>
                                            <th style={styles.tableHeader}>Día</th>
                                            <th style={styles.tableHeader}>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {course.asistencias.map((attendance, idx) => (
                                            <tr key={idx}>
                                                <td style={styles.tableCell}>{attendance.fecha}</td>
                                                <td style={styles.tableCell}>{attendance.dia}</td>
                                                <td style={styles.tableCell}>
                                                    <span
                                                        style={{
                                                            ...styles.attendanceStatus,
                                                            color:
                                                                attendance.estado === 'Asiste'
                                                                    ? 'green'
                                                                    : 'red',
                                                        }}
                                                    >
                                                        {attendance.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={styles.noAttendance}>No hay asistencias registradas.</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p style={styles.noAttendance}>No se encontraron datos de asistencia.</p>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    heading: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px',
    },
    centerText: {
        textAlign: 'center',
    },
    attendanceContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    courseContainer: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#f9f9f9',
    },
    courseName: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#555',
        marginBottom: '12px',
    },
    attendanceTable: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    tableHeader: {
        backgroundColor: '#f1f1f1',
        fontWeight: 'bold',
        textAlign: 'left',
        padding: '8px',
        fontSize: '18px',
    },
    tableCell: {
        padding: '8px',
        fontSize: '16px',
        color: '#333',
    },
    attendanceStatus: {
        fontWeight: 'bold',
    },
    noAttendance: {
        fontSize: '16px',
        color: '#888',
    },
}
