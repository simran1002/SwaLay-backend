// models/paymentRequest.model.ts

import mongoose, { Document, Schema } from 'mongoose';

// Define the status enum
export enum PaymentStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed'
}

interface IPaymentRequest extends Document {
  labelId: string;
  amount: number;
  date: Date;
  status: PaymentStatus;
  comment?: string;
}

const PaymentRequestSchema: Schema = new Schema({
  labelId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: Object.values(PaymentStatus), // Use the enum values
    required: true 
  },
  comment: { type: String }
});

const PaymentRequest = mongoose.models.PaymentRequest || mongoose.model<IPaymentRequest>('PaymentRequest', PaymentRequestSchema);

export default PaymentRequest;
