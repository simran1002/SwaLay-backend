import type { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '@/dbConfig/dbConfig';
import PaymentRequest from '@/models/paymentRequest';

connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getPaymentRequests(req, res);
  }
  return res.status(405).end();
}

const getPaymentRequests = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { labelId } = req.query;

    const filter: any = {}; 

    if (labelId && typeof labelId === 'string') {
      filter.labelId = labelId;
    }
    const paymentRequests = await PaymentRequest.find(filter).sort({ date: -1 });
    return res.status(200).json(paymentRequests);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
