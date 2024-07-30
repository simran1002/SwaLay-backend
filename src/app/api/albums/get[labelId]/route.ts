import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';

export async function GET(req: NextRequest) {
  try {
    await connect(); 

   
    const labelId = req.nextUrl.searchParams.get('labelId');

    if (!labelId) {
      return NextResponse.json({ message: 'Label ID is required' }, { status: 400 });
    }

    const labelObjectId = new mongoose.Types.ObjectId(labelId);

    const albums = await Album.find({ labelId: labelObjectId });

    if (!albums.length) {
      return NextResponse.json({ message: 'No albums found for this label' }, { status: 404 });
    }

    return NextResponse.json({ albums }, { status: 200 });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}
