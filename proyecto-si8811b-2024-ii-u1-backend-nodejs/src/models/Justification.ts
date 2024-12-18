import mongoose, { Document, Schema } from 'mongoose';

export interface IJustification extends Document {
    studentId: string;
    studentName: string;
    date: Date;
    reason: string;
    description?: string;
    attachmentUrl?: string;
    status: 'Enviado' | 'En Revisión' | 'Aprobado' | 'Rechazado' | 'Pendiente de Evidencia';
    statusHistory: { status: string; changedAt: Date; changedBy: string }[];
    createdAt: Date;
}

const justificationSchema = new Schema<IJustification>({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    description: { type: String },
    attachmentUrl: { type: String },
    status: { 
        type: String, 
        enum: ['Enviado', 'En Revisión', 'Aprobado', 'Rechazado', 'Pendiente de Evidencia'], 
        default: 'Enviado' 
    },
    statusHistory: [
        {
            status: { type: String },
            changedAt: { type: Date, default: Date.now },
            changedBy: { type: String }, 
        }
    ],
    createdAt: { type: Date, default: Date.now },
})

const Justification = mongoose.model<IJustification>('Justification', justificationSchema);

export default Justification;
