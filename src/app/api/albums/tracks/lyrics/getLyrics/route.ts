import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig'; // Adjust the path according to your file structure
import Lyric from '@/models/lyrics'; // Adjust the path according to your file structure

export async function GET(req: NextRequest) {
  try {
    await connect();

    const url = new URL(req.url);
    const trackid = url.searchParams.get('trackid'); // Get the 'trackid' query parameter

    if (!trackid) {
      return NextResponse.json({ message: 'Track ID is required' }, { status: 400 });
    }

    const lyric = await Lyric.findOne({ Lyid: Number(trackid) }).exec();
    if (!lyric) {
      return NextResponse.json({ message: 'Lyric not found' }, { status: 404 });
    }
    return NextResponse.json(lyric, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
