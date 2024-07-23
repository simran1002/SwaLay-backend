// pages/api/tracks/index.ts
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Track from '@/models/track';

export async function POST(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const body = await req.json();
    const newTrack = new Track(body);
    const savedTrack = await newTrack.save();

    return NextResponse.json({ message: 'Track created successfully', track: savedTrack }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating track:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
