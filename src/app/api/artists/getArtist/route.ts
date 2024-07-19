import { connect } from '@/dbConfig/dbConfig';
import artist, { Iartist } from '@/models/artist'; // Adjust path as needed
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  await connect(); // Connect to the database

  try {
    
    const artistName = request.nextUrl.searchParams.get("artistName")
    console.log(artistName);
   


    if (!artistName) {
      // If artistName is not provided, fetch all artists
      const artists = await artist.find();
      return NextResponse.json({ data: artists, message: 'All artists fetched successfully', success: true });
    } else {
      // If artistName is provided, find artist(s) by artistName
      const artists = await artist.find({ artistName: { $regex: new RegExp(artistName, 'i') } });

      if (artists.length === 0) {
        return NextResponse.json({ status: 404, message: 'No artists found for the specified artistName', success: false });
      }

      return NextResponse.json({ data: artists, message: 'artists found successfully', success: true });
    }
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message, success: false });
  }
}
