import type { NextApiRequest, NextApiResponse } from 'next';
import MarketingPitch from '@/models/marketing';
import { connect } from '@/dbConfig/dbConfig';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await connect(); // Connect to MongoDB
      const result = await MarketingPitch.findByIdAndDelete(id);
      if (result) {
        res.status(200).json({ message: 'Marketing pitch deleted successfully' });
      } else {
        res.status(404).json({ error: 'Marketing pitch not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete marketing pitch' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
