import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Payment from '@/models/payments'; 
import { response } from '@/lib/response'; 

export async function PATCH(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return response(400, null, false, 'Payment ID is required').nextResponse;
    }

    const body = await req.json();

    if (body.status !== undefined && typeof body.status !== 'boolean') {
      return response(400, null, false, 'Invalid status value').nextResponse;
    }

    if (body.amount && typeof body.amount !== 'string') {
      return response(400, null, false, 'Invalid amount').nextResponse;
    }

    const updatedPayment = await Payment.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPayment) {
      return response(404, null, false, 'Payment not found').nextResponse;
    }

    return response(200, updatedPayment, true, 'Payment updated successfully').nextResponse;
  } catch (error: any) {
    console.error('Error updating payment:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
