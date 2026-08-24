import axios, { AxiosRequestConfig } from 'axios';
import { appStorage } from '../../utils/storage';

// Dynamic production or local API URL
const rawServerUrl = process.env.EXPO_PUBLIC_SERVER_URL || process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'https://rishta24-backend.onrender.com';
export const SERVER_BASE_URL = rawServerUrl.endsWith('/') ? rawServerUrl.slice(0, -1) : rawServerUrl;
export const API_BASE_URL = `${SERVER_BASE_URL}/api`;

export const getMediaUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return `${SERVER_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await appStorage.getItem('r24_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh & 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await appStorage.getItem('r24_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
          const newAccessToken = res.data.data.accessToken;

          await appStorage.setItem('r24_access_token', newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } catch (refreshErr) {
          await appStorage.removeItem('r24_access_token');
          await appStorage.removeItem('r24_refresh_token');
          return Promise.reject(refreshErr);
        }
      } else {
        await appStorage.removeItem('r24_access_token');
        await appStorage.removeItem('r24_refresh_token');
      }
    }

    return Promise.reject(error);
  }
);
