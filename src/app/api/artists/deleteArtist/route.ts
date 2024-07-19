// src/pages/api/deleteArtist.ts

import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import artist from '@/models/artist'; // Adjust path as needed

export async function DELETE(request: NextRequest) {
  await connect(); // Connect to the database

  // Extract labelId from query parameters
  const labelId = request.nextUrl.searchParams.get("labelId")

  try {
    // Validate labelId format
    if (!labelId || typeof labelId !== 'string') {
      return NextResponse.json({ message: 'Invalid labelId' }, { status: 400 });
    }

    // Attempt to delete artist by labelId
    const deletedartist = await artist.findByIdAndDelete(labelId);

    // Check if artist was found and deleted
    if (!deletedartist) {
      return NextResponse.json({ message: 'artist not found' }, { status: 404 });
    }

    // Return success message upon successful deletion
    return NextResponse.json({ message: 'artist deleted successfully' });
  } catch (error: any) {
    // Handle server errors
    console.error('Error deleting artist:', error);
    return NextResponse.json({ message: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
