// src/app/api/support/[id]/route.ts

import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Support from '@/models/support';
import response from '@/lib/response';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connect();

    const { id } = params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return response(400, null, false, 'Valid Support ID is required').nextResponse;
    }

    const deletedSupport = await Support.findByIdAndDelete(id);

    if (!deletedSupport) {
      return response(404, null, false, 'Support request not found').nextResponse;
    }

    return response(200, deletedSupport, true, 'Support request deleted successfully').nextResponse;
  } catch (error: any) {
    console.error('Error deleting support request:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
