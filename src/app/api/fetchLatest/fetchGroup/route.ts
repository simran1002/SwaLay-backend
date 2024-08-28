import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import Artist from '@/models/artist'; // Assuming you have an Artist model
import response from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    await connect(); 

    const artistId = req.nextUrl.searchParams.get('artistId');

    if (!artistId) {
      return response(400, null, false, 'Artist ID is required').nextResponse;
    }

    const artistObjectId = new mongoose.Types.ObjectId(artistId);

    // Aggregate albums by artistId
    const albums = await Album.aggregate([
      {
        $match: { artist: artistObjectId } // Match albums by the provided artistId
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
        $unwind: '$artistDetails' // Unwind to get artist details in the root object
      },
      {
        $project: {
          _id: 1, 
          title: 1,
          labelId: 1,
          language: 1,
          genre: 1, 
          releasedate: 1, 
          totalTracks: 1, 
          upc: 1, 
          cline: 1, 
          pline: 1, 
          status: 1, 
          platformLinks: 1, 
          comment: 1,
          image: 1, 
          'artistDetails.name': 1, 
        }
      }
    ]);

    if (!albums.length) {
      return response(404, null, false, 'No albums found for this artist').nextResponse;
    }

    return response(200, albums, true, 'Albums retrieved successfully').nextResponse;
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
