import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import ProfileBankDetails from '@/models/profileBank';
import response from '@/lib/response'; // Adjust the path to where you defined the response function

export async function PUT(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const { labelId, ...updateData } = body;

    if (!labelId) {
      return response(400, null, false, 'labelId is required').nextResponse;
    }

    const updatedBankDetails = await ProfileBankDetails.findOneAndUpdate(
      { labelId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBankDetails) {
      return response(404, null, false, 'Bank details not found').nextResponse;
    }

    return response(200, updatedBankDetails, true, 'Bank details updated successfully').nextResponse;
  } catch (error: any) {
    console.error('Error updating bank details:', error);
    return response(500, null, false, 'Error updating bank details').nextResponse;
  }
}
