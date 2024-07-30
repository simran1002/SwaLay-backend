import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig'; // Adjust path if necessary
import Lyric from '@/models/lyrics'; // Adjust path if necessary
import { response } from '@/lib/response'; // Adjust path if necessary

export async function DELETE(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const { searchParams } = new URL(req.url);
    const trackid = searchParams.get('trackid'); // Get the 'trackid' query parameter

    if (!trackid) {
      return response(400, null, false, 'Track ID is required').nextResponse;
    }

    // Find and delete the lyric by ID
    const deletedLyric = await Lyric.findOneAndDelete({ Lyid: Number(trackid) }).exec();
    if (!deletedLyric) {
      return response(404, null, false, 'Lyric not found').nextResponse;
    }

    return response(200, { message: 'Lyric deleted successfully' }, true, 'Lyric deleted successfully').nextResponse;
  } catch (error: any) {
    console.error('Error deleting lyric:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
