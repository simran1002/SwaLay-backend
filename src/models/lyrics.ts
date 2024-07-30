import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Lyric document
interface ILyric extends Document {
  trackId: number;
  language: string;
  isrc: string;
  lyrics: string;
}

// Define the schema for the Lyric collection
const lyricsSchema: Schema<ILyric> = new Schema({
  trackId: {
    type: Number,
    required: true,
    unique: true,
    min: 0,
    max: Math.pow(10, 20) - 1 // Maximum value for 20 digits
  },
  language: {
    type: String,
    required: true,
    maxlength: 50
  },
  isrc: {
    type: String,
    required: true
  },
  lyrics: {
    type: String,
    required: true
  },
});


// Create the model for the Lyric collection
const Lyric = mongoose.models.Lyric || mongoose.model<ILyric>('Lyric', lyricsSchema);

export default Lyric;