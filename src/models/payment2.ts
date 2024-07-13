import mongoose, { Schema, Document } from 'mongoose';

interface IPay extends Document {
  id: number;
  link?: string | null;
  title?: string | null;
  status?: string;
  comment?: string | null;
  uid?: string | null;
}

const tableSchema: Schema<IPay> = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: '1',
    maxlength: 11,
  },
  comment: {
    type: String,
    default: null,
  },
  uid: {
    type: String,
    default: null,
  },
});

tableSchema.index({ id: 1 }, { unique: true });

const Pay = mongoose.models.Pay || mongoose.model<IPay>('Pay', tableSchema);

export default Pay;