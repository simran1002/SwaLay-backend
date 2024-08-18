// src/app/api/notifications/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Notification from '@/models/notificationModel';
import response from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    await connect(); 

    const notifications = await Notification.find(); 

    return response(200, notifications, true, 'Notifications retrieved successfully').nextResponse;
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
