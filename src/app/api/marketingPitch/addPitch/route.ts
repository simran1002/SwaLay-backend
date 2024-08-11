import type { NextApiRequest, NextApiResponse } from 'next';
import MarketingPitch from '@/models/marketing';
import { connect } from '@/dbConfig/dbConfig';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      await connect(); 
      const marketingPitch = new MarketingPitch(req.body);
      await marketingPitch.save();
      res.status(201).json(marketingPitch);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create marketing pitch' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
