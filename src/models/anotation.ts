import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Anotation document
interface IAnotation extends Document {
  id: number;
  label: string;
  earning: string;
  period: string;
  stamp?: Date;
}

// Define the schema for the Anotation collection
const AnotationSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    min: 0,
    max: 99999999999, // Maximum value for 11 digits
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

// Create a unique index on the id field
AnotationSchema.index({ id: 1 }, { unique: true });

// Create the model for the Anotation collection
const Anotation = mongoose.models.Anotation || mongoose.model<IAnotation>('Anotation', AnotationSchema);

export default Anotation;