// src/models/Album.ts

import mongoose, { Schema, Document, ObjectId } from 'mongoose';

enum AlbumStatus {
    Draft = 0,
    Processing = 1,
    Approved = 2,
    Rejected = 3,
}

interface IAlbum extends Document {
    labelId: ObjectId;
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
    status: AlbumStatus;
    tags?: string | null;
    platformLinks: {
        SpotifyLink: string | null;
        AppleLink: string | null;
        Instagram: string | null;
        Facebook: string | null;
    } | null;
    comment: string;
    image?: string | null;
}

const albumSchema: Schema = new Schema({
    labelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Labels',
        required: true,
    },
    title: { type: String, default: null },
    thumbnail: { type: String, default: null },
    language: { type: String, default: null },
    genre: { type: String, default: null },
    releasedate: { type: Date, default: null },
    totalTracks: { type: Number, default: 0 },
    upc: { type: String, default: null },
    artist: { type: String, default: null },
    cline: { type: String, default: null },
    pline: { type: String, default: null },
    status: {
        type: Number,
        enum: AlbumStatus,
        required: true,
        default: AlbumStatus.Draft,
    },
    tags: { type: String, default: null },
    platformLinks: {
        type: {
            SpotifyLink: { type: String, default: null },
            AppleLink: { type: String, default: null },
            Instagram: { type: String, default: null },
            Facebook: { type: String, default: null },
        },
        default: null,
    },
    comment: { type: String, default: null },
    image: { type: String, default: null },
});

const Album = mongoose.models.Album || mongoose.model<IAlbum>('Album', albumSchema);

export { AlbumStatus };
export default Album;
