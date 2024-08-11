import type { NextApiRequest, NextApiResponse } from 'next';
import MarketingPitch from '@/models/marketing';
import { connect } from '@/dbConfig/dbConfig';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { albumId } = req.query;
    try {
      await connect(); // Connect to MongoDB
      const marketingPitch = await MarketingPitch.findOne({ albumId });
      if (marketingPitch) {
        res.status(200).json(marketingPitch);
      } else {
        res.status(404).json({ error: 'Marketing pitch not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch marketing pitch' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
