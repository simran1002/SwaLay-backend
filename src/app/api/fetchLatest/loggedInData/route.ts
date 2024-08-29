import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import Artist from '@/models/oldArtists';
import Track from '@/models/tracks';
import response from '@/lib/response';

export async function POST(req: Request) {
  try {
    await connect();

    const requestBody = await req.json();

    const apiResponse = await fetch('http://pdl.gaonaweb.com/v2.0/album/add/meta', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTkyNDM0NDBiYmUxMDE2MjIwYjAzYjUzIiwic2NvcGUiOlsiQWRtaW4iLCJQZGxUZWFtIiwiRHVwbGljYXRlVXBsb2FkZXIiLCJTdGF0cyIsIlVwZGF0ZUFsYnVtIiwiTGVnYWN5VXBsb2FkZXIiLCJBbnlEdXJhdGlvbiIsIkRlbGV0ZUxhYmVsIiwiUmlnaHRzTWFuYWdlciIsIkFkdmFuY2VNZXRhZGF0YSIsIkxvZ3MiXSwiZXh0cmEiOnt9LCJleHAiOjE3NDk0Njc4NDksImlhdCI6MTcxODM2Mzg0OSwiaXNzIjoiVFNNIiwic3ViIjoiNTkyNDM0NDBiYmUxMDE2MjIwYjAzYjUzIn0.MWrDgWutyB7lrpmbH3ki6gF5OmdUGkaZofBHftYIrZvet0RgQYY11o0t5GHbG3UVNVWJuD9w1l5soxOI5oM3Z3YIfbf2l4qGaUp3Xr_Wz0WZnbjykeXwvTJvq7BZlerRPAisS_vCrqpRKW-29Nhji1LLZJRKwY3bp4mdX1GPrAD0EeHtgbWs8kM9_rzZgm2LDupSZhYuWIUa1XMBJHyUXI3PaMlAlhsVTGJ7WCXvWx5MpPb2ZF7eMuiiYSwqJlMmhOJyxt8TTfZvQpV5IBTH45ol_rVtUOx-TO3Wqp1rw9CLzfrrxpyVwn3ItSkH3VR3_zAZS4-3ujpO9A9HjONApA',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': 'http://localhost:9000',
        'Referer': 'http://localhost:9000/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(requestBody),
    });

    const apiResponseData = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(apiResponseData, { status: apiResponse.status });
    }

    const { labelId } = requestBody;

    if (!labelId) {
      return response(400, null, false, 'Label ID is required').nextResponse;
    }

    const labelObjectId = new mongoose.Types.ObjectId(labelId);

    const albums = await Album.find({ labelId: labelObjectId }).select('_id title artist thumbnail genre releasedate status totalTracks tags comment');

    if (!albums.length) {
      return response(404, null, false, 'No albums found for this label').nextResponse;
    }

    const albumData = await Promise.all(
      albums.map(async (album) => {
        const artistDetails = album.artist ? await Artist.findById(album.artist).select('artistName profileImage isSinger isLyricist isComposer isProducer') : null;

        const tracks = await Track.find({ albumId: album._id });

        return {
          albumId: album._id,
          title: album.title,
          thumbnail: album.thumbnail,
          genre: album.genre,
          releaseDate: album.releasedate,
          status: album.status,
          totalTracks: album.totalTracks,
          tags: album.tags,
          comment: album.comment,
          artist: artistDetails ? {
            id: artistDetails._id,
            name: artistDetails.artistName,
            profileImage: artistDetails.profileImage,
            isSinger: artistDetails.isSinger,
            isLyricist: artistDetails.isLyricist,
            isComposer: artistDetails.isComposer,
            isProducer: artistDetails.isProducer,
          } : null,
          tracks: tracks.map(track => ({
            trackId: track._id,
            songName: track.songName,
            primarySinger: track.primarySinger,
            singers: track.singers,
            composers: track.composers,
            lyricists: track.lyricists,
            producers: track.producers,
            audioFile: track.audioFile,
            audioFileWav: track.audioFileWav,
            isrc: track.isrc,
            duration: track.duration,
            crbt: track.crbt,
            platformLinks: track.platformLinks,
            category: track.category,
            version: track.version,
            trackType: track.trackType,
            trackOrderNumber: track.trackOrderNumber,
          })),
        };
      })
    );

    const combinedResponse = {
      apiResponseData,
      albumData,
    };

    return NextResponse.json(combinedResponse);
  } catch (error: any) {
    console.error('Internal Server Error:', error.message);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
