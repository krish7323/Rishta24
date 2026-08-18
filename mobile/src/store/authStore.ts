import { create } from 'zustand';
import { IUser, IProfile, ISubscription } from '../types/models';

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
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  subscription: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isOnboarded: false,

  setAuthData: (data) =>
    set({
      user: data.user,
      profile: data.profile,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      subscription: data.subscription || null,
      isAuthenticated: true,
    }),

  setProfile: (profile) => set({ profile }),
  setSubscription: (subscription) => set({ subscription }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setIsOnboarded: (isOnboarded) => set({ isOnboarded }),
  logout: () =>
    set({
      user: null,
      profile: null,
      subscription: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }),
}));
