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

  addPhoto: async (photoUrl: string): Promise<ApiResponse<IProfilePhoto[]>> => {
    const res = await apiClient.post('/profiles/photos', { photoUrl });
    return res.data;
  },

  deletePhoto: async (photoId: string): Promise<ApiResponse<IProfilePhoto[]>> => {
    const res = await apiClient.delete(`/profiles/photos/${photoId}`);
    return res.data;
  },

  deleteAccount: async (reason?: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.delete('/profiles/me', { data: { reason } });
    return res.data;
  },
};
