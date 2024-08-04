// pages/api/track.ts
import { NextRequest } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Track from '@/models/track';
import response from '@/lib/response'; // Adjust import path as needed
import { uploadFileToS3 } from '@/lib/s3'; // Ensure the path is correct

export async function POST(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const body = await req.json();
    const { musicFile, musicFileWav, ...trackData } = body;

    let musicFileUrl = null;
    let musicFileWavUrl = null;

    // Upload music files to S3 if provided
    if (musicFile) {
      const musicFileBuffer = Buffer.from(musicFile, 'base64'); // Assuming file is sent as base64
      musicFileUrl = await uploadFileToS3(musicFileBuffer, 'music-file');
    }

    if (musicFileWav) {
      const musicFileWavBuffer = Buffer.from(musicFileWav, 'base64'); // Assuming file is sent as base64
      musicFileWavUrl = await uploadFileToS3(musicFileWavBuffer, 'music-file-wav');
    }

    const newTrack = new Track({
      ...trackData,
      musicFile: musicFileUrl,
      musicFileWav: musicFileWavUrl,
    });
    const savedTrack = await newTrack.save();

    // Use the response function to standardize the response
    return response(201, { track: savedTrack }, true, 'Track created successfully').nextResponse;
  } catch (error: any) {
    console.error('Error creating track:', error);
    // Use the response function to handle errors
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
