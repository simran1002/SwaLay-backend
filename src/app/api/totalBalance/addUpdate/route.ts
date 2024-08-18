import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import TotalBalance from '@/models/totalBalance';
import response from '@/lib/response'; 

export async function POST(req: NextRequest) {
  try {
    await connect(); 

    const body = await req.json();
    const { labelId, totalBalance } = body;

    if (!labelId || typeof totalBalance !== 'number') {
      return response(400, null, false, 'labelId and totalBalance are required').nextResponse;
    }

    const existingRecord = await TotalBalance.findOne({ labelId });

    if (existingRecord) {
      existingRecord.totalBalance = totalBalance;
      const updatedRecord = await existingRecord.save();
      return response(200, updatedRecord, true, 'Total balance updated successfully').nextResponse;
    } else {
      const newRecord = new TotalBalance({
        labelId,
        totalBalance,
      });
      const savedRecord = await newRecord.save();
      return response(201, savedRecord, true, 'Total balance created successfully').nextResponse;
    }
  } catch (error: any) {
    console.error('Error in creating/updating total balance:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
