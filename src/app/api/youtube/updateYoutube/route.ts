import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import mongoose from 'mongoose';
import Youtube from '../../../../models/youtube'; // adjust the path as necessary
import { response } from '@/lib/response'; // Adjust the import path as necessary

export async function PUT(req: NextRequest) {
  try {
    await connect();

    // Extract the id from the query parameters
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return response(400, null, false, 'ID is required').nextResponse;
    }

    // Parse the request body
    const body = await req.json();
    const { status } = body;

    // Update the Youtube entry status
    const updatedYoutube = await Youtube.findOneAndUpdate(
      { id: Number(id) },
      { status },
      { new: true }
    );

    if (!updatedYoutube) {
      return response(404, null, false, 'Youtube copyright entry not found').nextResponse;
    }

    return response(200, updatedYoutube, true, 'Youtube copyright entry status updated').nextResponse;
  } catch (error) {
    console.error('Internal server error:', error);
    return response(500, error, false, 'Internal server error').nextResponse;
  } finally {
    mongoose.connection.close();
  }
}
