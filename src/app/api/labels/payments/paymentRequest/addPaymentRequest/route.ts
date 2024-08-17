import type { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '@/dbConfig/dbConfig';
import PaymentRequest, { PaymentStatus } from '@/models/paymentRequest';

connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return addPaymentRequest(req, res);
  }
  return res.status(405).end();
}

const addPaymentRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { labelId, amount, date, status, comment } = req.body;

    if (typeof labelId !== 'string' || typeof amount !== 'number' || typeof status !== 'string') {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (!Object.values(PaymentStatus).includes(status as PaymentStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const newPaymentRequest = new PaymentRequest({ labelId, amount, date: parsedDate, status: status as PaymentStatus, comment });
    const savedPaymentRequest = await newPaymentRequest.save();
    return res.status(201).json(savedPaymentRequest);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
