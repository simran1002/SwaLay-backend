import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Album, { AlbumStatus } from '@/models/albums'; 
import { connect } from '@/dbConfig/dbConfig';
import response from '@/lib/response';

export default async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { id, status, comment } = req.body;

  if (!id || status === undefined || (status === AlbumStatus.Rejected && !comment)) {
    return res.status(400).json(response(400, null, false, 'Missing required fields').responseObject);
  }

  if (!Object.values(AlbumStatus).includes(status)) {
    return res.status(400).json(response(400, null, false, 'Invalid status value').responseObject);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(response(400, null, false, 'Invalid Album ID').responseObject);
  }

  try {
    const album = await Album.findById(id);

    if (!album) {
      return res.status(404).json(response(404, null, false, 'Album not found').responseObject);
    }

    album.status = status;
    if (status === AlbumStatus.Rejected) {
      album.comment = comment;
    }

    await album.save();
    return res.status(200).json(response(200, album, true, 'Album status updated successfully').responseObject);
  } catch (error: any) {
    console.error('Internal Server Error:', error);
    return res.status(500).json(response(500, null, false, 'Internal Server Error').responseObject);
  }
}
