import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Youtube from '../../../../models/youtube'; 
import { response } from '@/lib/response';

export async function PUT(req: NextRequest) {
  try {
    await connect();

    const id = req.nextUrl.searchParams.get('id');
    if (!id || isNaN(Number(id))) {
      return response(400, null, false, 'Valid ID is required').nextResponse;
    }

    // Parse the request body
    const body = await req.json();
    const { status } = body;

    if (typeof status !== 'boolean') {
      return response(400, null, false, 'Valid status is required').nextResponse;
    }

    // Update the Youtube entry status
    const updatedYoutube = await Youtube.findOneAndUpdate(
      { id: Number(id) },
      { status },
      { new: true }
    );

    if (!updatedYoutube) {
      return response(404, null, false, 'YouTube entry not found').nextResponse;
    }

    return response(200, updatedYoutube, true, 'YouTube entry status updated').nextResponse;
  } catch (error) {
    console.error('Internal server error:', error);
    return response(500, error, false, 'Internal server error').nextResponse;
  }
}
