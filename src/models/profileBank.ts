// src/models/profileBank.ts
import mongoose, { Document, Schema, Model } from 'mongoose';
import { encrypt, decrypt } from '@/lib/cryptoUtils';

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

// Pre-save hook to encrypt sensitive fields
ProfileBankDetailsSchema.pre<IProfileBankDetails>('save', function(next) {
  if (this.isModified('accountNumber')) {
    this.accountNumber = encrypt(this.accountNumber);
  }
  if (this.isModified('ifscCode')) {
    this.ifscCode = encrypt(this.ifscCode);
  }
  if (this.isModified('upiId')) {
    this.upiId = encrypt(this.upiId);
  }
  if (this.isModified('pan')) {
    this.pan = encrypt(this.pan);
  }
  if (this.isModified('gstNo')) {
    this.gstNo = encrypt(this.gstNo);
  }
  next();
});

// Post-find hook to decrypt sensitive fields
ProfileBankDetailsSchema.post<IProfileBankDetails>('findOne', function(doc: IProfileBankDetails | null) {
  if (doc) {
    doc.accountNumber = decrypt(doc.accountNumber);
    doc.ifscCode = decrypt(doc.ifscCode);
    doc.upiId = decrypt(doc.upiId);
    doc.pan = decrypt(doc.pan);
    doc.gstNo = decrypt(doc.gstNo);
  }
});

let ProfileBankDetails: Model<IProfileBankDetails>;

try {
  ProfileBankDetails = mongoose.model<IProfileBankDetails>('ProfileBankDetails');
} catch {
  ProfileBankDetails = mongoose.model<IProfileBankDetails>('ProfileBankDetails', ProfileBankDetailsSchema);
}

export default ProfileBankDetails;
