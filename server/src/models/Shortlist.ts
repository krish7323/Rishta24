import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IShortlist extends Document {
  user: Types.ObjectId;
  targetUser: Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShortlistSchema = new Schema<IShortlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    notes: String,
  },
  { timestamps: true }
);

ShortlistSchema.index({ user: 1, targetUser: 1 }, { unique: true });

export const Shortlist = mongoose.model<IShortlist>('Shortlist', ShortlistSchema);
