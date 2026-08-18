import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReferral extends Document {
  referrer: Types.ObjectId;
  referredUser: Types.ObjectId;
  referralCode: string;
  status: 'PENDING' | 'COMPLETED' | 'REWARDED';
  rewardType: 'FREE_PREMIUM_DAYS' | 'PROFILE_BOOST' | 'WALLET_CASH';
  rewardValue: number;
  rewardClaimed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    referredUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    referralCode: { type: String, required: true, index: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'REWARDED'], default: 'PENDING' },
    rewardType: { type: String, enum: ['FREE_PREMIUM_DAYS', 'PROFILE_BOOST', 'WALLET_CASH'], default: 'FREE_PREMIUM_DAYS' },
    rewardValue: { type: Number, default: 7 }, // 7 days of free premium
    rewardClaimed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Referral = mongoose.model<IReferral>('Referral', ReferralSchema);
