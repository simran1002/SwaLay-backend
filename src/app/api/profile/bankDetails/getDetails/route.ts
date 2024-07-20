// pages/api/bank-details/[labelId].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import {connect} from '@/dbConfig/dbConfig';
import ProfileBankDetails from '@/models/profileBank';

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {


  const { labelId } = req.query;

  try {
    await connect();

    const bankDetails = await ProfileBankDetails.findOne({ labelId });

    if (!bankDetails) {
      return res.status(404).json({ message: 'Bank details not found' });
    }

    res.status(200).json(bankDetails);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching bank details', error });
  }
}