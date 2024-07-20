import mongoose, { Document, Schema } from "mongoose";

interface IYoutube extends Document {
  id: number;
  albumId: mongoose.Schema.Types.ObjectId;
  trackId: number;
  link: string | null;
  title: string | null;
  status: boolean;
  comment: string | null;
}

const youtubeSchema: Schema<IYoutube> = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    min: 0,
    max: 99999999999 // Maximum value for 11 digits
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  trackId: {
    type: Number,
    required: true,
    max: 99999999999,
  },
  link: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  status: {
    type: Boolean,
    default: null
  },
  comment: {
    type: String,
    default: null
  }
});

// Create a unique index on the id field
youtubeSchema.index({ id: 1 }, { unique: true });

const Youtube = mongoose.models.Youtube || mongoose.model<IYoutube>('Youtube', youtubeSchema);

export default Youtube;

