import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import mongoose from 'mongoose';
import Youtube from '../../../../models/youtube'; // adjust the path as necessary

export async function DELETE(req: NextRequest) {
    try {
        await connect(); // Connect to the database

        // Extract the id from the query parameters
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }

        // Delete the Youtube entry
        const deletedYoutube = await Youtube.findOneAndDelete({ id: Number(id) });

        if (!deletedYoutube) {
            return NextResponse.json({ message: 'Youtube copyright entry not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Youtube copyright entry deleted' }, { status: 200 });
    } catch (error) {
        console.error('Internal server error:', error);
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    } finally {
        mongoose.connection.close();
    }
}
