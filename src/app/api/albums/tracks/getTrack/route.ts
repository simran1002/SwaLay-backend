import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Track from '@/models/track'; // Adjust the path as necessary
import {connect} from '@/dbConfig/dbConfig'; // A utility to connect to MongoDB

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { albumId } = req.query;

  if (!albumId || typeof albumId !== 'string') {
    return res.status(400).json({ message: 'Invalid albumId' });
  }

  try {
    const tracks = await Track.find({ albumId: parseInt(albumId) });

    if (!tracks || tracks.length === 0) {
      return res.status(404).json({ message: 'No tracks found for this album' });
    }

    res.status(200).json({ tracks });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}
