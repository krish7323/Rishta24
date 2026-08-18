import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITicketMessage {
  sender: Types.ObjectId;
  senderRole: 'USER' | 'ADMIN' | 'SUPPORT';
  message: string;
  attachments?: string[];
  sentAt: Date;
}

export interface ISupportTicket extends Document {
  ticketNumber: string;
  user: Types.ObjectId;
  subject: string;
  category: 'BILLING' | 'PROFILE' | 'CHAT_ISSUE' | 'VERIFICATION' | 'SAFETY' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  messages: ITicketMessage[];
  assignedTo?: Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['BILLING', 'PROFILE', 'CHAT_ISSUE', 'VERIFICATION', 'SAFETY', 'OTHER'],
      default: 'OTHER',
      index: true,
    },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
      index: true,
    },
    messages: [
      {
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        senderRole: { type: String, enum: ['USER', 'ADMIN', 'SUPPORT'], required: true },
        message: { type: String, required: true },
        attachments: [{ type: String }],
        sentAt: { type: Date, default: Date.now },
      },
    ],
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date,
  },
  { timestamps: true }
);

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
