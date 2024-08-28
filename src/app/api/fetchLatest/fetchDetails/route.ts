import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import Artist from '@/models/artist';
import response from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    await connect(); 

    const albumId = req.nextUrl.searchParams.get('albumId');

    if (!albumId) {
      return response(400, null, false, 'Album ID is required').nextResponse;
    }

    const albumObjectId = new mongoose.Types.ObjectId(albumId);

    const albumDetails = await Album.aggregate([
      {
        $match: { _id: albumObjectId }
      },
      {
        $lookup: {
          from: 'artists',
          localField: 'artist', 
          foreignField: '_id', 
          as: 'artistDetails' 
        }
      },
      {
        $unwind: '$artistDetails'
      },
      {
        $project: {
          _id: 0,
          title: 1,
          image: 1, 
          'artistDetails.name': 1, 
          'platformLinks.SpotifyLink': 1,
          'platformLinks.AppleLink': 1, 
          'platformLinks.Instagram': 1,
          'platformLinks.Facebook': 1 
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
