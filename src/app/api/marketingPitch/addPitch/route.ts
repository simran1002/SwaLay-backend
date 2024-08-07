import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import MarketingPitch from '@/models/marketing';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string); // Connect to MongoDB
      const marketingPitch = new MarketingPitch(req.body);
      await marketingPitch.save();
      res.status(201).json(marketingPitch);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create marketing pitch' });
    } finally {
      await mongoose.disconnect(); // Disconnect from MongoDB
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
