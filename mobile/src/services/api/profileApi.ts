import { apiClient } from './client';
import { ApiResponse } from '../../types';
import { IProfile, IProfilePhoto } from '../../types/models';

export const profileApi = {
  getProfileById: async (id: string): Promise<ApiResponse<{ profile: IProfile; compatibility?: any }>> => {
    const res = await apiClient.get(`/profiles/${id}`);
    return res.data;
  },

  updateProfile: async (data: Partial<IProfile>): Promise<ApiResponse<IProfile>> => {
    const res = await apiClient.put('/profiles/me', data);
    return res.data;
  },

  addPhoto: async (photoUrl: string): Promise<ApiResponse<{ photos: IProfilePhoto[]; avatar?: string; profile: IProfile }>> => {
    const res = await apiClient.post('/profiles/photos', { photoUrl });
    return res.data;
  },

  uploadPhoto: async (formData: FormData): Promise<ApiResponse<{ photos: IProfilePhoto[]; avatar?: string; profile: IProfile }>> => {
    const res = await apiClient.post('/profiles/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  setPrimaryPhoto: async (photoId: string): Promise<ApiResponse<{ photos: IProfilePhoto[]; avatar?: string; profile: IProfile }>> => {
    const res = await apiClient.put(`/profiles/photos/${photoId}/primary`);
    return res.data;
  },

  deletePhoto: async (photoId: string): Promise<ApiResponse<{ photos: IProfilePhoto[]; avatar?: string; profile: IProfile }>> => {
    const res = await apiClient.delete(`/profiles/photos/${photoId}`);
    return res.data;
  },

  deleteAccount: async (reason?: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.delete('/profiles/me', { data: { reason } });
    return res.data;
  },
};
