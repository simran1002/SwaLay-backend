// pages/api/bank-details/update.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import {connect} from '@/dbConfig/dbConfig';
import ProfileBankDetails from '@/models/profileBank';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { labelId, ...updateData } = req.body;

  try {
    await connect();

    const updatedBankDetails = await ProfileBankDetails.findOneAndUpdate(
      { labelId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBankDetails) {
      return res.status(404).json({ message: 'Bank details not found' });
    }

    res.status(200).json(updatedBankDetails);
  } catch (error) {
    res.status(400).json({ message: 'Error updating bank details', error });
  }
}