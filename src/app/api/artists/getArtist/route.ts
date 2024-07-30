import { connect } from '@/dbConfig/dbConfig';
import artist from '@/models/artist'; // Adjust path as needed
import { NextRequest } from 'next/server';
import response from '@/lib/response'; // Adjust the import path as needed

export async function GET(request: NextRequest) {
  await connect(); // Connect to the database

  try {
    const artistName = request.nextUrl.searchParams.get("artistName");
    console.log(artistName);

    if (!artistName) {
      // If artistName is not provided, fetch all artists
      const artists = await artist.find();
      return response(200, artists, true, 'All artists fetched successfully').nextResponse;
    } else {
      // If artistName is provided, find artist(s) by artistName
      const artists = await artist.find({ artistName: { $regex: new RegExp(artistName, 'i') } });

      if (artists.length === 0) {
        return response(404, null, false, 'No artists found for the specified artistName').nextResponse;
      }

      return response(200, artists, true, 'Artists found successfully').nextResponse;
    }
  } catch (error: any) {
    return response(500, null, false, error.message).nextResponse;
  }
}
