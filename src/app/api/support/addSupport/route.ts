// src/app/api/support/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Support from '@/models/support';
import response from '@/lib/response'; 

export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();

    const { name, email, labelId, subject, message } = body;

    // Validate required fields
    if (!name || !email || !labelId || !subject || !message) {
      return response(400, null, false, 'All fields are required').nextResponse;
    }

    const newSupport = new Support({
      name,
      email,
      labelId,
      subject,
      message,
    });

    const savedSupport = await newSupport.save();

    return response(201, savedSupport, true, 'Support request created successfully').nextResponse;
  } catch (error: any) {
    console.error('Error creating support request:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
