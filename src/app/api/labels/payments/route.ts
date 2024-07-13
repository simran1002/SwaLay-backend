import { NextRequest, NextResponse } from 'next/server';
import Payment from '../../../../models/payments';
import { connect } from '../../../../dbConfig/dbConfig';
import response from '../../../../lib/response';

// Handle the POST request to create a new payment
export async function POST(request: NextRequest) {
  await connect();
  console.log("Payment check")
  try {
    // Parse the request body
    const reqBody = await request.json();
    console.log(reqBody)
    const { labelId, label, amount, status, time } = reqBody;

    // Validate required fields
    if (!labelId || !label || !amount || !time) {
      return NextResponse.json(response(400, null, false, "Please provide all required fields"));
    }

    // // Check if a payment with the same ID already exists
    // const existingPayment = await Payment.findOne({ labelId });
    // if (existingPayment) {
    //   return NextResponse.json(response(400, null, false, "Payment with this ID already exists"));
    // }

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
    return NextResponse.json(response(201, savedPayment, true, "Payment created successfully"));
  } catch (error: any) {
    // Handle any errors that occur during the process
    return NextResponse.json(response(500, error.message, false, "An error occurred while creating the payment"));
  }
}
