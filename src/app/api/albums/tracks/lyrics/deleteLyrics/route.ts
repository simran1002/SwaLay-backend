import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig'; // Adjust path if necessary
import Lyric from '@/models/lyrics'; // Adjust path if necessary

export async function DELETE(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const { searchParams } = new URL(req.url);
    const trackid = searchParams.get('trackid'); // Get the 'trackid' query parameter

    if (!trackid) {
      return NextResponse.json({ error: 'Track ID is required' }, { status: 400 });
    }

    // Find and delete the lyric by ID
    const deletedLyric = await Lyric.findOneAndDelete({ Lyid: Number(trackid) }).exec();
    if (!deletedLyric) {
      return NextResponse.json({ error: 'Lyric not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Lyric deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting lyric:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
