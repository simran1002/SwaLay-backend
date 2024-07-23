// pages/api/tracks/[id].ts
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Track from '@/models/track';

export async function DELETE(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Get the 'id' query parameter

    if (!id) {
      return NextResponse.json({ error: 'Track ID is required' }, { status: 400 });
    }

    // Find and delete the track by ID
    const deletedTrack = await Track.findByIdAndDelete(id).exec();
    if (!deletedTrack) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Track deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting track:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
