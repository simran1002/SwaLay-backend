import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import response from '@/lib/response'; // Import the response function

export async function GET(req: NextRequest) {
  try {
    await connect(); 

    const labelId = req.nextUrl.searchParams.get('labelId');

    if (!labelId) {
      return response(400, null, false, 'Label ID is required').nextResponse;
    }

    const labelObjectId = new mongoose.Types.ObjectId(labelId);

    const albums = await Album.find({ labelId: labelObjectId });

    if (!albums.length) {
      return response(404, null, false, 'No albums found for this label').nextResponse;
    }

    return response(200, albums, true, 'Albums retrieved successfully').nextResponse;
  } catch (error: unknown) {
    // TypeScript requires us to narrow the type of error
    if (error instanceof Error) {
      console.error('Internal Server Error:', error.message);
      return response(500, error.message, false, 'Internal Server Error').nextResponse;
    } else {
      console.error('Internal Server Error:', error);
      return response(500, null, false, 'Internal Server Error').nextResponse;
    }
  }
}
