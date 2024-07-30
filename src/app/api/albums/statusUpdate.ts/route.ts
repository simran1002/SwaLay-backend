import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Album from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';

export default async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { id, status, comment } = req.body;

  if (!id || !status || (status === 'reject' && !comment)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!['approve', 'reject', 'live'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Album ID' });
  }

  try {
    const album = await Album.findById(id);

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    album.status = status;
    if (status === 'reject') {
      album.comment = comment;
    }

    await album.save();
    res.status(200).json({ message: 'Album status updated successfully', album });
  } catch (error: any) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}
