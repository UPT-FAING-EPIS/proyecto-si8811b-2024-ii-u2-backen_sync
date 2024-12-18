import { Request, Response } from 'express';
import ScheduleController from '../../controllers/ScheduleController';
import Schedule from '../../models/Schedule';

jest.mock('../../models/Schedule');

describe('ScheduleController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    afterAll(() => {
        consoleErrorMock.mockRestore(); 
    });


    describe('getUserSchedule', () => {
        it('should return the schedule for a valid user', async () => {
            // Mock user ID and schedule
            const mockSchedule = {
                userCode: 'user123',
                scheduleData: [
                    { day: 'Monday', time: '9:00 AM - 10:00 AM', subject: 'Math' },
                ],
            };

            mockRequest.user = { id: 'user123' } as any;
            (Schedule.findOne as jest.Mock).mockResolvedValue(mockSchedule);

            await ScheduleController.getUserSchedule(mockRequest as Request, mockResponse as Response);

            expect(Schedule.findOne).toHaveBeenCalledWith({ userId: 'user123' });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                userCode: 'user123',
                schedule: mockSchedule.scheduleData,
            });
        });

        it('should return 404 if no schedule is found for the user', async () => {
            mockRequest.user = { id: 'user123' } as any;
            (Schedule.findOne as jest.Mock).mockResolvedValue(null);

            await ScheduleController.getUserSchedule(mockRequest as Request, mockResponse as Response);

            expect(Schedule.findOne).toHaveBeenCalledWith({ userId: 'user123' });
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'No se encontró el horario para el usuario.',
            });
        });

         
    });
});
