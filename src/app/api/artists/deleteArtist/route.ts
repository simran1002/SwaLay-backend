// src/pages/api/deleteLabel.ts

import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Label from '@/models/artist'; // Adjust path as needed

export async function DELETE(request: NextRequest) {
  await connect(); // Connect to the database

  // Extract labelId from query parameters
  const labelId = request.nextUrl.searchParams.get("labelId")

  try {
    // Validate labelId format
    if (!labelId || typeof labelId !== 'string') {
      return NextResponse.json({ message: 'Invalid labelId' }, { status: 400 });
    }

    // Attempt to delete label by labelId
    const deletedLabel = await Label.findByIdAndDelete(labelId);

    // Check if label was found and deleted
    if (!deletedLabel) {
      return NextResponse.json({ message: 'Label not found' }, { status: 404 });
    }

    // Return success message upon successful deletion
    return NextResponse.json({ message: 'Label deleted successfully' });
  } catch (error: any) {
    // Handle server errors
    console.error('Error deleting label:', error);
    return NextResponse.json({ message: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
