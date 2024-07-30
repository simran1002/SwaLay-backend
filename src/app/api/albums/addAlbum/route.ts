import { NextRequest } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import response from '@/lib/response'; // Import the response function

export async function POST(req: NextRequest) {
  try {
    await connect(); // Ensure the database connection

    const body = await req.json();
    const newAlbum = new Album(body);
    const savedAlbum = await newAlbum.save();

    // Use the response function to create a standardized response
    return response(201, { album: savedAlbum }, true, 'Album created successfully').nextResponse;
  } catch (error: any) {
    console.error('Error creating album:', error);
    // Use the response function for error handling
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
