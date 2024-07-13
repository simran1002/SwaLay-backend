import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Earn document
interface IEarn extends Document {
  id: number;
  label: string | null;
  earning: string | null;
  period: string | null;
  stamp: Date;
}

// Define the schema for the Earn collection
const EarnSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    max: 99999999999,
  },
  label: {
    type: String,
    default: null,
  },
  earning: {
    type: String,
    default: null,
  },
  period: {
    type: String,
    default: null,
  },
  stamp: {
    type: Date,
    default: Date.now,
  },
});

// Create a unique index on the id field
EarnSchema.index({ id: 1 }, { unique: true });

// Create the model for the Earn collection
const Earn = mongoose.models.Earn || mongoose.model<IEarn>("Earn", EarnSchema);

export default Earn;