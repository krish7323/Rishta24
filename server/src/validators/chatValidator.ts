import { z } from 'zod';

export const sendMessageSchema = z.object({
  receiverId: z.string().min(1, 'Receiver ID is required'),
  text: z.string().max(2000).optional(),
  mediaUrl: z.string().url().optional(),
  messageType: z.enum(['TEXT', 'IMAGE', 'AUDIO', 'CONTACT_REQUEST']).default('TEXT'),
});

export const reportUserSchema = z.object({
  reportedUserId: z.string().min(1, 'Target user ID required'),
  reason: z.enum(['FAKE_PROFILE', 'FRAUD_SCAM', 'HARASSMENT', 'INAPPROPRIATE_CONTENT', 'SPAM', 'ABUSIVE', 'OTHER']),
  description: z.string().min(10, 'Please provide detailed description (at least 10 characters)'),
  evidenceUrls: z.array(z.string().url()).optional(),
});

export const blockUserSchema = z.object({
  blockedUserId: z.string().min(1, 'Target user ID required'),
  reason: z.string().optional(),
});

export const createSupportTicketSchema = z.object({
  subject: z.string().min(5, 'Subject is required'),
  category: z.enum(['BILLING', 'PROFILE', 'CHAT_ISSUE', 'VERIFICATION', 'SAFETY', 'OTHER']),
  message: z.string().min(10, 'Message is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});
