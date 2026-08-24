import { create } from 'zustand';
import { IUser, IProfile, ISubscription } from '../types/models';
import { appStorage } from '../utils/storage';
import { authApi } from '../services/api/authApi';
import { socketService } from '../services/socket/socket';
import { useChatStore } from './chatStore';
import { useMatchStore } from './matchStore';
import { useSearchStore } from './searchStore';

interface AuthState {
  user: IUser | null;
  profile: IProfile | null;
  subscription: ISubscription | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnboarded: boolean;

  setAuthData: (data: {
    user: IUser;
    profile: IProfile;
    accessToken: string;
    refreshToken: string;
    subscription?: ISubscription;
  }) => void;
  setProfile: (profile: IProfile) => void;
  setSubscription: (subscription: ISubscription) => void;
  setAccessToken: (token: string) => void;
  setIsOnboarded: (val: boolean) => void;
  restoreSession: () => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  subscription: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  isOnboarded: false,

  setAuthData: (data) => {
    appStorage.setItem('r24_access_token', data.accessToken);
    appStorage.setItem('r24_refresh_token', data.refreshToken);
    set({
      user: data.user,
      profile: data.profile,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      subscription: data.subscription || null,
      isAuthenticated: true,
      isLoading: false,
    });
    socketService.connect();
  },

  setProfile: (profile) => set({ profile }),
  setSubscription: (subscription) => set({ subscription }),
  setAccessToken: (accessToken) => {
    appStorage.setItem('r24_access_token', accessToken);
    set({ accessToken });
  },
  setIsOnboarded: (isOnboarded) => set({ isOnboarded }),

  restoreSession: async () => {
    try {
      set({ isLoading: true });
      const storedToken = await appStorage.getItem('r24_access_token');
      const storedRefreshToken = await appStorage.getItem('r24_refresh_token');

      if (!storedToken) {
        set({ isLoading: false, isAuthenticated: false });
        return false;
      }

      set({ accessToken: storedToken, refreshToken: storedRefreshToken });

      // Fetch fresh session from MongoDB backend
      const res = await authApi.getMe();
      if (res.success && res.data) {
        set({
          user: res.data.user,
          profile: res.data.profile,
          subscription: res.data.subscription || null,
          isAuthenticated: true,
          isLoading: false,
        });
        socketService.connect();
        return true;
      } else {
        await get().logout();
        return false;
      }
    } catch (err) {
      await get().logout();
      return false;
    }
  },

  logout: () => {
    appStorage.removeItem('r24_access_token');
    appStorage.removeItem('r24_refresh_token');
    socketService.disconnect();
    useChatStore.getState().reset?.();
    useMatchStore.getState().reset?.();
    useSearchStore.getState().reset?.();
    set({
      user: null,
      profile: null,
      subscription: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));

