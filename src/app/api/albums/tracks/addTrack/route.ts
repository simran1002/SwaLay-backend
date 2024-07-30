import { NextRequest } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Track from '@/models/track';
import response from '@/lib/response'; // Adjust import path as needed

export async function POST(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const body = await req.json();
    const newTrack = new Track(body);
    const savedTrack = await newTrack.save();

    // Use the response function to standardize the response
    return response(201, { track: savedTrack }, true, 'Track created successfully').nextResponse;
  } catch (error: any) {
    console.error('Error creating track:', error);
    // Use the response function to handle errors
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
