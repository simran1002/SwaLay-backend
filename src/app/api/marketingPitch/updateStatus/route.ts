import type { NextApiRequest, NextApiResponse } from 'next';
import MarketingPitch from '@/models/marketing';
import { connect } from '@/dbConfig/dbConfig';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    const { id } = req.query;
    const { status } = req.body;

    // Validate status value
    const validStatuses = ['draft', 'submitted', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
      await connect(); // Connect to MongoDB
      const marketingPitch = await MarketingPitch.findByIdAndUpdate(
        id,
        { status },
        { new: true } // Return the updated document
      );

      if (marketingPitch) {
        res.status(200).json(marketingPitch);
      } else {
        res.status(404).json({ error: 'Marketing pitch not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update marketing pitch status' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
