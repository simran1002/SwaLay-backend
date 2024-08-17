import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import PaymentRequest, { PaymentStatus } from '@/models/paymentRequest';
import response from '@/lib/response'; 

export async function PATCH(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return response(400, null, false, 'Valid PaymentRequest ID is required').nextResponse;
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !Object.values(PaymentStatus).includes(status)) {
      return response(400, null, false, 'Invalid payment status').nextResponse;
    }

    const updatedPaymentRequest = await PaymentRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true } 
    );

    if (!updatedPaymentRequest) {
      return response(404, null, false, 'Payment request not found').nextResponse;
    }

    return response(200, updatedPaymentRequest, true, 'Payment request status updated successfully').nextResponse;
  } catch (error: any) {
    console.error('Error updating payment request status:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
