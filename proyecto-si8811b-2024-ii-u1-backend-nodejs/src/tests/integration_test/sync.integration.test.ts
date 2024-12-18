import request from 'supertest';
import app from '../../server';
import User from '../../models/User';
import { generateJWT } from '../../utils/jwt';
import { autenticarYExtraerHorario, autenticarYExtraerAsistencias, autenticar } from '../../services/intranetSync';

jest.mock('../../services/intranetSync');
jest.mock('../../logs/logger');

describe('Sync Integration Tests', () => {
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
  });

  describe('POST /api/v1/sync/data', () => {
    it('should sync user data successfully', async () => {
      const mockAuthResult = {
        cookies: ['session=123'],
        page: { 
          url: () => 'https://net.upt.edu.pe/inicio.php?sesion=abc123'
        }
      };

      (autenticar as jest.Mock).mockResolvedValue(mockAuthResult);

      const response = await request(app)
        .post('/api/v1/sync/data')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: '2016123456',
          contrasena: 'test123'
        })
        .expect(200);

      expect(response.body.message).toBe('Sincronización exitosa');
      expect(response.body.cookies).toBeTruthy();
      expect(response.body.currentURL).toBeTruthy();
    });

    it('should return 401 if authentication fails', async () => {
      (autenticar as jest.Mock).mockResolvedValue(null);

      await request(app)
        .post('/api/v1/sync/data')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: '2016123456',
          contrasena: 'wrong123'
        })
        .expect(401);
    });
  });

  describe('POST /api/v1/sync/schedule', () => {
    it('should sync user schedule successfully', async () => {
      const mockScheduleData = {
        horarios: [{
          code: 'CS101',
          name: 'Computer Science',
          section: 'A',
          schedule: { 
            Lunes: ['08:00-10:00'] 
          }
        }],
        cookies: ['session=123']
      };

      (autenticarYExtraerHorario as jest.Mock).mockResolvedValue(mockScheduleData);

      const response = await request(app)
        .post('/api/v1/sync/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: '2016123456',
          contrasena: 'test123'
        })
        .expect(200);

      expect(response.body.message).toBe('Sincronización de horario exitosa y guardada en la base de datos');
      expect(response.body.scheduleData).toBeTruthy();
      expect(response.body.userCode).toBe('2016123456');
    });

    it('should return 401 if schedule sync fails', async () => {
      (autenticarYExtraerHorario as jest.Mock).mockResolvedValue(null);

      await request(app)
        .post('/api/v1/sync/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: '2016123456',
          contrasena: 'wrong123'
        })
        .expect(401);
    });
  });

  describe('POST /api/v1/sync/attendance', () => {
    it('should sync user attendance successfully', async () => {
      const mockAttendanceData = {
        asistencias: [{
          curso: 'Computer Science',
          asistencias: [{
            fecha: '2024-03-14',
            dia: 'Jueves',
            estado: 'Asistió'
          }]
        }],
        cookies: ['session=123']
      };

      (autenticarYExtraerAsistencias as jest.Mock).mockResolvedValue(mockAttendanceData);

      const response = await request(app)
        .post('/api/v1/sync/attendance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: '2016123456',
          contrasena: 'test123'
        })
        .expect(200);

      expect(response.body.message).toBe('Sincronización de asistencias exitosa y guardada en la base de datos');
      expect(response.body.attendanceData).toBeTruthy();
      expect(response.body.userCode).toBe('2016123456');
    });

    it('should return 401 if attendance sync fails', async () => {
      (autenticarYExtraerAsistencias as jest.Mock).mockResolvedValue(null);

      await request(app)
        .post('/api/v1/sync/attendance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: '2016123456',
          contrasena: 'wrong123'
        })
        .expect(401);
    });

    it('should return 401 if not authenticated', async () => {
      await request(app)
        .post('/api/v1/sync/attendance')
        .send({
          codigo: '2016123456',
          contrasena: 'test123'
        })
        .expect(401);
    });
  });
});