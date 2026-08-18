import { apiClient } from './client';
import { ApiResponse } from '../../types';
import { IUser, IProfile, ISubscription } from '../../types/models';

export const authApi = {
  register: async (data: any): Promise<ApiResponse<{ user: IUser; profile: IProfile; accessToken: string; refreshToken: string }>> => {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  login: async (data: { identifier: string; password: string }): Promise<ApiResponse<{ user: IUser; profile: IProfile; accessToken: string; refreshToken: string }>> => {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },

  sendOtp: async (data: { identifier: string; purpose: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/auth/send-otp', data);
    return res.data;
  },

  verifyOtp: async (data: { identifier: string; otp: string; purpose: string }): Promise<ApiResponse<{ user: IUser; profile: IProfile; accessToken: string; refreshToken: string }>> => {
    const res = await apiClient.post('/auth/verify-otp', data);
    return res.data;
  },

  resetPassword: async (data: any): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/auth/reset-password', data);
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: IUser; profile: IProfile; subscription: ISubscription }>> => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  logout: async (): Promise<ApiResponse<any>> => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },
};
