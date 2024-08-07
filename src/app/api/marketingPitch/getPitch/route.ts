import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import MarketingPitch from '@/models/marketing';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string); // Connect to MongoDB
      const marketingPitches = await MarketingPitch.find();
      res.status(200).json(marketingPitches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch marketing pitches' });
    } finally {
      await mongoose.disconnect(); // Disconnect from MongoDB
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
