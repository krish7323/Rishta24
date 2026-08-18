import { create } from 'zustand';
import { AdminUser } from '../types/admin';

interface AdminState {
  admin: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (admin: AdminUser, token: string) => void;
  logout: () => void;
}

const savedToken = localStorage.getItem('rishta24_admin_token');
const savedAdmin = localStorage.getItem('rishta24_admin_user');

export const useAdminStore = create<AdminState>((set) => ({
  admin: savedAdmin ? JSON.parse(savedAdmin) : null,
  accessToken: savedToken || null,
  isAuthenticated: !!savedToken,

  setAuth: (admin, token) => {
    localStorage.setItem('rishta24_admin_token', token);
    localStorage.setItem('rishta24_admin_user', JSON.stringify(admin));
    set({ admin, accessToken: token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('rishta24_admin_token');
    localStorage.removeItem('rishta24_admin_user');
    set({ admin: null, accessToken: null, isAuthenticated: false });
  },
}));
