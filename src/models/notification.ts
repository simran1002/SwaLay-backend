import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Notify document
interface INotify extends Document {
  id: number;
  time?: Date | null;
  message?: string | null;
}

// Define the schema for the Notify collection
const NotifySchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  time: {
    type: Date,
    default: null,
  },
  message: {
    type: String,
    default: null,
  },
});

// Create a unique index on the id field
NotifySchema.index({ id: 1 }, { unique: true });

// Create the model for the Notify collection
const Notify = mongoose.models.Notify || mongoose.model<INotify>("Notify", NotifySchema);

export default Notify;