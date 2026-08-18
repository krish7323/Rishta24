import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  messageType: 'TEXT' | 'IMAGE' | 'AUDIO' | 'CONTACT_REQUEST';
  text?: string;
  mediaUrl?: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  readAt?: Date;
  isDeleted: boolean;
  deletedFor: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    messageType: { type: String, enum: ['TEXT', 'IMAGE', 'AUDIO', 'CONTACT_REQUEST'], default: 'TEXT' },
    text: { type: String, trim: true },
    mediaUrl: String,
    status: { type: String, enum: ['SENT', 'DELIVERED', 'READ'], default: 'SENT', index: true },
    readAt: Date,
    isDeleted: { type: Boolean, default: false },
    deletedFor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
