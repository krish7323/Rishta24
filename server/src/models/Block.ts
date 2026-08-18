import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBlock extends Document {
  blocker: Types.ObjectId;
  blockedUser: Types.ObjectId;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema = new Schema<IBlock>(
  {
    blocker: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    blockedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reason: String,
  },
  { timestamps: true }
);

BlockSchema.index({ blocker: 1, blockedUser: 1 }, { unique: true });

export const Block = mongoose.model<IBlock>('Block', BlockSchema);
