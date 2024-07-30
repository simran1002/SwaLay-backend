import mongoose, { Schema, Document } from "mongoose";

// Define the TrackStatus enum
enum TrackStatus {
  Draft = 0,
  Processing = 1,
  Approved = 2,
  Rejected = 3,
  Deleted = 4
}

// Define the Track interface extending Document
export interface ITrack extends Document {
  albumId: mongoose.Schema.Types.ObjectId;
  songName: string | null;
  composer: string | null;
  singer: string | null;
  lyricist: string | null;
  producer: string | null;
  musicFile: string | null;
  musicFileWav: string | null;
  isrc: string | null;
  duration: string | null;
  platformLinks: { SpotifyLink: string | null, AppleLink: string | null, Instagram: string | null, Facebook: string | null } | null;
  version: string | null;
  trackOrderNumber: string | null;
  status: TrackStatus;
}

// Define the schema
const trackSchema: Schema<ITrack> = new Schema({
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Albums",
    required: true
  },
  songName: {
    type: String,
    default: null,
  },
  composer: {
    type: String,
    default: null,
  },
  singer: {
    type: String,
    default: null,
  },
  lyricist: {
    type: String,
    default: null,
  },
  producer: {
    type: String,
    default: null,
  },
  musicFile: {
    type: String,
    default: null,
  },
  musicFileWav: {
    type: String,
    default: null,
  },
  isrc: {
    type: String,
    default: null,
  },
  duration: {
    type: String,
    default: null,
  },
  platformLinks: {
    type: {
      SpotifyLink: { type: String, default: null },
      AppleLink: { type: String, default: null },
      Instagram: { type: String, default: null },
      Facebook: { type: String, default: null },
    },
    default: null,
  },
  version: {
    type: String,
    default: null,
  },
  trackOrderNumber: {
    type: String,
    default: null,
  },
  status: {
    type: Number,
    enum: TrackStatus,
    required: true,
    default: TrackStatus.Draft
  },
});

trackSchema.index({ _id: 1 }, { unique: true });

// Define the model
const Track = mongoose.models.Track || mongoose.model<ITrack>("Track", trackSchema);
export default Track;
