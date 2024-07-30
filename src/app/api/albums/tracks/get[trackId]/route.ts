import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Track from '@/models/track'; // Adjust the path as necessary
import { connect } from '@/dbConfig/dbConfig';
import response from '@/lib/response'; // Adjust the path to where the response function is located

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { trackId } = req.query;

  if (!trackId || typeof trackId !== 'string') {
    // Using the response function for error case
    const { nextResponse } = response(400, null, false, 'Invalid trackId');
    return res.status(400).json(nextResponse.body);
  }

  try {
    // Adjust the query to find the track by ID correctly
    const track = await Track.findOne({ trackId: parseInt(trackId) });

    if (!track) {
      // Using the response function for not found case
      const { nextResponse } = response(404, null, false, 'Track not found');
      return res.status(404).json(nextResponse.body);
    }

    // Using the response function for successful case
    const { nextResponse } = response(200, track, true, 'Track fetched successfully');
    return res.status(200).json(nextResponse.body);
  } catch (error) {
    // Using the response function for internal server error case
    const { nextResponse } = response(500, null, false, 'Internal Server Error');
    return res.status(500).json(nextResponse.body);
  }
}
