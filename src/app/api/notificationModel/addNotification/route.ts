// src/app/api/notifications/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Notification from '@/models/notificationModel';
import response from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    await connect(); 

    const body = await req.json();
    const { labelId, type, status, time, notification, link } = body;

    if (!type || !status || !time || !notification) {
      return response(400, null, false, 'Missing required fields').nextResponse;
    }

    const newNotification = new Notification({
      labelId,
      type,
      status,
      time,
      notification,
      link,
    });

    const savedNotification = await newNotification.save();

    return response(201, savedNotification, true, 'Notification created successfully').nextResponse;
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
