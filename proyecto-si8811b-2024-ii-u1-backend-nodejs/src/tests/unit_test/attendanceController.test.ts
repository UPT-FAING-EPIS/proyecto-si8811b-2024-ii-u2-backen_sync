import { Request, Response } from 'express';
import AttendanceController from '../../controllers/AttendanceController';
import Attendance from '../../models/Attendace';

// Mockear el modelo de Attendance
jest.mock('../../models/Attendace', () => ({
  findOne: jest.fn(),
}));

describe('AttendanceController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        };
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.clearAllMocks();
    });

    describe('getUserAttendance', () => {
        it('should return attendance data for a valid user', async () => {
            // Mock de los datos de asistencia
            const mockAttendance = {
                userCode: '123456',
                attendanceData: [
                { date: '2024-01-01', status: 'Present' },
                { date: '2024-01-02', status: 'Absent' },
                ],
            };

            // Mock del request
            mockRequest.user = { id: 'user123' } as any;

            // Mock de la base de datos
            (Attendance.findOne as jest.Mock).mockResolvedValue(mockAttendance);

            await AttendanceController.getUserAttendance(
                mockRequest as Request,
                mockResponse as Response
            );

            // Verifica que se haya llamado a la base de datos correctamente
            expect(Attendance.findOne).toHaveBeenCalledWith({ userId: 'user123' });

            // Verifica la respuesta correcta
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                userCode: '123456',
                attendanceData: [
                { date: '2024-01-01', status: 'Present' },
                { date: '2024-01-02', status: 'Absent' },
                ],
            });
        });

        it('should return 404 if no attendance is found for the user', async () => {
            mockRequest.user = { id: 'user123' } as any;

            // Mock de la base de datos para devolver null
            (Attendance.findOne as jest.Mock).mockResolvedValue(null);

            await AttendanceController.getUserAttendance(
                mockRequest as Request,
                mockResponse as Response
            );

            // Verifica que la base de datos haya sido llamada
            expect(Attendance.findOne).toHaveBeenCalledWith({ userId: 'user123' });

            // Verifica la respuesta 404
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'No se encontraron asistencias para el usuario.',
            });
        });

        it('should return 500 if database call fails', async () => {
            // Configura el mock del request con un usuario válido
            mockRequest.user = { id: 'user123' } as any;
        
            // Configura el mock para simular un error en la base de datos
            (Attendance.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
        
            // Llama al controlador
            await AttendanceController.getUserAttendance(
                mockRequest as Request,
                mockResponse as Response
            );
        
            // Verifica que `console.error` fue llamado
            expect(console.error).toHaveBeenCalledWith(
                'Error obteniendo asistencias:',
                expect.any(Error)
            );
        
            // Verifica que se envió la respuesta con estado 500
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Error al obtener asistencias.',
            });
        });        
        
    });
});
