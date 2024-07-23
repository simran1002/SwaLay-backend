// pages/api/tracks/[id].ts
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Track from '@/models/track';

export async function GET(req: NextRequest) {
  try {
    await connect();

    const url = new URL(req.url);
    const id = url.searchParams.get('id'); // Get the 'id' query parameter

    if (!id) {
      return NextResponse.json({ message: 'Track ID is required' }, { status: 400 });
    }

    const track = await Track.findById(id).exec();
    if (!track) {
      return NextResponse.json({ message: 'Track not found' }, { status: 404 });
    }
    return NextResponse.json(track, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
