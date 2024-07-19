import { connect } from '@/dbConfig/dbConfig';
import Label, { ILabel } from '@/models/artist'; // Adjust path as needed
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  await connect(); // Connect to the database

  try {
    
    const artistName = request.nextUrl.searchParams.get("artistName")
    console.log(artistName);
   


    if (!artistName) {
      // If artistName is not provided, fetch all labels
      const labels = await Label.find();
      return NextResponse.json({ data: labels, message: 'All Labels fetched successfully', success: true });
    } else {
      // If artistName is provided, find label(s) by artistName
      const labels = await Label.find({ artistName: { $regex: new RegExp(artistName, 'i') } });

      if (labels.length === 0) {
        return NextResponse.json({ status: 404, message: 'No labels found for the specified artistName', success: false });
      }

      return NextResponse.json({ data: labels, message: 'Labels found successfully', success: true });
    }
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message, success: false });
  }
}
