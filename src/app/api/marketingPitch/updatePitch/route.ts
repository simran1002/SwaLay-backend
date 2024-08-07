import type { NextApiRequest, NextApiResponse } from 'next';
import MarketingPitch from '@/models/marketing';
import { connect } from '@/dbConfig/dbConfig';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { id } = req.query;
    try {
      await connect(); // Connect to MongoDB
      const marketingPitch = await MarketingPitch.findByIdAndUpdate(id, req.body, { new: true });
      if (marketingPitch) {
        res.status(200).json(marketingPitch);
      } else {
        res.status(404).json({ error: 'Marketing pitch not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update marketing pitch' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
