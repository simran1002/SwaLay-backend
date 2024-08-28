import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import Artist from '@/models/oldArtists';
import response from '@/lib/response';

// Use a method to fetch user context from request headers or other means
import { getUserFromRequest } from '@/lib/userContext'; // You need to implement this

export async function GET(req: NextRequest) {
  try {
    await connect();

    // Fetch user context (labelId) from request headers or other means
    const context = await getUserFromRequest(req); // Implement this function to get context from the request
    const labelId = context?.user?._id;

    if (!labelId) {
      return response(400, null, false, 'Label ID is required').nextResponse;
    }

    const labelObjectId = new mongoose.Types.ObjectId(labelId);

    // Fetch all albums by labelId
    const albums = await Album.find({ labelId: labelObjectId }).select('_id title artist thumbnail genre releasedate status totalTracks tags comment');

    if (!albums.length) {
      return response(404, null, false, 'No albums found for this label').nextResponse;
    }

    // Fetch artist details for each album
    const albumData = await Promise.all(
      albums.map(async (album) => {
        const artistDetails = album.artist ? await Artist.findById(album.artist).select('artistName profileImage isSinger isLyricist isComposer isProducer') : null;

        return {
          albumId: album._id,
          title: album.title,
          thumbnail: album.thumbnail,
          genre: album.genre,
          releaseDate: album.releasedate,
          status: album.status,
          totalTracks: album.totalTracks,
          tags: album.tags,
          comment: album.comment,
          artist: artistDetails ? {
            id: artistDetails._id,
            name: artistDetails.artistName,
            profileImage: artistDetails.profileImage,
            isSinger: artistDetails.isSinger,
            isLyricist: artistDetails.isLyricist,
            isComposer: artistDetails.isComposer,
            isProducer: artistDetails.isProducer,
          } : null,
        };
      })
    );

    return response(200, albumData, true, 'Albums and artists retrieved successfully').nextResponse;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Internal Server Error:', error.message);
      return response(500, error.message, false, 'Internal Server Error').nextResponse;
    } else {
      console.error('Internal Server Error:', error);
      return response(500, null, false, 'Internal Server Error').nextResponse;
    }
  }
}
