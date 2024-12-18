import { SyncController } from '../../controllers/SyncController';
import Attendace from '../../models/Attendace';
import Schedule from '../../models/Schedule';
import {
  autenticar,
  autenticarYExtraerHorario,
  autenticarYExtraerAsistencias,
} from '../../services/intranetSync';

jest.mock('../../models/Schedule', () => ({
  create: jest.fn(),
}));
jest.mock('../../models/Attendace', () => ({
  create: jest.fn(),
}));
jest.mock('../../services/intranetSync', () => ({
  autenticar: jest.fn(),
  autenticarYExtraerHorario: jest.fn(),
  autenticarYExtraerAsistencias: jest.fn(),
}));

jest.mock('../../logs/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));


describe('SyncController Unit Tests', () => {
  let mockRequest: any;
  let mockResponse: any;

    beforeEach(() => {
        mockRequest = {
        user: { _id: 'user123' },
        body: { codigo: '2016764598', contrasena: 'password' },
        };
        mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('syncUserData', () => {
        it('should sync user data successfully', async () => {
            const mockCookies = [{ name: 'session', value: '12345' }];
            const mockPage = { url: jest.fn().mockReturnValue('https://net.upt.edu.pe/inicio.php') };
    
            (autenticar as jest.Mock).mockResolvedValue({ cookies: mockCookies, page: mockPage });
    
            await SyncController.syncUserData(mockRequest, mockResponse);
    
            // Verificar que `autenticar` fue llamado correctamente
            expect(autenticar).toHaveBeenCalledWith('2016764598', 'password');
    
            // Verificar que la respuesta sea exitosa
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Sincronización exitosa',
                cookies: mockCookies,
                currentURL: 'https://net.upt.edu.pe/inicio.php',
            });
        });
    
        it('should return 401 if authentication fails', async () => {
            // Configurar el mock de `autenticar` para devolver `null`
            (autenticar as jest.Mock).mockResolvedValue(null);
    
            await SyncController.syncUserData(mockRequest, mockResponse);
    
            // Verificar que se devolvió un código 401
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Error en la autenticación o sincronización',
            });
        });
    
        it('should handle internal server error', async () => {
            // Configurar el mock de `autenticar` para lanzar un error
            (autenticar as jest.Mock).mockRejectedValue(new Error('Internal error'));
    
            await SyncController.syncUserData(mockRequest, mockResponse);
    
            // Verificar que se devolvió un código 500
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Error interno del servidor',
            });
        });

        it('should handle null result from autenticar in syncUserData', async () => {
            (autenticar as jest.Mock).mockResolvedValue(null);
        
            await SyncController.syncUserData(mockRequest, mockResponse);
        
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error en la autenticación o sincronización' });
        });
      
  
    });
    

    describe('syncUserSchedule', () => {
        it('should sync and save user schedule successfully', async () => {
            const mockScheduleData = [
                { schedule: { Lunes: [{ horaInicio: '08:00', horaFin: '10:00', materia: 'Math' }] } },
            ];
            (autenticarYExtraerHorario as jest.Mock).mockResolvedValue({ horarios: mockScheduleData });

            await SyncController.syncUserSchedule(mockRequest, mockResponse);

            (Schedule.create as jest.Mock).mockResolvedValue({
                userCode: '2016764598',
                userId: 'user123',
                scheduleData: mockScheduleData,
                timestamp: new Date(),
            });
        });

        it('should handle error when saving schedule fails', async () => {
            const mockScheduleData = [
                { schedule: { Lunes: [{ horaInicio: '08:00', horaFin: '10:00', materia: 'Math' }] } },
            ];
        
            (autenticarYExtraerHorario as jest.Mock).mockResolvedValue({ horarios: mockScheduleData });
        
            // Configurar el mock para que rechace con un error simulado
            (Schedule.create as jest.Mock).mockRejectedValue(new Error('Database error'));
        
            await SyncController.syncUserSchedule(mockRequest, mockResponse);
        
            // Configurar el mock para simular que la creación falló
            (Schedule.create as jest.Mock).mockResolvedValue({
                userCode: '2016764598',
                userId: 'user123',
                scheduleData: mockScheduleData,
                timestamp: new Date(),
            });
        
            // Verificar que la respuesta maneje correctamente el error
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
        });  
        
        it('should handle incomplete data in syncUserSchedule', async () => {
            (autenticarYExtraerHorario as jest.Mock).mockResolvedValue({ horarios: null });
        
            await SyncController.syncUserSchedule(mockRequest, mockResponse);
        
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error en la autenticación o sincronización del horario' });
        });        
                           
    })

    describe('syncUserAttendance', () => {
        it('should sync and save user attendance successfully', async () => {
            const mockAttendanceData = [
                { dia: 'Lunes', fecha: '2024-11-01', estado: 'Asiste' },
            ];
        
            (autenticarYExtraerAsistencias as jest.Mock).mockResolvedValue({ asistencias: mockAttendanceData });
        
            // Configurar el mock para devolver un resultado exitoso
            (Attendace.create as jest.Mock).mockResolvedValue({
                userCode: '2016764598',
                userId: 'user123',
                attendanceData: mockAttendanceData,
                timestamp: new Date(),
            });
        
            await SyncController.syncUserAttendance(mockRequest, mockResponse);
        
            // Simular la respuesta esperada
            (Attendace.create as jest.Mock).mockResolvedValue({
                userCode: '2016764598',
                userId: 'user123',
                attendanceData: mockAttendanceData,
                timestamp: new Date(),
            });
        
        });
        
        
        it('should handle error when saving attendance fails', async () => {
            // Mock de `autenticarYExtraerAsistencias` para devolver datos válidos pero vacíos
            (autenticarYExtraerAsistencias as jest.Mock).mockResolvedValue({
                asistencias: [],
            });
    
            // Mock de `Attendace.create` para simular un error al guardar
            (Attendace.create as jest.Mock).mockRejectedValue(new Error('Database error'));
    
            await SyncController.syncUserAttendance(mockRequest, mockResponse);
    
            // Verificar que la respuesta maneje correctamente el error
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
        });

        it('should handle errors in syncUserAttendance gracefully', async () => {
            (autenticarYExtraerAsistencias as jest.Mock).mockResolvedValue(null);
        
            await SyncController.syncUserAttendance(mockRequest, mockResponse);
        
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error en la autenticación o sincronización' });
        });       
        
    });
    

    test('mocking Schedule.create', () => {
        expect(Schedule.create).toBeDefined();
        (Schedule.create as jest.Mock).mockResolvedValue('mocked');
        expect(Schedule.create()).resolves.toBe('mocked');
    });
      
    test('mocking Attendance.create', () => {
        expect(Attendace.create).toBeDefined();
        (Attendace.create as jest.Mock).mockResolvedValue('mocked');
        expect(Attendace.create()).resolves.toBe('mocked');
    });
      
})
