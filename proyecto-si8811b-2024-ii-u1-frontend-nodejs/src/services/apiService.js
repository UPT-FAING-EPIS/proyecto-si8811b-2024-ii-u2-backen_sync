// src/services/apiService.js
import axios from 'axios';

// URL base de la API
const API_URL = 'http://52.225.232.58:3000/api/v1';

const apiService = {
    // Autenticación
    
    createAccount: (data) => {
        console.log(data);
        axios.post(`${API_URL}/auth/create-account`, data)},
    confirmAccount: (data) => axios.post(`${API_URL}/auth/confirm-account`, data),
    login: (data) => axios.post(`${API_URL}/auth/login`, data),

    // Solicitar código de confirmación
    requestCode: (email) => {
        return axios.post(`${API_URL}/auth/request-code`, { email }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Si se requiere token
            }
        })
        .then(response => {
            console.log('Código enviado exitosamente', response.data);
        })
        .catch(error => {
            // Mostrar error de validación
            if (error.response && error.response.data.errors) {
                console.error('Error al solicitar el código de confirmación:', error.response.data.errors);
            } else {
                console.error('Error inesperado:', error.message);
            }
        });
    }
    ,

    forgotPassword: (data) => axios.post(`${API_URL}/auth/forgot-password`, data),
    validateToken: (data) => axios.post(`${API_URL}/auth/validate-token`, data),
    updatePassword: (token, data) => axios.post(`${API_URL}/auth/update-password/${token}`, data),
    getUser: () => axios.get(`${API_URL}/auth/user`),

    // Sincronización
    syncData: (data) => axios.post(`${API_URL}/sync/data`, data),
    syncSchedule: (data) => axios.post(`${API_URL}/sync/schedule`, data),
    syncAttendance: (data) => axios.post(`${API_URL}/sync/attendance`, data),

    // Horario
    getSchedule: () => axios.get(`${API_URL}/schedule`),

    // Asistencia
    getAttendance: () => axios.get(`${API_URL}/attendance`)
};

export default apiService;
