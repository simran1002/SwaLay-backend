import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the User document
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode?: string | null; // Make verifyCode nullable
    verifyCodeExpiry?: Date | null;
    isVerified: boolean;
    isLable: boolean;
    lable?: string | null;
    joinedAt: Date;
    subscriptionEndDate: Date;
}

// Define the schema for the User collection
const UserSchema: Schema<IUser> = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
    },
    verifyCode: {
        type: String,
        default: null // or omit default if null is intended
    },
    verifyCodeExpiry: {
        type: Date,
        default: null // or omit default if null is intended
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isLable: {
        type: Boolean,
        default: false
    },
    lable: {
        type: String,
        default: null
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    subscriptionEndDate: {
        type: Date,
        default: Date.now
    }
});

// Create the model for the User collection
const User = mongoose.models.Users as mongoose.Model<IUser> || mongoose.model<IUser>("Users", UserSchema);

export default User;