import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Album from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';
import { response } from '@/lib/response'; // Import the response function

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await connect();
  const { id } = req.query;

  if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
    const { nextResponse } = response(400, null, false, 'Valid Album ID is required');
    return res.status(400).json(nextResponse.body);
  }

  try {
    const album = await Album.findById(id);

    if (!album) {
      const { nextResponse } = response(404, null, false, 'Album not found');
      return res.status(404).json(nextResponse.body);
    }

    const { nextResponse } = response(200, { album }, true, 'Album fetched successfully');
    return res.status(200).json(nextResponse.body);
  } catch (error) {
    console.error('Internal Server Error:', error);
    const { nextResponse } = response(500, null, false, 'Internal Server Error');
    return res.status(500).json(nextResponse.body);
  }
}
