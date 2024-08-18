// src/app/api/notifications/[id]/route.ts

import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Notification from '@/models/notificationModel';
import response from '@/lib/response';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connect();

    const { id } = params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return response(400, null, false, 'Valid Notification ID is required').nextResponse;
    }

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return response(404, null, false, 'Notification not found').nextResponse;
    }

    return response(200, deletedNotification, true, 'Notification deleted successfully').nextResponse;
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    return response(500, null, false, error.message || 'An unknown error occurred').nextResponse;
  }
}
