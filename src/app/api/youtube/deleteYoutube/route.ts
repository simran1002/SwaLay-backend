import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import mongoose from 'mongoose';
import Youtube from '../../../../models/youtube'; // adjust the path as necessary
import response, { ResponseType } from '@/lib/response'; // adjust the path as necessary

export async function DELETE(req: NextRequest) {
    try {
        await connect(); // Connect to the database

        // Extract the id from the query parameters
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return response(400, null, false, 'ID is required').nextResponse;
        }

        // Delete the Youtube entry
        const deletedYoutube = await Youtube.findOneAndDelete({ id: Number(id) });

        if (!deletedYoutube) {
            return response(404, null, false, 'Youtube copyright entry not found').nextResponse;
        }

        return response(200, null, true, 'Youtube copyright entry deleted').nextResponse;
    } catch (error: any) {
        console.error('Internal server error:', error);
        return response(500, error.message || 'Internal server error', false, 'Internal server error').nextResponse;
    } finally {
        mongoose.connection.close();
    }
}
