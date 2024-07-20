import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import ProfileBankDetails from '@/models/profileBank';

export async function GET(request: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const labelId = searchParams.get('labelId');

    if (!labelId) {
      return NextResponse.json({ error: 'labelId is required' }, { status: 400 });
    }

    const bankDetails = await ProfileBankDetails.findOne({ labelId });

    if (!bankDetails) {
      return NextResponse.json({ error: 'Bank details not found' }, { status: 404 });
    }

    return NextResponse.json(bankDetails);
  } catch (error) {
    console.error('Error fetching bank details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}