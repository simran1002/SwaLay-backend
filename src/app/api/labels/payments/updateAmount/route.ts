// pages/api/updateAmount.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import {connect} from '@/dbConfig/dbConfig';
import TotalAmount from '@/models/totalAmount';

connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    return updateTotalAmount(req, res);
  }
  return res.status(405).end(); // Method Not Allowed
}

const updateTotalAmount = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, totalAmount, labelId } = req.body;
    if (!id || typeof totalAmount !== 'number' || typeof labelId !== 'string') {
      return res.status(400).json({ message: 'Invalid data' });
    }
    const updatedTotalAmount = await TotalAmount.findByIdAndUpdate(
      id,
      { totalAmount, labelId, updateTime: new Date() },
      { new: true }
    );
    if (!updatedTotalAmount) {
      return res.status(404).json({ message: 'TotalAmount not found' });
    }
    return res.status(200).json(updatedTotalAmount);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
