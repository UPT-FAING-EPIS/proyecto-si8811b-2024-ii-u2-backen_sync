import { Request, Response } from 'express';
import { JustificationController } from '../../controllers/JustificationController';
import Justification from '../../models/Justification';
import { JustificationEmail } from '../../emails/JustificationEmail';
import logger from '../../logs/logger';
import { IUser } from '../../models/User';
import { mocked } from 'jest-mock';

jest.mock('../../models/Justification', () => {
  // Crear un mock de clase con métodos de instancia
  const JustificationMock = jest.fn(() => ({
    save: jest.fn(),
  }));

  // Agregar métodos estáticos al mock de la clase
  Object.assign(JustificationMock, {
    find: jest.fn(),
    countDocuments: jest.fn(),
  });

  return JustificationMock;
});
  
jest.mock('../../emails/JustificationEmail');
jest.mock('../../logs/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('JustificationController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

    describe('submitJustification', () => {
        it('should submit a justification successfully with an attachment', async () => {
            mockRequest.body = {
              date: '2024-11-14',
              reason: 'Consulta médica',
              description: 'No podré asistir debido a una consulta médica.',
            };
            mockRequest.user = { id: 'student123', name: 'Test Student' } as IUser;
            mockRequest.file = {
              fieldname: 'attachment',
              originalname: 'testfile.pdf',
              encoding: '7bit',
              mimetype: 'application/pdf',
              size: 1024,
              destination: '/uploads/',
              filename: 'testfile.pdf',
              path: '/uploads/testfile.pdf',
              buffer: Buffer.from(''),
            } as Express.Multer.File;
          
            const mockSave = jest.fn();
            (Justification as unknown as jest.Mock).mockImplementation(() => ({
                save: mockSave,
            }));

            (JustificationEmail.sendJustificationEmail as jest.Mock).mockResolvedValue(undefined);
          
            await JustificationController.submitJustification(
              mockRequest as Request,
              mockResponse as Response
            );
          
            expect(mockSave).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
              message: 'Justificación enviada con éxito y correo de confirmación enviado.',
            });
            expect(JustificationEmail.sendJustificationEmail).toHaveBeenCalledWith({
              email: 'tutoriaepis@upt.pe',
              studentName: 'Test Student',
              studentId: 'student123',
              date: '2024-11-14',
              reason: 'Consulta médica',
              description: 'No podré asistir debido a una consulta médica.',
              attachmentUrl: '/uploads/testfile.pdf',
            });
        });
          

        it('should return an error if saving the justification fails', async () => {
            mockRequest.body = {
                date: '2024-11-14',
                reason: 'Consulta médica',
                description: 'No podré asistir debido a una consulta médica.',
            };
            mockRequest.user = {
                id: 'student123',
                name: 'Test Student',
                email: 'test@student.com',
                password: 'hashedPassword123',
                confirmed: true,
                _id: 'mockObjectId123',
            } as IUser;
            

            (Justification as any).mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error('Database error')),
            }));

            await JustificationController.submitJustification(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Hubo un error al procesar la justificación.',
            });
            expect(logger.error).toHaveBeenCalledWith(
                'Error al enviar justificación: Database error'
            );
        });
    });

    describe('getStudentHistory', () => {
        it('should return the student history with pagination', async () => {
          mockRequest.user = { id: 'student123' } as any;
          mockRequest.query = { page: '1', limit: '2' };
      
          // Crear mocks encadenados para find
          const mockSort = jest.fn().mockReturnThis();
          const mockSkip = jest.fn().mockReturnThis();
          const mockLimit = jest.fn().mockResolvedValue([
            {
              id: '1',
              date: '2024-11-14',
              reason: 'Consulta médica',
              description: 'Descripción de prueba',
              status: 'Enviado',
              attachmentUrl: '/uploads/test.pdf',
              createdAt: new Date(),
            },
          ]);
      
          // Configurar el mock de find para devolver un objeto con métodos encadenados
          (Justification.find as jest.Mock).mockImplementation(() => ({
            sort: mockSort,
            skip: mockSkip,
            limit: mockLimit,
          }));
      
          // Mock para countDocuments
          (Justification.countDocuments as jest.Mock).mockResolvedValue(10);
      
          await JustificationController.getStudentHistory(
            mockRequest as Request,
            mockResponse as Response
          );
      
          expect(mockResponse.status).toHaveBeenCalledWith(200);
          expect(mockResponse.json).toHaveBeenCalledWith({
            page: 1,
            totalPages: 5,
            total: 10,
            justifications: [
              {
                id: '1',
                date: '2024-11-14',
                reason: 'Consulta médica',
                description: 'Descripción de prueba',
                status: 'Enviado',
                attachmentUrl: '/uploads/test.pdf',
                createdAt: expect.any(Date),
              },
            ],
          });
      
          // Verificar que los métodos encadenados fueron llamados correctamente
          expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
          expect(mockSkip).toHaveBeenCalledWith(0);
          expect(mockLimit).toHaveBeenCalledWith(2);
        });
      
        it('should return an error if fetching history fails', async () => {
            mockRequest.user = { id: 'student123' } as any;
            mockRequest.query = { page: '1', limit: '10' };
          
            // Simula un error en Justification.find
            (Justification.find as jest.Mock).mockImplementation(() => {
              throw new Error('Database error');
            });
          
            await JustificationController.getStudentHistory(
              mockRequest as Request,
              mockResponse as Response
            );
          
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
              error: 'Hubo un error al obtener el historial.',
            });
          
            // Verifica que logger.error haya sido llamado
            expect(logger.error).toHaveBeenCalledWith(
              expect.stringContaining('Error al obtener el historial de justificaciones')
            );
        });
          
    });      
      
});
