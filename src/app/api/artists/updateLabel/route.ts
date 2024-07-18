// src/app/api/updateLabel.ts

import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Label from '@/models/label';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function PUT(req: NextRequest) {
  try {
    await connect();  // Connect to the database

    const labelId = req.nextUrl.searchParams.get("labelId")// Assuming you're passing labelId as a query parameter
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
      return NextResponse.json({ error: 'Artist name is required', success: false }, { status: 400 });
    }

    // Validate iprsNumber if iprs is true
    if (iprs && !iprsNumber) {
      return NextResponse.json({ error: 'IPRS number is required when IPRS is true', success: false }, { status: 400 });
    }

    // Find the label to update
    const existingLabel = await Label.findById(labelId);

    if (!existingLabel) {
      return NextResponse.json({ error: 'Label not found', success: false }, { status: 404 });
    }

    // Update label object
    existingLabel.artistName = artistName;
    existingLabel.iprs = iprs;
    existingLabel.iprsNumber = iprsNumber;
    existingLabel.facebook = facebook;
    existingLabel.appleMusic = appleMusic;
    existingLabel.spotify = spotify;
    existingLabel.instagramUsername = instagramUsername;

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
      existingLabel.profileImage = filename; // Store filename or filepath as per your needs
    }

    // Save the updated label
    const updatedLabel = await existingLabel.save();

    return NextResponse.json({ message: 'Label updated successfully', label: updatedLabel, success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating label:', error);
    return NextResponse.json({
      error: error.message || 'An unknown error occurred',
      success: false,
      status: 500
    }, { status: 500 });
  }
}
