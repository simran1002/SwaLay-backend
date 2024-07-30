import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import ProfileBankDetails from '@/models/profileBank';
import { response } from '@/lib/response'; // Adjust the import path as needed

export async function GET(request: NextRequest) {
  try {
    await connect(); // Connect to the database

    // Extract the labelId from the query parameters
    const { searchParams } = new URL(request.url);
    const labelId = searchParams.get('labelId');

    if (!labelId) {
      // Return standardized error response for missing labelId
      return response(400, null, false, 'labelId is required').nextResponse;
    }

    // Find the bank details by labelId
    const bankDetails = await ProfileBankDetails.findOne({ labelId });

    if (!bankDetails) {
      // Return standardized error response for not found bank details
      return response(404, null, false, 'Bank details not found').nextResponse;
    }

    // Return standardized success response with bank details
    return response(200, bankDetails, true, 'Bank details retrieved successfully').nextResponse;
  } catch (error) {
    console.error('Error fetching bank details:', error);
    // Return standardized error response for internal server error
    return response(500, null, false, 'Internal Server Error').nextResponse;
  }
}
