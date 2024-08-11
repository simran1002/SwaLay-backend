import type { NextApiRequest, NextApiResponse } from 'next';
import MarketingPitch from '@/models/marketing';
import { connect } from '@/dbConfig/dbConfig';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      await connect(); 
      const marketingPitches = await MarketingPitch.find();
      res.status(200).json(marketingPitches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch marketing pitches' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
