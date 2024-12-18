import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { JustificationController } from '../controllers/JustificationController';
import { handleInputErrors } from '../middleware/validation';
import { upload } from '../config/multer';

const router = Router();

/**
 * @swagger
 * /api/v1/justifications/submit:
 *   post:
 *     summary: Enviar una justificación con archivo adjunto
 *     tags:
 *       - Justificaciones
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-11-14"
 *               reason:
 *                 type: string
 *                 example: "Consulta médica"
 *               description:
 *                 type: string
 *                 example: "No podré asistir debido a una consulta médica."
 *               attachment:
 *                 type: string
 *                 format: binary
 *                 description: Archivo adjunto (PDF, JPG o PNG)
 *     responses:
 *       200:
 *         description: Justificación enviada exitosamente.
 */
router.post(
    '/submit',
    authenticate,
    upload.single('attachment'), // Nombre del campo para el archivo
    (req, res, next) => {
        console.log('Cuerpo de la solicitud:', req.body);
        console.log('Archivo adjunto:', req.file);
        next();
    },
    [
        body('date').isISO8601().withMessage('Fecha no válida'),
        body('reason').notEmpty().withMessage('Motivo es requerido'),
        body('description').optional().isString()
    ],
    handleInputErrors,
    JustificationController.submitJustification
)

/**
 * @swagger
 * /api/v1/justifications/history:
 *   get:
 *     summary: Obtener el historial de justificaciones del estudiante
 *     tags:
 *       - Justificaciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de la página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de justificaciones por página.
 *     responses:
 *       200:
 *         description: Lista de justificaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   reason:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *                   attachmentUrl:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: No autorizado.
 */
router.get(
    '/history',
    authenticate,
    JustificationController.getStudentHistory
)

export default router;