import { create } from 'zustand';
import { matchApi } from '../services/api';

interface MatchState {
  matches: any[];
  receivedInterests: any[];
  sentInterests: any[];
  shortlists: any[];
  visitors: any[];
  isVisitorsPremiumUnlocked: boolean;
  totalVisitorsCount: number;
  isLoading: boolean;
  matchCelebrationData: any | null;

  fetchMatches: () => Promise<void>;
  fetchReceivedInterests: () => Promise<void>;
  fetchSentInterests: () => Promise<void>;
  fetchShortlists: () => Promise<void>;
  fetchVisitors: () => Promise<void>;
  sendInterest: (receiverId: string, message?: string) => Promise<{ isMutualMatch: boolean; interest: any }>;
  respondInterest: (interestId: string, action: 'ACCEPT' | 'REJECT') => Promise<void>;
  toggleShortlist: (targetUserId: string, notes?: string) => Promise<boolean>;
  setMatchCelebrationData: (data: any | null) => void;
  reset: () => void;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  receivedInterests: [],
  sentInterests: [],
  shortlists: [],
  visitors: [],
  isVisitorsPremiumUnlocked: false,
  totalVisitorsCount: 0,
  isLoading: false,
  matchCelebrationData: null,

  fetchMatches: async () => {
    try {
      set({ isLoading: true });
      const res = await matchApi.getMatches();
      set({ matches: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchReceivedInterests: async () => {
    try {
      set({ isLoading: true });
      const res = await matchApi.getReceivedInterests();
      set({ receivedInterests: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchSentInterests: async () => {
    try {
      set({ isLoading: true });
      const res = await matchApi.getSentInterests();
      set({ sentInterests: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchShortlists: async () => {
    try {
      set({ isLoading: true });
      const res = await matchApi.getShortlists();
      set({ shortlists: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchVisitors: async () => {
    try {
      set({ isLoading: true });
      const res = await matchApi.getVisitors();
      set({
        visitors: res.data.visitors,
        isVisitorsPremiumUnlocked: res.data.isPremiumUnlocked,
        totalVisitorsCount: res.data.totalVisitors,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  sendInterest: async (receiverId, message) => {
    const res = await matchApi.sendInterest(receiverId, message);
    if (res.data.isMutualMatch) {
      set({ matchCelebrationData: res.data });
      get().fetchMatches();
    }
    get().fetchSentInterests();
    return res.data;
  },

  respondInterest: async (interestId, action) => {
    await matchApi.respondInterest(interestId, action);
    get().fetchReceivedInterests();
    if (action === 'ACCEPT') {
      get().fetchMatches();
    }
  },

  toggleShortlist: async (targetUserId, notes) => {
    const res = await matchApi.toggleShortlist(targetUserId, notes);
    get().fetchShortlists();
    return res.data.isShortlisted;
  },

  setMatchCelebrationData: (data) => set({ matchCelebrationData: data }),
  reset: () =>
    set({
      matches: [],
      receivedInterests: [],
      sentInterests: [],
      shortlists: [],
      visitors: [],
      isVisitorsPremiumUnlocked: false,
      totalVisitorsCount: 0,
      isLoading: false,
      matchCelebrationData: null,
    }),
}));
