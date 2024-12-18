import { transporter } from "../config/nodemailer";

interface IJustificationEmail {
    email: string;
    studentName: string;
    studentId: string;
    date: Date;
    reason: string;
    description?: string;
    attachmentUrl?: string;
}

export class JustificationEmail {
    static sendJustificationEmail = async (details: IJustificationEmail) => {
        try {
            const info = await transporter.sendMail({
                from: 'Topicos <admin@topic.com>',
                to: details.email,
                subject: `Justificación de Ausencia - ${details.studentName}`,
                html: `
                    <p>Estimado tutor,</p>
                    <p>El estudiante ${details.studentName} (ID: ${details.studentId}) ha enviado una justificación por su ausencia.</p>
                    <p><strong>Fecha de Ausencia:</strong> ${details.date}</p>
                    <p><strong>Motivo:</strong> ${details.reason}</p>
                    ${details.description ? `<p><strong>Descripción:</strong> ${details.description}</p>` : ''}
                    ${details.attachmentUrl ? `<p><strong>Archivo Adjunto:</strong> <a href="${details.attachmentUrl}">Ver adjunto</a></p>` : ''}
                    <p>Saludos,<br>Equipo de la plataforma</p>
                `
            });

            console.log('Correo de justificación enviado', info.messageId);
        } catch (error) {
            console.error('Error al enviar correo de justificación:', error);
            throw new Error('No se pudo enviar el correo de justificación.');
        }
    };
}
