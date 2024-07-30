import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Album document
interface IAlbum extends Document {
    labelId: mongoose.Schema.Types.ObjectId;
    title?: string | null;
    thumbnail?: string | null;
    language?: string | null;
    genre?: string | null;
    tags?: string[] | null;
    releasedate?: Date | null;
    duration: string;
    status?: number;
    tracks?: number;
    upc?: string | null;
    artist?: string | null;
    cline?: string | null;
    pline?: string | null;
    comment: string;
}

// Define the schema for the Album collection
const albumSchema: Schema = new Schema({
    labelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Labels",
        required: true
    },
    title: {
        type: String,
        default: null
    },
    thumbnail: {
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
    tags: {
        type: [String],
        default: []
    },
    releasedate: {
        type: Date,
        default: null
    },
    url: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: null
    },
    tracks: {
        type: Number,
        default: 0,
        max: 99999999999
    },
    upc: {
        type: String,
        default: null
    },
    artist: {
        type: String,
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
    comment: {
        type: String,
        required: true,
        default: null
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// Create the model for the Album collection
const Album = mongoose.models.Album || mongoose.model<IAlbum>('Album', albumSchema);

export default Album;
