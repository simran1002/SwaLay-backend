import mongoose, { Schema, Document } from 'mongoose';

interface IAnotation extends Document {
  id: number;
  label: string;
  earning: string;
  period: string;
  stamp?: Date;
}

const AnotationSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    min: 0,
    max: 99999999999, 
  },
  label: {
    type: String,
    required: true,
  },
  earning: {
    type: String,
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  stamp: {
    type: Date,
    default: Date.now,
  },
});

AnotationSchema.index({ id: 1 }, { unique: true });

const Anotation = mongoose.models.Anotation || mongoose.model<IAnotation>('Anotation', AnotationSchema);

export default Anotation;