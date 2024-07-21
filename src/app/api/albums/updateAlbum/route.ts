import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';

export async function PATCH(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Album ID is required' }, { status: 400 });
    }

    const body = await req.json();

    // Find the album by ID and update it
    const updatedAlbum = await Album.findOneAndUpdate({ id: Number(id) }, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAlbum) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Album updated successfully', album: updatedAlbum }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating album:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
