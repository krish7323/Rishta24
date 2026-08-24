import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  lastMessage?: string;
  lastMessageType?: 'TEXT' | 'IMAGE';
  lastMessageSender?: Types.ObjectId;
  lastMessageAt: Date;
  unreadCounts: Map<string, number>;
  isBlocked: boolean;
  blockedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
    lastMessage: { type: String, default: '' },
    lastMessageType: { type: String, enum: ['TEXT', 'IMAGE'], default: 'TEXT' },
    lastMessageSender: { type: Schema.Types.ObjectId, ref: 'User' },
    lastMessageAt: { type: Date, default: Date.now, index: true },
    unreadCounts: { type: Map, of: Number, default: {} },
    isBlocked: { type: Boolean, default: false }, 
    blockedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
