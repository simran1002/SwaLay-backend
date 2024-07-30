import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';  // Adjust the import path according to your file structure
import Lyric from '@/models/lyrics';  // Adjust the import path according to your file structure
import response, { ResponseType } from '@/lib/response'; // Adjust the import path according to your file structure

export async function PUT(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const { searchParams } = new URL(req.url);
    const trackid = searchParams.get('trackid');

    if (!trackid) {
      return response(400, null, false, 'Track ID is required').nextResponse;
    }

    const body = await req.json();

    // Find the lyric by ID and update it
    const updatedLyric = await Lyric.findOneAndUpdate(
      { Lyid: Number(trackid) },
      body,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedLyric) {
      return response(404, null, false, 'Lyric not found').nextResponse;
    }

    return response(200, updatedLyric, true, 'Lyric updated successfully').nextResponse;
  } catch (error: any) {
    console.error('Error updating lyric:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
