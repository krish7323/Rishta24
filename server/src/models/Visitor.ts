import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVisitor extends Document {
  profileOwner: Types.ObjectId;
  viewer: Types.ObjectId;
  viewCount: number;
  lastViewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VisitorSchema = new Schema<IVisitor>(
  {
    profileOwner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    viewer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    viewCount: { type: Number, default: 1 },
    lastViewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

VisitorSchema.index({ profileOwner: 1, viewer: 1 }, { unique: true });
VisitorSchema.index({ profileOwner: 1, lastViewedAt: -1 });

export const Visitor = mongoose.model<IVisitor>('Visitor', VisitorSchema);
