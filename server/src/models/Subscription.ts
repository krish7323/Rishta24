import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubscription extends Document {
  user: Types.ObjectId;
  planId: 'FREE' | 'PREMIUM_MONTHLY' | 'PREMIUM_QUARTERLY' | 'PREMIUM_YEARLY';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: Date;
  endDate: Date;
  paymentId?: Types.ObjectId;
  features: {
    dailyInterestLimit: number;
    dailyProfileViews: number;
    canChat: boolean;
    canViewContact: boolean;
    canViewVisitors: boolean;
    hasIncognito: boolean;
    hasBoost: boolean;
  };
  interestsSentToday: number;
  profilesViewedToday: number;
  lastUsageReset: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planId: {
      type: String,
      enum: ['FREE', 'PREMIUM_MONTHLY', 'PREMIUM_QUARTERLY', 'PREMIUM_YEARLY'],
      default: 'FREE',
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    features: {
      dailyInterestLimit: { type: Number, default: 3 },
      dailyProfileViews: { type: Number, default: 10 },
      canChat: { type: Boolean, default: false },
      canViewContact: { type: Boolean, default: false },
      canViewVisitors: { type: Boolean, default: false },
      hasIncognito: { type: Boolean, default: false },
      hasBoost: { type: Boolean, default: false },
    },
    interestsSentToday: { type: Number, default: 0 },
    profilesViewedToday: { type: Number, default: 0 },
    lastUsageReset: { type: Date, default: Date.now },
    autoRenew: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ user: 1, status: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
