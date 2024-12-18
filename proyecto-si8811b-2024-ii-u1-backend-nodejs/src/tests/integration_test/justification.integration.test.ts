import request from 'supertest';
import path from 'path';
import fs from 'fs';
import app from '../../server';
import User from '../../models/User';
import Justification from '../../models/Justification';
import { generateJWT } from '../../utils/jwt';
import { JustificationEmail } from '../../emails/JustificationEmail';

jest.mock('../../emails/JustificationEmail');
jest.mock('../../logs/logger');

describe('Justification Integration Tests', () => {
  let authToken: string;
  let testUser: any;
  const testFilePath = path.join(__dirname, '../fixtures/test.pdf');

  beforeAll(() => {
    const fixturesDir = path.join(__dirname, '../fixtures');

    if (!fs.existsSync(fixturesDir)) {
      console.log(`Creando directorio fixtures: ${fixturesDir}`);
      fs.mkdirSync(fixturesDir, { recursive: true });
    }

    if (!fs.existsSync(testFilePath)) {
      console.log(`Creando archivo test.pdf en: ${testFilePath}`);
      fs.writeFileSync(testFilePath, 'Test PDF content');
    }
  });

  beforeEach(async () => {
    // Crea un usuario para las pruebas
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword123',
      confirmed: true,
    });

    authToken = generateJWT({ id: testUser._id });

    // Limpia la colección de Justificaciones antes de cada prueba
    await Justification.deleteMany({});
  });

  afterAll(() => {
    if (fs.existsSync(testFilePath)) {
      console.log('Eliminando archivo test.pdf en:', testFilePath);
      fs.unlinkSync(testFilePath);
    }
  });


  describe('POST /api/v1/justifications/submit', () => {
    it('should submit justification successfully with attachment', async () => {
      const justificationData = {
        date: '2024-03-14',
        reason: 'Consulta médica',
        description: 'Tengo cita con el doctor'
      };

      const response = await request(app)
        .post('/api/v1/justifications/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .field('date', justificationData.date)
        .field('reason', justificationData.reason)
        .field('description', justificationData.description)
        .attach('attachment', testFilePath)
        .expect(200);

      expect(response.body.message).toBe('Justificación enviada con éxito y correo de confirmación enviado.');

      const justification = await Justification.findOne({ studentId: testUser._id });
      expect(justification).toBeTruthy();
      expect(justification.reason).toBe(justificationData.reason);
      expect(justification.description).toBe(justificationData.description);
      expect(justification.attachmentUrl).toBeTruthy();

      expect(JustificationEmail.sendJustificationEmail).toHaveBeenCalled();
    });

    it('should submit justification without attachment', async () => {
      const justificationData = {
        date: '2024-03-14',
        reason: 'Problema familiar',
        description: 'Emergencia familiar'
      };

      const response = await request(app)
        .post('/api/v1/justifications/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send(justificationData)
        .expect(200);

      expect(response.body.message).toBe('Justificación enviada con éxito y correo de confirmación enviado.');

      const justification = await Justification.findOne({ studentId: testUser._id });
      expect(justification).toBeTruthy();
      expect(justification.attachmentUrl).toBeUndefined();
    });

    it('should return 401 if not authenticated', async () => {
      const justificationData = {
        date: '2024-03-14',
        reason: 'Problema familiar',
        description: 'Emergencia familiar'
      };

      await request(app)
        .post('/api/v1/justifications/submit')
        .send(justificationData)
        .expect(401);
    });

    it('should return 400 if validation fails', async () => {
      const invalidData = {
        date: 'invalid-date',
        reason: '', // Required field
        description: 'Test description'
      };

      await request(app)
        .post('/api/v1/justifications/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /api/v1/justifications/history', () => {
    beforeEach(async () => {
      // Asegurarse que las fechas tienen una diferencia clara
      const justifications = [
        {
          studentId: testUser._id,
          studentName: testUser.name,
          date: new Date('2024-03-14'),
          reason: 'Consulta médica',
          description: 'Descripción 1',
          status: 'Enviado',
          createdAt: new Date('2024-03-14T10:00:00.000Z') // Fecha más reciente
        },
        {
          studentId: testUser._id,
          studentName: testUser.name,
          date: new Date('2024-03-13'),
          reason: 'Problema familiar',
          description: 'Descripción 2',
          status: 'Aprobado',
          createdAt: new Date('2024-03-13T10:00:00.000Z') // Fecha más antigua
        }
      ];

      await Justification.insertMany(justifications);
    });

    it('should get student justification history', async () => {
      const response = await request(app)
        .get('/api/v1/justifications/history')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.justifications).toHaveLength(2);
      expect(response.body.page).toBe(1);
      expect(response.body.total).toBe(2);
      
      // Verificar que las justificaciones estén ordenadas por fecha de creación descendente
      const justifications = response.body.justifications;
      expect(new Date(justifications[0].createdAt) > new Date(justifications[1].createdAt)).toBe(true);
      expect(justifications[0].reason).toBe('Consulta médica');
      expect(justifications[0].status).toBe('Enviado');
      expect(justifications[1].reason).toBe('Problema familiar');
      expect(justifications[1].status).toBe('Aprobado');
    });

    it('should handle pagination correctly', async () => {
      const response = await request(app)
        .get('/api/v1/justifications/history')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 1 })
        .expect(200);

      expect(response.body.justifications).toHaveLength(1);
      expect(response.body.totalPages).toBe(2);
    });

    it('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/api/v1/justifications/history')
        .query({ page: 1, limit: 10 })
        .expect(401);
    });

    it('should return empty array if no justifications found', async () => {
      await Justification.deleteMany({});

      const response = await request(app)
        .get('/api/v1/justifications/history')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.justifications).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });
  });
});