import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import PaymentRequest, { PaymentStatus } from '@/models/paymentRequest';
import response from '@/lib/response'; 

export async function POST(req: NextRequest) {
  try {
    await connect(); 

    const body = await req.json();

    const { labelId, amount, date, status, comment } = body;

    if (!labelId || !amount || !date || !status) {
      return response(400, null, false, 'Missing required fields').nextResponse;
    }

    if (!Object.values(PaymentStatus).includes(status)) {
      return response(400, null, false, 'Invalid payment status').nextResponse;
    }

    const newPaymentRequest = new PaymentRequest({
      labelId,
      amount,
      date,
      status,
      comment,
    });

    const savedPaymentRequest = await newPaymentRequest.save();

    return response(201, savedPaymentRequest, true, 'Payment request created successfully').nextResponse;
  } catch (error: any) {
    console.error('Error creating payment request:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
