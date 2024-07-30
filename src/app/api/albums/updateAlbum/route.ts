import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import { response } from '@/lib/response'; // Adjust the import path as needed

export async function PATCH(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return response(400, null, false, 'Album ID is required').nextResponse;
    }

    const body = await req.json();

    // Find the album by ID and update it
    const updatedAlbum = await Album.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAlbum) {
      return response(404, null, false, 'Album not found').nextResponse;
    }

    return response(200, updatedAlbum, true, 'Album updated successfully').nextResponse;
  } catch (error: any) {
    console.error('Error updating album:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
