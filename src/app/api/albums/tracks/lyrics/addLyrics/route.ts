// pages/api/lyrics/index.ts
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Lyric from '@/models/lyrics';

export async function POST(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const body = await req.json();
    const newLyric = new Lyric(body);
    const savedLyric = await newLyric.save();

    return NextResponse.json({ message: 'Lyric created successfully', lyric: savedLyric }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lyric:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
