import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';

export async function GET(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    // Extract the album ID from the query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Album ID is required' }, { status: 400 });
    }

    // Find the album by ID
    const album = await Album.findOne({ id: Number(id) });

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    return NextResponse.json({ album }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching album:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
