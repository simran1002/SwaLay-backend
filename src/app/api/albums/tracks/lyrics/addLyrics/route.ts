import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Lyric from '@/models/lyrics';
import response, { ResponseType } from '@/lib/response'; // Adjust the import path as needed

export async function POST(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const body = await req.json();
    const newLyric = new Lyric(body);
    const savedLyric = await newLyric.save();

    // Create a successful response using the standardized response function
    const successResponse: ResponseType = {
      status: 201,
      data: savedLyric,
      success: true,
      message: 'Lyric created successfully'
    };

    return response(201, savedLyric, true, 'Lyric created successfully').nextResponse;
  } catch (error: any) {
    console.error('Error creating lyric:', error);

    // Create an error response using the standardized response function
    const errorResponse: ResponseType = {
      status: 500,
      data: null,
      success: false,
      message: error.message || 'An unknown error occurred'
    };

    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
