import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import mongoose from 'mongoose';
import Youtube from '../../../../models/youtube'; // adjust the path as necessary

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

        return NextResponse.json({ message: 'Youtube copyright entry created', data: newYoutube }, { status: 201 });
    } catch (error) {
        console.error('Internal server error:', error);
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    } finally {
        mongoose.connection.close();
    }
}
