import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import response from '@/lib/response';
import Artist from '@/models/oldArtists';

export async function GET(req: NextRequest) {
  try {
    await connect(); 

    const labelId = req.nextUrl.searchParams.get('labelId');

    if (!labelId) {
      return response(400, null, false, 'Label ID is required').nextResponse;
    }

    const labelObjectId = new mongoose.Types.ObjectId(labelId);

    // Fetch albums by labelId
    const albums = await Album.find({ labelId: labelObjectId }).select('title _id artist');

    if (!albums.length) {
      return response(404, null, false, 'No albums found for this label').nextResponse;
    }

    const albumData = await Promise.all(
      albums.map(async (album) => {
        const artistName = await Artist.findById(album.artist).select('name');
        return {
          albumId: album._id,
          title: album.title,
          artistId: album.artist,
          artistName: artistName ? artistName.name : null, 
        };
      })
    );

    return response(200, albumData, true, 'Albums retrieved successfully').nextResponse;
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
