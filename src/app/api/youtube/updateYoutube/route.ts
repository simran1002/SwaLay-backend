import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import mongoose from 'mongoose';
import Youtube from '../../../../models/youtube';

const handler = nextConnect();

handler.patch(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { id } = req.query;
    const { status } = req.body;

    const updatedYoutube = await Youtube.findOneAndUpdate(
      { id: Number(id) },
      { status },
      { new: true }
    );

    if (!updatedYoutube) {
      return res.status(404).json({ message: 'Youtube copyright entry not found' });
    }

    res.status(200).json({ message: 'Youtube copyright entry status updated', data: updatedYoutube });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  } finally {
    mongoose.connection.close();
  }
});

export default handler;
