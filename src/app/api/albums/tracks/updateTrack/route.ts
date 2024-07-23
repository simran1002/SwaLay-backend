// pages/api/tracks/[id].ts
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Track from '@/models/track';

export async function PUT(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Track ID is required' }, { status: 400 });
    }

    const body = await req.json();

    // Find the track by ID and update it
    const updatedTrack = await Track.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedTrack) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Track updated successfully', track: updatedTrack }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating track:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
