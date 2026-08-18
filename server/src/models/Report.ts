import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReport extends Document {
  reporter: Types.ObjectId;
  reportedUser: Types.ObjectId;
  reason: 'FAKE_PROFILE' | 'FRAUD_SCAM' | 'HARASSMENT' | 'INAPPROPRIATE_CONTENT' | 'SPAM' | 'ABUSIVE' | 'OTHER';
  description: string;
  evidenceUrls?: string[];
  status: 'PENDING' | 'INVESTIGATING' | 'ACTION_TAKEN' | 'DISMISSED';
  actionTaken?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reportedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reason: {
      type: String,
      enum: ['FAKE_PROFILE', 'FRAUD_SCAM', 'HARASSMENT', 'INAPPROPRIATE_CONTENT', 'SPAM', 'ABUSIVE', 'OTHER'],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    evidenceUrls: [{ type: String }],
    status: {
      type: String,
      enum: ['PENDING', 'INVESTIGATING', 'ACTION_TAKEN', 'DISMISSED'],
      default: 'PENDING',
      index: true,
    },
    actionTaken: String,
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    adminNotes: String,
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
