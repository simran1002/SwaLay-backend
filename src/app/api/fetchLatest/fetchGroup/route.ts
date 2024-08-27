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
          _id: 1, // Include album ID
          title: 1, // Include album title
          labelId: 1, // Include label ID
          language: 1, // Include album language
          genre: 1, // Include album genre
          releasedate: 1, // Include release date
          totalTracks: 1, // Include total tracks
          upc: 1, // Include UPC
          cline: 1, // Include C-line
          pline: 1, // Include P-line
          status: 1, // Include album status
          platformLinks: 1, // Include platform links
          comment: 1, // Include comments
          image: 1, // Include image
          'artistDetails.name': 1, // Include artist name
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
