import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Payment from '@/models/payments'; // Ensure this path is correct
import { connect } from '@/dbConfig/dbConfig'; // Ensure this path is correct
import response from '@/lib/response'; // Adjust the path if necessary

export async function GET(request: Request) {
  try {
    // Connect to the database
    await connect();

    // Extract labelId from query parameters
    const url = new URL(request.url);
    const labelId = url.searchParams.get('labelId');

    // Validate the labelId
    if (!labelId || Array.isArray(labelId)) {
      return response(400, null, false, 'Invalid or missing labelId').nextResponse;
    }

    // Fetch payments by labelId
    const payments = await Payment.find({ labelId: new mongoose.Types.ObjectId(labelId) });

    // Respond with the payments
    return response(200, payments, true, 'Payments fetched successfully').nextResponse;
  } catch (error) {
    // Handle errors
    console.error(error);
    return response(500, null, false, 'Internal Server Error').nextResponse;
  }
}
