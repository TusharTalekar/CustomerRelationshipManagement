import mongoose, { Schema, Document } from 'mongoose';

export interface INote {
    content: string;
    createdById: mongoose.Types.ObjectId | string;
    customerId?: mongoose.Types.ObjectId | string;
    leadId?: mongoose.Types.ObjectId | string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface INoteDocument extends INote, Document {
    _id: mongoose.Types.ObjectId;
}

const noteSchema = new Schema < INoteDocument > ({
    content: { type: String, required: true, trim: true },
    createdById: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead' }
}, { timestamps: true });

const Note = mongoose.model < INoteDocument > ('Note', noteSchema);
export default Note;
