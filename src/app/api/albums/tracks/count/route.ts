import Album from '@/models/albums'; // Ensure this path is correct
import Track from '@/models/track'; // Ensure this path is correct
import { connect } from '@/dbConfig/dbConfig'; // Ensure this path is correct
import response from '@/lib/response'; // Adjust the path according to your file structure

export async function GET() {
  try {
    // Connect to the database
    await connect();

    // Get the total number of albums
    const totalAlbums = await Album.countDocuments();

    // Get the total number of tracks
    const totalTracks = await Track.countDocuments();

    // Respond with the totals using the response function
    return response(200, { totalAlbums, totalTracks }, true, 'Data fetched successfully').nextResponse;
  } catch (error) {
    // Handle errors using the response function
    console.error(error);
    return response(500, null, false, 'Internal Server Error').nextResponse;
  }
}
