import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import artist from '@/models/artist';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import response from '@/lib/response'; // Adjust the import path according to your directory structure

export async function PUT(req: NextRequest) {
  try {
    await connect();  // Connect to the database

    const labelId = req.nextUrl.searchParams.get("labelId"); // Assuming you're passing labelId as a query parameter
    const formData = await req.formData();
    
    const artistName = formData.get('artistName') as string;
    const iprs = formData.get('iprs') === 'true';
    const iprsNumber = formData.get('iprsNumber') ? Number(formData.get('iprsNumber')) : undefined;
    const facebook = formData.get('facebook') as string | undefined;
    const appleMusic = formData.get('appleMusic') as string | undefined;
    const spotify = formData.get('spotify') as string | undefined;
    const instagramUsername = formData.get('instagramUsername') as string | undefined;
    const profileImage = formData.get('profileImage') as File | null;

    // Validate required fields
    if (!artistName) {
      return response(400, null, false, 'Artist name is required').nextResponse;
    }

    // Validate iprsNumber if iprs is true
    if (iprs && !iprsNumber) {
      return response(400, null, false, 'IPRS number is required when IPRS is true').nextResponse;
    }

    // Find the artist to update
    const existingArtist = await artist.findById(labelId);

    if (!existingArtist) {
      return response(404, null, false, 'Artist not found').nextResponse;
    }

    // Update artist object
    existingArtist.artistName = artistName;
    existingArtist.iprs = iprs;
    existingArtist.iprsNumber = iprsNumber;
    existingArtist.facebook = facebook;
    existingArtist.appleMusic = appleMusic;
    existingArtist.spotify = spotify;
    existingArtist.instagramUsername = instagramUsername;

    // Handle profile image update
    if (profileImage) {
      const bytes = await profileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Ensure the uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        if (error instanceof Error && 'code' in error && error.code !== 'EEXIST') {
          throw error;
        }
        // If it's an EEXIST error, we can safely ignore it
      }

      // Save the file with a unique filename
      const filename = `${Date.now()}-${profileImage.name}`;
      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);

      // Update profile image path in the database
      existingArtist.profileImage = filename; // Store filename or filepath as per your needs
    }

    // Save the updated artist
    const updatedArtist = await existingArtist.save();

    return response(200, updatedArtist, true, 'Artist updated successfully').nextResponse;
  } catch (error: any) {
    console.error('Error updating artist:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
