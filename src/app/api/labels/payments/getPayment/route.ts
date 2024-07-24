import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Payment from '@/models/payments'; // Ensure this path is correct
import { connect } from '@/dbConfig/dbConfig'; // Ensure this path is correct

export async function GET(request: Request) {
  try {
    // Connect to the database
    await connect();

    // Extract labelId from query parameters
    const url = new URL(request.url);
    const labelId = url.searchParams.get('labelId');

    // Validate the labelId
    if (!labelId || Array.isArray(labelId)) {
      return NextResponse.json({ message: 'Invalid or missing labelId' }, { status: 400 });
    }

    // Fetch payments by labelId
    const payments = await Payment.find({ labelId: new mongoose.Types.ObjectId(labelId) });

    // Respond with the payments
    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    // Handle errors
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
