import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import mongoose from 'mongoose';
import Youtube from '../../../../models/youtube'; // adjust the path as necessary

const handler = nextConnect();

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { id } = req.query;

    const deletedYoutube = await Youtube.findOneAndDelete({ id: Number(id) });

    if (!deletedYoutube) {
      return res.status(404).json({ message: 'Youtube copyright entry not found' });
    }

    res.status(200).json({ message: 'Youtube copyright entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  } finally {
    mongoose.connection.close();
  }
});

export default handler;
