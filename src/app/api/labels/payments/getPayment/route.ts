import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Payment from '@/models/payments'; 
import { connect } from '@/dbConfig/dbConfig'; 
import response from '@/lib/response'; 

export async function GET(request: Request) {
  try {
    await connect();

    const url = new URL(request.url);
    const labelId = url.searchParams.get('labelId');

    if (!labelId || Array.isArray(labelId)) {
      return response(400, null, false, 'Invalid or missing labelId').nextResponse;
    }

    const payments = await Payment.find({ labelId: new mongoose.Types.ObjectId(labelId) });

    return response(200, payments, true, 'Payments fetched successfully').nextResponse;
  } catch (error) {
    console.error(error);
    return response(500, null, false, 'Internal Server Error').nextResponse;
  }
}
