import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import ProfileBankDetails from '@/models/profileBank';
import { response } from '@/lib/response'; // Adjust the path if needed

export async function POST(request: Request) {
  try {
    await connect(); // Connect to the database

    const body = await request.json(); // Parse the request body
    const bankDetails = new ProfileBankDetails(body); // Create a new instance with the request data
    const savedBankDetails = await bankDetails.save(); // Save the bank details to the database

    // Return a standardized success response
    return response(201, savedBankDetails, true, 'Bank details created successfully').nextResponse;
  } catch (error: any) {
    console.error('Error creating bank details:', error);

    // Return a standardized error response
    return response(400, null, false, 'Error creating bank details').nextResponse;
  }
}
