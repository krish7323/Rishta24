import mongoose, { Schema, Document, Types } from 'mongoose';
import { INTEREST_STATUS } from '../config/constants';

export interface IInterest extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterestSchema = new Schema<IInterest>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: Object.values(INTEREST_STATUS),
      default: INTEREST_STATUS.PENDING,
      index: true,
    },
    message: { type: String, trim: true },
  },
  { timestamps: true }
);

InterestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export const Interest = mongoose.model<IInterest>('Interest', InterestSchema);
