import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import Artist from '@/models/artist'; // Assuming you have an Artist model
import response from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    await connect(); 

    const albumId = req.nextUrl.searchParams.get('albumId');

    if (!albumId) {
      return response(400, null, false, 'Album ID is required').nextResponse;
    }

    const albumObjectId = new mongoose.Types.ObjectId(albumId);

    // Aggregate to get album details by albumId
    const albumDetails = await Album.aggregate([
      {
        $match: { _id: albumObjectId } // Match the album by albumId
      },
      {
        $lookup: {
          from: 'artists', // Name of the artist collection
          localField: 'artist',
          foreignField: '_id',
          as: 'artistDetails'
        }
      },
      {
        $unwind: '$artistDetails' // Unwind the artist details array
      },
      {
        $project: {
          _id: 0, // Exclude album ID (if not needed)
          title: 1, // Include album title
          image: 1, // Include album image
          'artistDetails.name': 1, // Include artist name
          'platformLinks.SpotifyLink': 1, // Include Spotify link
          'platformLinks.AppleLink': 1, // Include Apple Music link
          'platformLinks.Instagram': 1, // Include Instagram link
          'platformLinks.Facebook': 1, // Include Facebook link
        }
      }
    ]);

    if (!albumDetails.length) {
      return response(404, null, false, 'Album not found').nextResponse;
    }

    return response(200, albumDetails[0], true, 'Album details retrieved successfully').nextResponse; // Return the first object since we expect only one result
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
