import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMatch extends Document {
  user1: Types.ObjectId;
  user2: Types.ObjectId;
  matchScore: number;
  status: 'ACTIVE' | 'UNMATCHED' | 'BLOCKED';
  matchedAt: Date;
  lastInteractionAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    matchScore: { type: Number, default: 85 },
    status: { type: String, enum: ['ACTIVE', 'UNMATCHED', 'BLOCKED'], default: 'ACTIVE', index: true },
    matchedAt: { type: Date, default: Date.now },
    lastInteractionAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

MatchSchema.index({ user1: 1, user2: 1 }, { unique: true });

export const Match = mongoose.model<IMatch>('Match', MatchSchema);
