import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Album from '@/models/albums'; // Ensure this path is correct
import Track from '@/models/track'; // Ensure this path is correct
import { connect } from '@/dbConfig/dbConfig'; // Ensure this path is correct

export async function GET() {
  try {
    // Connect to the database
    await connect();

    // Get the total number of albums
    const totalAlbums = await Album.countDocuments();

    // Get the total number of tracks
    const totalTracks = await Track.countDocuments();

    // Respond with the totals
    return NextResponse.json({ totalAlbums, totalTracks }, { status: 200 });
  } catch (error) {
    // Handle errors
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
