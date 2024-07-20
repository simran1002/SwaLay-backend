// src/app/api/profile/bankDetails/update/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import ProfileBankDetails from '@/models/profileBank';

export async function PUT(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const { labelId, ...updateData } = body;

    if (!labelId) {
      return NextResponse.json({ error: 'labelId is required' }, { status: 400 });
    }

    const updatedBankDetails = await ProfileBankDetails.findOneAndUpdate(
      { labelId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBankDetails) {
      return NextResponse.json({ error: 'Bank details not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBankDetails);
  } catch (error) {
    console.error('Error updating bank details:', error);
    return NextResponse.json({ error: 'Error updating bank details' }, { status: 400 });
  }
}