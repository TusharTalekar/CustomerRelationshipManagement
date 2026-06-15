import mongoose, { Schema, Document } from 'mongoose';
import { ICustomerDocument } from './Customer';

export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Proposal Sent' | 'Won' | 'Lost';

export interface ILead {
    customerId: mongoose.Types.ObjectId | string | ICustomerDocument;
    title: string;
    description?: string;
    status: LeadStatus;
    value: number;
    assignedTo: mongoose.Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ILeadDocument extends ILead, Document {
    _id: mongoose.Types.ObjectId;
}

const leadSchema = new Schema<ILeadDocument>({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Interested', 'Proposal Sent', 'Won', 'Lost'],
        default: 'New'
    },
    value: {
        type: Number,
        default: 0
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Lead = mongoose.model<ILeadDocument>('Lead', leadSchema);
export default Lead;
