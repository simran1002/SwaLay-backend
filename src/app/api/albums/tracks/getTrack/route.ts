import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Track from '@/models/track'; // Adjust the path as necessary
import { connect } from '@/dbConfig/dbConfig'; // A utility to connect to MongoDB
import response, { ResponseType } from '@/lib/response'; // Adjust the path as necessary

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { albumId } = req.query;

  if (!albumId || typeof albumId !== 'string') {
    const { nextResponse } = response(400, null, false, 'Invalid albumId');
    return nextResponse;
  }

  try {
    const tracks = await Track.find({ albumId: parseInt(albumId) });

    if (!tracks || tracks.length === 0) {
      const { nextResponse } = response(404, null, false, 'No tracks found for this album');
      return nextResponse;
    }

    const { nextResponse } = response(200, tracks, true, 'Tracks retrieved successfully');
    return nextResponse;
  } catch (error: any) {
    const { nextResponse } = response(500, null, false, 'Internal Server Error');
    console.error('Internal Server Error:', error);
    return nextResponse;
  }
}
