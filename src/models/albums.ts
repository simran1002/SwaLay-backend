import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Album document
interface IAlbum extends Document {
  id: number;
  title?: string | null;
  art?: string | null;
  language?: string | null;
  genre?: string | null;
  category?: string | null;
  releasedate?: string | null;
  label?: string | null;
  mood?: string | null;
  url: string;
  duration: string;
  status?: number;
  tracks?: number;
  rnote?: string | null;
  crbt?: number;
  thumb?: string | null;
  upc?: string | null;
  artist?: string | null;
  producer: string;
  cline?: string | null;
  pline?: string | null;
  inote?: string | null;
  uid?: number;
  comment: string;
  date: Date;
}

// Define the schema for the Album collection
const albumSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    max: 99999999999,
  },
  title: { 
    type: String,
    default: null 
  },
  art: { 
    type: String, 
    default: null 
  },
  language: { 
    type: String,
    default: null 
  },
  genre: { 
    type: String, 
    default: null 
  },
  category: { 
    type: String, 
    default: null 
  },
  releasedate: { 
    type: String, 
    default: null 
  },
  label: { 
    type: String, 
    default: null 
  },
  mood: { 
    type: String, 
    default: null 
  },
  url: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: String, 
    required: true,
  },
  status: {
    type: Boolean,
    default: null
  },
  tracks: { 
    type: Number, 
    default: 0,
    max: 99999999999, 
  },
  rnote: { 
    type: String, 
    default: null 
  },
  crbt: { 
    type: Number, 
    default: 0,
    max: 99999999999, 
  },
  thumb: { 
    type: String, 
    default: null 
  },
  upc: { 
    type: String, 
    default: null 
  },
  artist: { 
    type: String, 
    default: null 
  },
  producer: { 
    type: String, 
    required: true, 
    default: null
  },
  cline: { 
    type: String, 
    default: null 
  },
  pline: { 
    type: String, 
    default: null 
  },
  inote: { 
    type: String, 
    default: null 
  },
  uid: { 
    type: Number, 
    default: 0 
  },
  comment: { 
    type: String, 
    required: true,
    default: null
  },
  date: { 
    type: Date, 
    default: Date.now,
    required: true, 
  },
});

// Create a unique index on the id field
albumSchema.index({ id: 1 }, { unique: true });

// Create the model for the Album collection
const Album = mongoose.models.Album || mongoose.model<IAlbum>('Album', albumSchema);

export default Album;