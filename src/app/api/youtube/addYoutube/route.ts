import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import mongoose from 'mongoose';
import axios from 'axios';
import Youtube from '../../../../models/youtube'; 
import response from '@/lib/response'; 


const youtubeUrlRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

const extractVideoId = (url: string) => {
  const match = url.match(/(?<=v=)[a-zA-Z0-9-]+(?=&)|(?<=v\/)[^&\n]+(?=\?)|(?<=v=)[^&\n]+|(?<=youtu.be\/)[^&\n]+/);
  return match ? match[0] : '';
};

export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();
    const { id, albumId, trackId, link, title, status, comment } = body;

    if (!youtubeUrlRegex.test(link)) {
      return response(400, null, false, 'Invalid YouTube link').nextResponse;
    }

    const videoId = extractVideoId(link);

    if (!videoId) {
      return response(400, null, false, 'Invalid YouTube link provided').nextResponse;
    }

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

    const data = {
      release: [
        {
          type: 'video',
          id: videoId,
        }
      ]
    };

 
    const apiResponse = await axios.post('https://swadigi.sourceaudio.com/api/contentid/releaseClaim', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 8945-02225d7a191f7b5bc0bf82de1c8e706d'
      }
    });

    
    return response(201, { newYoutube, apiResponse: apiResponse.data }, true, 'YouTube copyright entry created and API call successful').nextResponse;
  } catch (error: unknown) {
    console.error('Internal server error:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'An unexpected error occurred';
    return response(500, errorMessage, false, 'Internal server error').nextResponse;
  } finally {
    mongoose.connection.close();
  }
}
