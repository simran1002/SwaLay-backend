// pages/api/lyrics/[trackid].ts
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';  // Adjust the import path according to your file structure
import Lyric from '@/models/lyrics';  // Adjust the import path according to your file structure

export async function PUT(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const { searchParams } = new URL(req.url);
    const trackid = searchParams.get('trackid');

    if (!trackid) {
      return NextResponse.json({ error: 'Track ID is required' }, { status: 400 });
    }

    const body = await req.json();

    // Find the lyric by ID and update it
    const updatedLyric = await Lyric.findOneAndUpdate(
      { Lyid: Number(trackid) },
      body,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedLyric) {
      return NextResponse.json({ error: 'Lyric not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Lyric updated successfully', lyric: updatedLyric }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating lyric:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
