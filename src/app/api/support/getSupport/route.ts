// src/app/api/support/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Support from '@/models/support';
import response from '@/lib/response'; 

export async function GET(req: NextRequest) {
  try {
    await connect(); 

    const supportRequests = await Support.find();

    return response(200, supportRequests, true, 'Support requests retrieved successfully').nextResponse;
  } catch (error: any) {
    console.error('Error fetching support requests:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
