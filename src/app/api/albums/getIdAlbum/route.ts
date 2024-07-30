import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import mongoose from 'mongoose';
import response, { ResponseType } from '@/lib/response'; // Adjust the path as needed

export async function GET(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    // Extract the album ID from the query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return response(400, null, false, 'Valid Album ID is required').nextResponse;
    }

    // Find the album by ID
    const album = await Album.findById(id);

    if (!album) {
      return response(404, null, false, 'Album not found').nextResponse;
    }

    return response(200, album, true, 'Album retrieved successfully').nextResponse;
  } catch (error: any) {
    console.error('Error fetching album:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
