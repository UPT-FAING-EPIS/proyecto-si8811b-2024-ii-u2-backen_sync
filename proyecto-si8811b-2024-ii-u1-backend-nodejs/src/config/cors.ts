import { CorsOptions } from 'cors';
import logger from '../logs/logger';

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {

        const whitelist = [
            process.env.FRONTEND_URL,
            'http://localhost:3000',
            'http://localhost:4000',
            'http://38.250.158.159',
            'http://52.225.232.58:3000'
        ].filter(Boolean); 

        if (!origin) {
            return callback(null, true);
        }

        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn(`Intento de acceso bloqueado desde origen: ${origin}`)
            callback(new Error('No permitido por CORS'))
        }
    },
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept'
    ],
    maxAge: 86400 
};