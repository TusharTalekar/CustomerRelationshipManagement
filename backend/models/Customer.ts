import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  ownerId: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICustomerDocument extends ICustomer, Document {
  _id: mongoose.Types.ObjectId;
}

const customerSchema = new Schema<ICustomerDocument>({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  company: { type: String },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Customer = mongoose.model<ICustomerDocument>('Customer', customerSchema);
export default Customer;
