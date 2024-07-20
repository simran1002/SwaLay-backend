import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import mongoose from 'mongoose';
import Youtube from '../../../../models/youtube'; // adjust the path as necessary

export async function PUT(req: NextRequest) {
  try {
    await connect();

    // Extract the id from the query parameters
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    // Parse the request body
    const body = await req.json();
    const { status } = body;

    // Update the Youtube entry status
    const updatedYoutube = await Youtube.findOneAndUpdate(
      { id: Number(id) },
      { status },
      { new: true }
    );

    if (!updatedYoutube) {
      return NextResponse.json({ message: 'Youtube copyright entry not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Youtube copyright entry status updated', data: updatedYoutube }, { status: 200 });
  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  } finally {
    mongoose.connection.close();
  }
}
