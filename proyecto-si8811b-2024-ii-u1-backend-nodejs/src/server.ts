import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';
import authRoutes from './routes/authRoutes';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import options from './swaggerOptions'; 
import logger from '../src/logs/logger'; 
import syncRoutes from './routes/syncRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import justificationRoutes from './routes/justificationRoutes';
import path from 'path';
import fs from 'fs';

dotenv.config();
connectDB();

const app = express();

app.use(cors(corsConfig));

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configura Swagger
const swaggerDocs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware para loguear las solicitudes
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/sync', syncRoutes);

app.use('/api/v1/attendance', attendanceRoutes);

app.use('/api/v1/schedule', scheduleRoutes);

app.use('/api/v1/justifications', justificationRoutes);



export default app;
