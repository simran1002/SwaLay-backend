import { NextRequest } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import artist from '@/models/artist'; // Adjust path as needed
import { response } from '@/lib/response'; // Adjust path as needed

export async function DELETE(request: NextRequest) {
  await connect(); // Connect to the database

  // Extract labelId from query parameters
  const labelId = request.nextUrl.searchParams.get("labelId");

  // Validate labelId format
  if (!labelId || typeof labelId !== 'string') {
    return response(400, null, false, 'Invalid labelId').nextResponse;
  }

  try {
    // Attempt to delete artist by labelId
    const deletedArtist = await artist.findByIdAndDelete(labelId);

    // Check if artist was found and deleted
    if (!deletedArtist) {
      return response(404, null, false, 'Artist not found').nextResponse;
    }

    // Return success message upon successful deletion
    return response(200, { deletedArtist }, true, 'Artist deleted successfully').nextResponse;
  } catch (error: any) {
    // Handle server errors
    console.error('Error deleting artist:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
