import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Track from '@/models/track';
import response from '@/lib/response'; // Import the response function

export async function DELETE(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Get the 'id' query parameter

    if (!id) {
      return response(400, null, false, 'Track ID is required').nextResponse;
    }

    // Find and delete the track by ID
    const deletedTrack = await Track.findByIdAndDelete(id).exec();
    if (!deletedTrack) {
      return response(404, null, false, 'Track not found').nextResponse;
    }

    return response(200, { message: 'Track deleted successfully' }, true, 'Track deleted successfully').nextResponse;
  } catch (error: any) {
    console.error('Error deleting track:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
