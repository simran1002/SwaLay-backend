import mongoose, { Document, Schema } from 'mongoose';

export enum NotificationType {
  INFO = 'Info',
  WARNING = 'Warning',
  ERROR = 'Error',
  SUCCESS = 'Success',
}

export enum NotificationStatus {
  UNREAD = 'Unread',
  READ = 'Read',
  DISMISSED = 'Dismissed',
}

interface INotification extends Document {
  labelId?: string; 
  type: NotificationType; 
  status: NotificationStatus;
  time: Date;            
  notification: string;      
  link?: string;         
}

const NotificationSchema: Schema = new Schema({
  labelId: { type: String, required: false }, 
  type: { 
    type: String, 
    enum: Object.values(NotificationType), 
    required: true 
  },
  status: { 
    type: String, 
    enum: Object.values(NotificationStatus), 
    required: true 
  },
  time: { type: Date, required: true },  
  notification: { type: String, required: true }, 
  link: { type: String, required: false }    
});


const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
export type { INotification }; 
