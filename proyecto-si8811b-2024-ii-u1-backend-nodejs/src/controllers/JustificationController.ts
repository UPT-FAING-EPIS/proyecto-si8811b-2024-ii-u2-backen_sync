import { Request, Response } from 'express';
import Justification from '../models/Justification';
import logger from '../logs/logger';
import { JustificationEmail } from '../emails/JustificationEmail';

export class JustificationController {
    static submitJustification = async (req: Request, res: Response) => {
        try {
            const { date, reason, description} = req.body;
            const { id: studentId, name: studentName } = req.user; 

            // Procesar el archivo adjunto
            let attachmentUrl: string | undefined;
            if (req.file) {
                attachmentUrl = `/uploads/${req.file.filename}`; 
            }

            // Crear el registro de justificación
            const justification = new Justification({
                studentId,
                studentName,
                date,
                reason,
                description,
                attachmentUrl
            });

            await justification.save();

            // Enviar correo de justificación
            await JustificationEmail.sendJustificationEmail({
                email: 'tutoriaepis@upt.pe',
                studentName,
                studentId,
                date,
                reason,
                description,
                attachmentUrl
            });

            logger.info(`Justificación enviada por el estudiante ${studentName} (${studentId})`);

            res.status(200).json({
                message: 'Justificación enviada con éxito y correo de confirmación enviado.'
            });
        } catch (error) {
            logger.error(`Error al enviar justificación: ${error.message}`);
            res.status(500).json({ error: 'Hubo un error al procesar la justificación.' });
        }
    }

    static getStudentHistory = async (req: Request, res: Response) => {
        try {
            const studentId = req.user.id; 
            const page = parseInt(req.query.page as string) || 1; 
            const limit = parseInt(req.query.limit as string) || 10; 

            // Obtener las justificaciones del estudiante con paginación
            const justifications = await Justification.find({ studentId })
                .sort({ createdAt: -1 }) 
                .skip((page - 1) * limit)
                .limit(limit);

            const total = await Justification.countDocuments({ studentId });

            res.status(200).json({
                page,
                totalPages: Math.ceil(total / limit),
                total,
                justifications: justifications.map(j => ({
                    id: j.id,
                    date: j.date,
                    reason: j.reason,
                    description: j.description,
                    status: j.status,
                    attachmentUrl: j.attachmentUrl,
                    createdAt: j.createdAt,
                }))
            });
        } catch (error) {
            logger.error(`Error al obtener el historial de justificaciones: ${error.message}`);
            res.status(500).json({ error: 'Hubo un error al obtener el historial.' });
        }
    };
}
