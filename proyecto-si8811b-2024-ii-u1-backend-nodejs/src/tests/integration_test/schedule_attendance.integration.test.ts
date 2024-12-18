// src/tests/integration_test/schedule_attendance.integration.test.ts

import request from 'supertest';
import app from '../../server';
import User from '../../models/User';
import Schedule from '../../models/Schedule';
import Attendance from '../../models/Attendace';
import { generateJWT } from '../../utils/jwt';

jest.mock('../../logs/logger');

describe('Schedule and Attendance Integration Tests', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword123',
      confirmed: true
    });
    
    authToken = generateJWT({ id: testUser._id });

    // Limpiar datos de prueba
    await Schedule.deleteMany({});
    await Attendance.deleteMany({});
  });

  describe('GET /api/v1/schedule', () => {
    it('should get user schedule successfully', async () => {
      // Crear horario de prueba
      const scheduleData = {
        userId: testUser._id,
        userCode: '2016123456',
        scheduleData: [{
          code: 'CS101',
          name: 'Computer Science',
          section: 'A',
          schedule: {
            Lunes: ['08:00-10:00']
          }
        }]
      };

      await Schedule.create(scheduleData);

      const response = await request(app)
        .get('/api/v1/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.userCode).toBe('2016123456');
      expect(response.body.schedule).toHaveLength(1);
      expect(response.body.schedule[0].code).toBe('CS101');
    });

    it('should return 404 if no schedule found', async () => {
      const response = await request(app)
        .get('/api/v1/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('No se encontró el horario para el usuario.');
    });

    it('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/api/v1/schedule')
        .expect(401);
    });
  });

  describe('GET /api/v1/attendance', () => {
    it('should get user attendance successfully', async () => {
      // Crear asistencias de prueba
      const attendanceData = {
        userId: testUser._id,
        userCode: '2016123456',
        attendanceData: [{
          curso: 'Computer Science',
          asistencias: [{
            fecha: '2024-03-14',
            dia: 'Jueves',
            estado: 'Asistió'
          }]
        }]
      };

      await Attendance.create(attendanceData);

      const response = await request(app)
        .get('/api/v1/attendance')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.userCode).toBe('2016123456');
      expect(response.body.attendanceData).toHaveLength(1);
      expect(response.body.attendanceData[0].curso).toBe('Computer Science');
    });

    it('should return 404 if no attendance found', async () => {
      const response = await request(app)
        .get('/api/v1/attendance')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('No se encontraron asistencias para el usuario.');
    });

    it('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/api/v1/attendance')
        .expect(401);
    });
  });
});