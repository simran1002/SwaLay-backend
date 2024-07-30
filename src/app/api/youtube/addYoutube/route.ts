import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import mongoose from 'mongoose';
import Youtube from '../../../../models/youtube'; // adjust the path as necessary
import response from '@/lib/response'; // adjust the path as necessary

export async function POST(req: NextRequest) {
    try {
        await connect();

        const body = await req.json();
        const { id, albumId, trackId, link, title, status, comment } = body;

        const newYoutube = new Youtube({
            id,
            albumId,
            trackId,
            link,
            title,
            status,
            comment
        });

        await newYoutube.save();

        // Use the standardized response function
        return response(201, newYoutube, true, 'Youtube copyright entry created').nextResponse;
    } catch (error: unknown) {
        console.error('Internal server error:', error);
        
        // Handle error type
        const errorMessage = (error instanceof Error) ? error.message : 'An unexpected error occurred';
        
        // Use the standardized response function
        return response(500, errorMessage, false, 'Internal server error').nextResponse;
    } finally {
        mongoose.connection.close();
    }
}
