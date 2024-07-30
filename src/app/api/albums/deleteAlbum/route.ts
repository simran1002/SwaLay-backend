import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import response from '@/lib/response'; // Adjust the import path as needed

export async function DELETE(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return response(400, null, false, 'Album ID is required').nextResponse;
    }

    // Find and delete the album by ID
    const deletedAlbum = await Album.findByIdAndDelete(id);

    if (!deletedAlbum) {
      return response(404, null, false, 'Album not found').nextResponse;
    }

    return response(200, null, true, 'Album deleted successfully').nextResponse;
  } catch (error: any) {
    console.error('Error deleting album:', error);
    return response(500, error.message || 'An unknown error occurred', false, 'Internal Server Error').nextResponse;
  }
}
