// src/pages/api/albums/download.ts

import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Album,{AlbumStatus} from '@/models/albums'; 
import XLSX from 'xlsx';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Fetch all albums from the database
        const albums = await Album.find().lean();

        // Map the album data into a format suitable for Excel
        const data = albums.map(album => ({
            Title: album.title || '',
            Thumbnail: album.thumbnail || '',
            Language: album.language || '',
            Genre: album.genre || '',
            ReleaseDate: album.releasedate ? album.releasedate.toISOString().split('T')[0] : '',
            TotalTracks: album.totalTracks || 0,
            UPC: album.upc || '',
            Artist: album.artist || '',
            Cline: album.cline || '',
            Pline: album.pline || '',
            Status: AlbumStatus[album.status],
            Tags: album.tags || '',
            SpotifyLink: album.platformLinks?.SpotifyLink || '',
            AppleLink: album.platformLinks?.AppleLink || '',
            Instagram: album.platformLinks?.Instagram || '',
            Facebook: album.platformLinks?.Facebook || '',
            Comment: album.comment || '',
            Image: album.image || '',
        }));

        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Albums');

        // Generate a buffer for the Excel file
        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set the response headers to initiate a download
        res.setHeader('Content-Disposition', 'attachment; filename="albums.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Send the Excel file as a response
        res.status(200).send(excelBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to download albums data.' });
    }
}
