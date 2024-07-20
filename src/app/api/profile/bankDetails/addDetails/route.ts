// src/app/api/bank-details/create/route.ts

import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import ProfileBankDetails from '@/models/profileBank';

export async function POST(request: Request) {
  try {
    await connect();

    const body = await request.json();
    const bankDetails = new ProfileBankDetails(body);
    const savedBankDetails = await bankDetails.save();

    return NextResponse.json(savedBankDetails, { status: 201 });
  } catch (error) {
    console.error('Error creating bank details:', error);
    return NextResponse.json({ message: 'Error creating bank details' }, { status: 400 });
  }
}