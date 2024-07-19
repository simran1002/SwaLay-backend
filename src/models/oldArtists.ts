import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Artist document
interface IArtist extends Document {
  id: number;
  uid: number;
  lable_name: string;
  song_name: string;
  ISRC: string;
  artist_name: string;
  spotify: string;
  itunes: string;
  jiosavan: string;
  amazon: string;
  status: number;
  type: string;
}

// Define the schema for the Artist collection
const artistSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    min: 0,
    max: Math.pow(10, 11) - 1, // Maximum value for 11 digits
  },
  uid: {
    type: Number,
    required: true,
    min: 0,
    max: Math.pow(10, 11) - 1, // Maximum value for 11 digits
  },
  lable_name: {
    type: String,
    required: true,
  },
  song_name: {
    type: String,
    required: true,
  },
  ISRC: {
    type: String,
    required: true,
  },
  artist_name: {
    type: String, // Ensure this is typed as string
    required: true,
  },
  spotify: {
    type: String,
    required: true,
  },
  itunes: {
    type: String,
    required: true,
  },
  jiosavan: {
    type: String,
    required: true,
  },
  amazon: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

// Create a unique index on the id field
artistSchema.index({ id: 1 }, { unique: true });

// Create the model for the Artist collection
const Artist = mongoose.models.Artist || mongoose.model<IArtist>("Artist", artistSchema);

export default Artist;