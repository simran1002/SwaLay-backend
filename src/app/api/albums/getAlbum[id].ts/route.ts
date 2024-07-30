import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Album from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    await connect();
    const { id } = req.query;

    if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: 'Valid Album ID is required' });
    }

    try {
      const album = await Album.findById(id);

      if (!album) {
        return res.status(404).json({ message: 'Album not found' });
      }

      res.status(200).json({ album });
    } catch (error) {
      console.error('Internal Server Error:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
