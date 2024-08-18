// src/app/api/notifications/[id]/route.ts

import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Notification from '@/models/notificationModel';
import response from '@/lib/response';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connect();

    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return response(400, null, false, 'Valid Notification ID is required').nextResponse;
    }

    if (!status) {
      return response(400, null, false, 'Status is required').nextResponse;
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedNotification) {
      return response(404, null, false, 'Notification not found').nextResponse;
    }

    return response(200, updatedNotification, true, 'Notification status updated successfully').nextResponse;
  } catch (error: any) {
    console.error('Error updating notification:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
