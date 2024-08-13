import Album from '@/models/albums'; 
import Track from '@/models/track';
import { connect } from '@/dbConfig/dbConfig'; 
import response from '@/lib/response';

export async function GET() {
  try {
    await connect();

    const totalAlbums = await Album.countDocuments();
    const totalTracks = await Track.countDocuments();
    const uniqueArtists = await Album.distinct('artist').then(artists => artists.length);

    return response(200, { totalAlbums, totalTracks, uniqueArtists }, true, 'Data fetched successfully').nextResponse;
  } catch (error) {
    console.error(error);
    return response(500, null, false, 'Internal Server Error').nextResponse;
  }
}
