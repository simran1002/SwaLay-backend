import mongoose, { Schema, Document } from 'mongoose';

export interface Iartist extends Document {
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

const artistSchema: Schema = new Schema({
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
    required: function (this: Iartist) {
      return this.iprs;
    },
  },
  facebook: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9._]+$/.test(v); 
      },
      message: (props: any) => `${props.value} is not a valid Facebook username!`
    }
  },
  appleMusic: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9._]+$/.test(v); 
      },
      message: (props: any) => `${props.value} is not a valid Apple Music username!`
    }
  },
  spotify: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9._]+$/.test(v); 
      },
      message: (props: any) => `${props.value} is not a valid Spotify username!`
    }
  },
  instagramUsername: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9._]+$/.test(v);
      },
      message: (props: any) => `${props.value} is not a valid Instagram username!`
    }
  },
  profileImage: {
    type: String,
    required: false,
  },
});

export default mongoose.models.artist || mongoose.model<Iartist>('artist', artistSchema);
