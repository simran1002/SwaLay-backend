// src/models/label.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ILabel extends Document {
  labelId: mongoose.Schema.Types.ObjectId;
  artistName: string;
  iprs: boolean;
  iprsNumber?: number;
  facebook?: string;
  appleMusic?: string;
  spotify?: string;
  instagramUsername?: string;
  profileImage?: Buffer;
}

const labelSchema: Schema = new Schema({
  labelId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  iprs: {
    type: Boolean,
    required: true,
  },
  iprsNumber: {
    type: Number,
    required: function (this: ILabel) {
      return this.iprs;
    },
  },
  facebook: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9._]+$/.test(v); // Only alphanumeric characters, dots, and underscores allowed
      },
      message: (props: any) => `${props.value} is not a valid Facebook username!`
    }
  },
  appleMusic: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9._]+$/.test(v); // Only alphanumeric characters, dots, and underscores allowed
      },
      message: (props: any) => `${props.value} is not a valid Apple Music username!`
    }
  },
  spotify: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9._]+$/.test(v); // Only alphanumeric characters, dots, and underscores allowed
      },
      message: (props: any) => `${props.value} is not a valid Spotify username!`
    }
  },
  instagramUsername: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9._]+$/.test(v); // Only alphanumeric characters, dots, and underscores allowed
      },
      message: (props: any) => `${props.value} is not a valid Instagram username!`
    }
  },
  profileImage: {
    type: Buffer,
    required: false,
  },
});

export default mongoose.models.Label || mongoose.model<ILabel>('Label', labelSchema);
