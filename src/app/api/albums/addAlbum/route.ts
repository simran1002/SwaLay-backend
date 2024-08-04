import { NextRequest } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import response from '@/lib/response'; // Import the response function
import { uploadFileToS3 } from '@/lib/s3'; // Import the S3 upload function

export async function POST(req: NextRequest) {
  try {
    await connect(); // Ensure the database connection

    const body = await req.json();
    const { image, ...albumData } = body;

    let imageUrl = null;

    // Upload image to S3 if provided
    if (image) {
      const imageBuffer = Buffer.from(image, 'base64'); // Assuming image is sent as base64
      imageUrl = await uploadFileToS3(imageBuffer, 'album-image');
    }

    const newAlbum = new Album({
      ...albumData,
      image: imageUrl,
    });

    const savedAlbum = await newAlbum.save();

    // Use the response function to create a standardized response
    return response(201, { album: savedAlbum }, true, 'Album created successfully').nextResponse;
  } catch (error: any) {
    console.error('Error creating album:', error);
    // Use the response function for error handling
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
