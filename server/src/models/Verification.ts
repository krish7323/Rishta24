import mongoose, { Schema, Document, Types } from 'mongoose';
import { VERIFICATION_STATUS, VerificationStatus } from '../config/constants';

export interface IVerification extends Document {
  user: Types.ObjectId;
  documentType: 'AADHAAR' | 'PASSPORT' | 'DRIVING_LICENSE' | 'VOTER_ID' | 'PAN_CARD';
  documentNumberMasked: string;
  documentFrontUrl: string;
  documentBackUrl?: string;
  selfieUrl: string;
  status: VerificationStatus;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema<IVerification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    documentType: {
      type: String,
      enum: ['AADHAAR', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID', 'PAN_CARD'],
      required: true,
    },
    documentNumberMasked: { type: String, required: true },
    documentFrontUrl: { type: String, required: true },
    documentBackUrl: String,
    selfieUrl: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
      index: true,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    rejectionReason: String,
  },
  { timestamps: true }
);

export const Verification = mongoose.model<IVerification>('Verification', VerificationSchema);
