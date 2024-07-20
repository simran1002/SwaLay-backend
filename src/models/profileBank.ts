import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for the ProfileBankDetails document
interface IProfileBankDetails extends Document {
  labelId: mongoose.Schema.Types.ObjectId;
  accountHolderName: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string; 
  pan: string;
  gstNo: string;
}

// Schema definition
const ProfileBankDetailsSchema: Schema = new Schema({
  labelId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  accountHolderName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  bankName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  branchName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  accountNumber: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  ifscCode: { 
    type: String, 
    required: true, 
    trim: true 
  },
  upiId: { 
    type: String, 
    trim: true 
  },
  pan: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  gstNo: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  }
});

// Model creation
let ProfileBankDetails: Model<IProfileBankDetails>;

try {
  // Try to get the existing model
  ProfileBankDetails = mongoose.model<IProfileBankDetails>('ProfileBankDetails');
} catch {
  // If the model doesn't exist, create a new one
  ProfileBankDetails = mongoose.model<IProfileBankDetails>('ProfileBankDetails', ProfileBankDetailsSchema);
}

export default ProfileBankDetails;