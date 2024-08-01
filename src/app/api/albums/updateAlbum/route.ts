import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Album, { AlbumStatus } from '@/models/albums';
import { response } from '@/lib/response'; 

export async function PATCH(req: NextRequest) {
  try {
    await connect(); 

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return response(400, null, false, 'Album ID is required').nextResponse;
    }

    const body = await req.json();

    if (body.status !== undefined && !Object.values(AlbumStatus).includes(body.status)) {
      return response(400, null, false, 'Invalid status value').nextResponse;
    }

    if (body.status === AlbumStatus.Rejected && !body.comment) {
      return response(400, null, false, 'Comment is required when rejecting an album').nextResponse;
    }

    if (body.photoUrl && typeof body.photoUrl !== 'string') {
      return response(400, null, false, 'Invalid photo URL').nextResponse;
    }

    const updateFields = { ...body };
    if (body.photoUrl) {
      updateFields.thumbnail = body.photoUrl;
      delete updateFields.photoUrl;
    }

    const updatedAlbum = await Album.findByIdAndUpdate(id, updateFields, {
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
