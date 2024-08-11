// src/models/marketingPitch.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketingPitch extends Document {
  albumId: mongoose.Schema.Types.ObjectId;
  songName: string;
  singer: string;
  musicProducer: string;
  composer: string;
  lyricist: string;
  language: string;
  isrc: string;
  
  mood: string;
  tag: string;
  aboutArtist: string;
  artistInstagramUrl?: string;
  aboutSong: string;
  promotionLinks: string[];
  musicVideoLink?: string;
  addFile?: Buffer; // For file uploads; if you handle files differently, adjust accordingly
  status: string; // New field added here
}

const marketingPitchSchema: Schema = new Schema({
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  songName: {
    type: String,
    required: true,
  },
  singer: {
    type: String,
    required: true,
  },
  musicProducer: {
    type: String,
    required: true,
  },
  composer: {
    type: String,
    required: true,
  },
  lyricist: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  isrc: {
    type: String,
    required: true,
  },
  
  mood: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  aboutArtist: {
    type: String,
    required: true,
  },
  artistInstagramUrl: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]+$/.test(v); // Valid Instagram URL format
      },
      message: (props: any) => `${props.value} is not a valid Instagram URL!`
    }
  },
  aboutSong: {
    type: String,
    required: true,
  },
  promotionLinks: {
    type: [String],
    required: true,
    validate: {
      validator: function (v: string[]) {
        return v.every(link => /^(https?:\/\/)/.test(link)); // Ensures all links are valid URLs
      },
      message: (props: any) => `At least one of the promotion links is not a valid URL!`
    }
  },
  musicVideoLink: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^(https?:\/\/)/.test(v); // Valid URL format
      },
      message: (props: any) => `${props.value} is not a valid URL!`
    }
  },
  addFile: {
    type: Buffer, // Assuming files are stored as binary data; adjust as necessary
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'submitted', 'approved', 'rejected'], // Example enum values
    default: 'draft',
  },
});

export default mongoose.models.marketingPitch || mongoose.model<IMarketingPitch>('marketingPitch', marketingPitchSchema);
