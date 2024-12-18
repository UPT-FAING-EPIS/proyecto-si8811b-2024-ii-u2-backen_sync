import axios from 'axios'
import { useState, useEffect } from 'react'
import { useStore } from '../Auth/Login'

export function ScheduleView() {
    const [schedule, setSchedule] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const { token } = useStore()
    console.log("Token:", token)

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get('http://52.225.232.58:3000/api/v1/schedule', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                console.log("API Response:", response.data)

                if (response.data.schedule) {
                    setSchedule(response.data.schedule)
                } else {
                    console.error("Error: Schedule data is missing in the response.")
                    throw new Error('Error al obtener el horario')
                }
            } catch (error) {
                console.error("Error fetching schedule:", error)
                setError('No se pudo cargar el horario. Por favor, intente más tarde.')
            } finally {
                setLoading(false)
            }
        }

        fetchSchedule()
    }, [token])

    if (loading) return <div style={styles.centerText}>Cargando horario...</div>
    if (error) return <div style={{ ...styles.centerText, color: 'red' }}>{error}</div>

    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

    // Función para normalizar los nombres de los días
    const normalizeDay = day => {
        const mapping = {
            Lunes: 'Lunes',
            Martes: 'Martes',
            Miércoles: 'Miércoles',
            Jueves: 'Jueves',
            Viernes: 'Viernes',
            Sábado: 'Sabado', // API usa 'Sabado' sin tilde
            Domingo: 'Domingo',
        }
        return mapping[day] || day
    }

    // Procesar los horarios por día
    const scheduleByDay = days.map(day => ({
        day: day,
        courses: schedule
            .map(course => ({
                ...course,
                times: course.schedule[normalizeDay(day)] || []
            }))
            .filter(course => course.times) // Filtrar solo los días con clases
    }))

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Mi Horario</h2>
            <div style={styles.tableContainer}>
                <table style={styles.scheduleTable}>
                    <thead>
                        <tr>
                            <th style={styles.courseColumn}>Curso</th>
                            {days.map(day => (
                                <th key={day} style={styles.dayColumn}>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleByDay[0].courses.map((course, index) => (
                            <tr key={index}>
                                <td style={styles.courseCell}>{course.name} ({course.code})</td>
                                {days.map(day => {
                                    const courseForDay = course.schedule[normalizeDay(day)] || []
                                    return (
                                        <td key={day} style={styles.timeCell}>
                                            {courseForDay.length > 0 ? (
                                                <ul style={styles.timeList}>
                                                    {courseForDay.map((time, idx) => (
                                                        <li key={idx} style={styles.timeItem}>{time}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span style={styles.noClasses}>No hay clases</span>
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
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
    tableContainer: {
        overflowX: 'auto',
        flexGrow: 1,
    },
    scheduleTable: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    courseColumn: {
        width: '200px',
        fontWeight: 'bold',
        padding: '12px',
        textAlign: 'left',
        fontSize: '24px',
        backgroundColor: '#f1f1f1',
    },
    dayColumn: {
        textAlign: 'center',
        padding: '12px',
        fontSize: '24px',
        fontWeight: 'bold',
        backgroundColor: '#f1f1f1',
        color: '#666',
    },
    courseCell: {
        padding: '12px',
        fontSize: '18px',
        color: '#333',
    },
    timeCell: {
        textAlign: 'center',
        padding: '8px',
        fontSize: '18px',
        color: '#555',
    },
    timeList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    timeItem: {
        color: '#5a6cbf',
    },
    noClasses: {
        color: '#aaa',
    },
}

