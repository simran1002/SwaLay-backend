import mongoose, { Schema, Document } from 'mongoose';

enum AlbumStatus {
    Draft = 0, // on information submit
    Processing = 1, // on final submit
    Approved = 2,
    Rejected = 3,
}

// Define the interface for the Album document
interface IAlbum extends Document {
    labelId: mongoose.Schema.Types.ObjectId;
    title?: string | null;
    thumbnail?: string | null;
    language?: string | null;
    genre?: string | null;
    releasedate?: Date | null;
    totalTracks?: number;
    upc?: string | null;
    artist?: string | null;
    cline?: string | null;
    pline?: string | null;
    status: AlbumStatus; // update album status
    tags?: string | null;
    platformLinks: { SpotifyLink: string | null, AppleLink: string | null, Instagram: string | null, Facebook: string | null } | null; // albums links
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
    releasedate: {
        type: Date,
        default: null
    },
    totalTracks: {
        type: Number,
        default: 0,
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
    status: {
        type: Number,
        enum: AlbumStatus,
        required: true,
        default: AlbumStatus.Draft
    },
    tags: {
        type: String,
        default: '{}'
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
    comment: {
        type: String,
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

export { AlbumStatus };
export default Album;
