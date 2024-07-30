import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig'; // Adjust the path according to your file structure
import Lyric from '@/models/lyrics'; // Adjust the path according to your file structure
import { response } from '@/lib/response'; // Adjust the path according to your file structure

export async function GET(req: NextRequest) {
  try {
    await connect();

    const url = new URL(req.url);
    const trackid = url.searchParams.get('trackid'); // Get the 'trackid' query parameter

    if (!trackid) {
      return response(400, null, false, 'Track ID is required').nextResponse;
    }

    const lyric = await Lyric.findOne({ Lyid: Number(trackid) }).exec();
    if (!lyric) {
      return response(404, null, false, 'Lyric not found').nextResponse;
    }

    return response(200, lyric, true, 'Lyric fetched successfully').nextResponse;
  } catch (error) {
    return response(500, null, false, (error as Error).message).nextResponse;
  }
}
