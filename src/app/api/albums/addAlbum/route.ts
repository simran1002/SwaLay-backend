import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';

export async function POST(req: NextRequest) {
  try {
    connect();
    const body = await req.json();
    const newAlbum = new Album(body);
    const savedAlbum = await newAlbum.save();
    return NextResponse.json({ message: 'Album created successfully', album: savedAlbum }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating album:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
  







}
