// models/totalAmount.model.ts

import mongoose, { Document, Schema } from 'mongoose';

interface ITotalAmount extends Document {
  totalAmount: number;
  labelId: string;
  updateTime: Date;
}

const TotalAmountSchema: Schema = new Schema({
  totalAmount: { type: Number, required: true },
  labelId: { type: String, required: true },
  updateTime: { type: Date, default: Date.now }
});

const TotalAmount = mongoose.models.TotalAmount || mongoose.model<ITotalAmount>('TotalAmount', TotalAmountSchema);

export default TotalAmount;
