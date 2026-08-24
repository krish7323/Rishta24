import { apiClient } from './client';
import { ApiResponse } from '../../types';
import { IProfile, IConversation, IMessage, INotificationItem } from '../../types/models';

export * from './authApi';
export * from './profileApi';

export const searchApi = {
  searchProfiles: async (params: any): Promise<ApiResponse<IProfile[]>> => {
    const res = await apiClient.get('/search', { params });
    return res.data;
  },

  getRecommended: async (): Promise<ApiResponse<IProfile[]>> => {
    const res = await apiClient.get('/search/recommended');
    return res.data;
  },
};

export const matchApi = {
  getMatches: async (): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get('/matches');
    return res.data;
  },

  sendInterest: async (receiverId: string, message?: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/interests/send', { receiverId, message });
    return res.data;
  },

  respondInterest: async (interestId: string, action: 'ACCEPT' | 'REJECT'): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/interests/respond', { interestId, action });
    return res.data;
  },

  getReceivedInterests: async (): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get('/interests/received');
    return res.data;
  },

  getSentInterests: async (): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get('/interests/sent');
    return res.data;
  },

  toggleShortlist: async (targetUserId: string, notes?: string): Promise<ApiResponse<{ isShortlisted: boolean }>> => {
    const res = await apiClient.post('/shortlists/toggle', { targetUserId, notes });
    return res.data;
  },

  getShortlists: async (): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get('/shortlists');
    return res.data;
  },

  getVisitors: async (): Promise<ApiResponse<{ visitors: any[]; isPremiumUnlocked: boolean; totalVisitors: number }>> => {
    const res = await apiClient.get('/visitors');
    return res.data;
  },
};

export const chatApi = {
  getConversations: async (): Promise<ApiResponse<IConversation[]>> => {
    const res = await apiClient.get('/chats/conversations');
    return res.data;
  },

  getMessages: async (conversationId: string, page = 1): Promise<ApiResponse<IMessage[]>> => {
    const res = await apiClient.get(`/chats/conversations/${conversationId}/messages`, { params: { page } });
    return res.data;
  },

  sendMessage: async (receiverId: string, text?: string, mediaUrl?: string, messageType: 'TEXT' | 'IMAGE' = 'TEXT'): Promise<ApiResponse<{ message: IMessage; conversationId: string }>> => {
    const res = await apiClient.post('/chats/messages', { receiverId, text, mediaUrl, messageType });
    return res.data;
  },

  uploadAttachment: async (formData: FormData): Promise<ApiResponse<{ mediaUrl: string; filename: string; mimeType: string; size: number }>> => {
    const res = await apiClient.post('/chats/attachment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export const premiumApi = {
  getPlans: async (): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get('/premium/plans');
    return res.data;
  },

  getMySubscription: async (): Promise<ApiResponse<any>> => {
    const res = await apiClient.get('/premium/my-subscription');
    return res.data;
  },

  createOrder: async (planId: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/premium/create-order', { planId });
    return res.data;
  },

  verifyPayment: async (data: { orderId: string; paymentId: string; signature: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/premium/verify-payment', data);
    return res.data;
  },
};

export const generalApi = {
  getNotifications: async (): Promise<ApiResponse<{ notifications: INotificationItem[]; unreadCount: number }>> => {
    const res = await apiClient.get('/notifications');
    return res.data;
  },

  markAllNotificationsRead: async (): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/notifications/read-all');
    return res.data;
  },

  submitVerification: async (data: any): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/verification/submit', data);
    return res.data;
  },

  getVerificationStatus: async (): Promise<ApiResponse<any>> => {
    const res = await apiClient.get('/verification/status');
    return res.data;
  },

  reportUser: async (data: { reportedUserId: string; reason: string; description: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/reports', data);
    return res.data;
  },

  blockUser: async (blockedUserId: string, reason?: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/reports/block', { blockedUserId, reason });
    return res.data;
  },

  unblockUser: async (blockedUserId: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.delete(`/reports/block/${blockedUserId}`);
    return res.data;
  },

  getBlockedUsers: async (): Promise<ApiResponse<IProfile[]>> => {
    const res = await apiClient.get('/reports/blocks');
    return res.data;
  },

  createSupportTicket: async (data: { subject: string; category: string; message: string; priority?: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/support', data);
    return res.data;
  },

  getMySupportTickets: async (): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get('/support/my-tickets');
    return res.data;
  },

  getReferralStats: async (): Promise<ApiResponse<any>> => {
    const res = await apiClient.get('/referrals/stats');
    return res.data;
  },
};
