import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Track from '@/models/track'; // Adjust the path as necessary
import {connect} from '@/dbConfig/dbConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { trackId } = req.query;

  if (!trackId || typeof trackId !== 'string') {
    return res.status(400).json({ message: 'Invalid trackId' });
  }

  try {
    const track = await Track.findOne({ trackId: parseInt(trackId) });

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    res.status(200).json({ track });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}
