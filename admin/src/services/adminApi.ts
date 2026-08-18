import axios from 'axios';
import { useAdminStore } from '../store/adminStore';

export const API_BASE_URL = 'http://localhost:5000/api';

export const adminClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

adminClient.interceptors.request.use((config) => {
  const token = useAdminStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  login: async (credentials: { identifier: string; password: string }) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return res.data;
  },

  getDashboardMetrics: async () => {
    const res = await adminClient.get('/admin/dashboard');
    return res.data;
  },

  listUsers: async (params?: any) => {
    const res = await adminClient.get('/admin/users', { params });
    return res.data;
  },

  getUserDetails: async (userId: string) => {
    const res = await adminClient.get(`/admin/users/${userId}`);
    return res.data;
  },

  updateUserStatus: async (userId: string, status: string, reason?: string) => {
    const res = await adminClient.put(`/admin/users/${userId}/status`, { status, reason });
    return res.data;
  },

  listVerifications: async (params?: any) => {
    const res = await adminClient.get('/admin/verifications', { params });
    return res.data;
  },

  reviewVerification: async (verificationId: string, action: 'APPROVE' | 'REJECT', rejectionReason?: string) => {
    const res = await adminClient.put(`/admin/verifications/${verificationId}/review`, {
      action,
      rejectionReason,
    });
    return res.data;
  },

  listReports: async (params?: any) => {
    const res = await adminClient.get('/admin/reports', { params });
    return res.data;
  },

  resolveReport: async (reportId: string, action: string, adminNotes?: string) => {
    const res = await adminClient.put(`/admin/reports/${reportId}/resolve`, {
      action,
      adminNotes,
    });
    return res.data;
  },

  listPayments: async (params?: any) => {
    const res = await adminClient.get('/admin/payments', { params });
    return res.data;
  },

  listSupportTickets: async (params?: any) => {
    const res = await adminClient.get('/admin/support-tickets', { params });
    return res.data;
  },

  replySupportTicket: async (ticketId: string, message: string, status: string = 'RESOLVED') => {
    const res = await adminClient.put(`/admin/support-tickets/${ticketId}/reply`, {
      message,
      status,
    });
    return res.data;
  },

  getAuditLogs: async (params?: any) => {
    const res = await adminClient.get('/admin/audit-logs', { params });
    return res.data;
  },
};
