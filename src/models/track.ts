import mongoose, { Schema, Document } from "mongoose";

// Define the Track interface extending Document
export interface ITrack extends Document {
  id: number;
  released: string | null;
  song: string | null;
  composer: string | null;
  singer: string | null;
  lyrics: string | null;
  music: string | null;
  producer: string | null;
  isrc: string | null;
  duration: string | null;
  url: string | null;
  cid: number | null;
  trackno: string | null;
  cut: string | null;
  link: string | null;
  SpotifyLink: string | null;
  AppleLink: string | null;
  Instagram: string | null;
  Facebook: string | null;
  tags: string | null;
  cut3: string | null;
  platformLinks: string | null;
  otherSinger: string | null;
  otherLyricist: string | null;
  otherProducer: string | null;
  otherComposer: string | null;
  category: string | null;
  type: string | null;
  version: string | null;
  composerIPI: string | null;
  iprs: number | null;
  role: string | null;
}

// Define the schema
const trackSchema: Schema<ITrack> = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  released: {
    type: String,
    default: null,
  },
  song: {
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
  lyrics: {
    type: String,
    default: null,
  },
  music: {
    type: String,
    default: null,
  },
  producer: {
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
  url: {
    type: String,
    default: null,
  },
  cid: {
    type: Number,
    default: null,
  },
  trackno: {
    type: String,
    default: null,
  },
  cut: {
    type: String,
    default: null,
  },
  link: {
    type: String,
    default: null,
  },
  SpotifyLink: {
    type: String,
    default: null,
  },
  AppleLink: {
    type: String,
    default: null,
  },
  Instagram: {
    type: String,
    default: null,
  },
  Facebook: {
    type: String,
    default: null,
  },
  tags: {
    type: String,
    default: null,
  },
  cut3: {
    type: String,
    default: null,
  },
  platformLinks: {
    type: String,
    default: null,
  },
  otherSinger: {
    type: String,
    default: null,
  },
  otherLyricist: {
    type: String,
    default: null,
  },
  otherProducer: {
    type: String,
    default: null,
  },
  otherComposer: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: null,
  },
  version: {
    type: String,
    default: null,
  },
  composerIPI: {
    type: String,
    default: null,
  },
  iprs: {
    type: Number,
    default: null,
  },
  role: {
    type: String,
    default: null,
  },
});

trackSchema.index({ id: 1 }, { unique: true });

// Define the model
const Track = mongoose.models.Track || mongoose.model<ITrack>("Track", trackSchema);

export default Track;