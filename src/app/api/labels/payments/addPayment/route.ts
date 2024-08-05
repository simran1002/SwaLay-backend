import { NextRequest, NextResponse } from 'next/server';
import Payment from '@/models/payments';
import { connect } from '@/dbConfig/dbConfig';
import response from '@/lib/response';


function isSameMonthAndYear(date1: Date, date2: Date): boolean {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export async function POST(request: NextRequest) {
  await connect();

  try {
    const reqBody = await request.json();
    const { labelId, label, amount, status, time } = reqBody;

    if (!labelId || !label || !amount || !time) {
      const { nextResponse } = response(400, null, false, "Please provide all required fields");
      return nextResponse;
    }

    const existingPayment = await Payment.findOne({ labelId });
    if (existingPayment && isSameMonthAndYear(new Date(existingPayment.time), new Date(time))) {
      const { nextResponse } = response(400, null, false, "Payment with this labelId already exists for this month");
      return nextResponse;
    }

    const newPayment = new Payment({
      labelId,
      label,
      amount,
      status,
      time,
    });

    const savedPayment = await newPayment.save();

    const { nextResponse } = response(201, savedPayment, true, "Payment created successfully");
    return nextResponse;
  } catch (error: any) {
    const { nextResponse } = response(500, error.message, false, "An error occurred while creating the payment");
    return nextResponse;
  }
}
