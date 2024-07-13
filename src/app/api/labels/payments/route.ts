import { NextRequest, NextResponse } from 'next/server';
import Payment from '../../../../models/payments';
import { connect } from '../../../../dbConfig/dbConfig';
import response from '../../../../lib/response';

// Handle the POST request to create a new payment
export async function POST(request: NextRequest) {
  await connect();
  try {
    // Parse the request body
    const reqBody = await request.json();
    const { labelId, label, amount, status, time } = reqBody;

    // Validate required fields
    if (!labelId || !label || !amount || !time) {
      const { nextResponse } = response(400, null, false, "Please provide all required fields");
      return nextResponse;
    }

    // Create a new payment
    const newPayment = new Payment({
      labelId,
      label,
      amount,
      status,
      time,
    });

    // Save the payment to the database
    const savedPayment = await newPayment.save();

    // Respond with the saved payment data
    const { nextResponse } = response(201, savedPayment, true, "Payment created successfully");
    return nextResponse;
  } catch (error: any) {
    // Handle any errors that occur during the process
    const { nextResponse } = response(500, error.message, false, "An error occurred while creating the payment");
    return nextResponse;
  }
}
