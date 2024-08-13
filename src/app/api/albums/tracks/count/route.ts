import Album from '@/models/albums'; 
import Track from '@/models/track';
import { connect } from '@/dbConfig/dbConfig'; 
import response from '@/lib/response';

export async function GET() {
  try {
    await connect();
    const totalAlbums = await Album.countDocuments();

    const totalTracks = await Track.countDocuments();

    return response(200, { totalAlbums, totalTracks }, true, 'Data fetched successfully').nextResponse;
  } catch (error) {
    console.error(error);
    return response(500, null, false, 'Internal Server Error').nextResponse;
  }
}
