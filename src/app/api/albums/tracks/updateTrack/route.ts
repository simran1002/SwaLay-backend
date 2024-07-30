import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Track from '@/models/track';
import response from '@/lib/response'; // Adjust the import path as needed

export async function PUT(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return response(400, null, false, 'Track ID is required').nextResponse;
    }

    const body = await req.json();

    // Find the track by ID and update it
    const updatedTrack = await Track.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedTrack) {
      return response(404, null, false, 'Track not found').nextResponse;
    }

    return response(200, { track: updatedTrack }, true, 'Track updated successfully').nextResponse;
  } catch (error: any) {
    console.error('Error updating track:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
