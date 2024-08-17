// pages/api/addAmount.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import {connect} from '@/dbConfig/dbConfig';
import TotalAmount from '@/models/totalAmount';

connect();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return addTotalAmount(req, res);
  }
  return res.status(405).end(); // Method Not Allowed
}

const addTotalAmount = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { totalAmount, labelId } = req.body;
    if (typeof totalAmount !== 'number' || typeof labelId !== 'string') {
      return res.status(400).json({ message: 'Invalid data' });
    }
    const newTotalAmount = new TotalAmount({ totalAmount, labelId });
    const savedTotalAmount = await newTotalAmount.save();
    return res.status(201).json(savedTotalAmount);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
