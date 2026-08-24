import { create } from 'zustand';
import { searchApi } from '../services/api';
import { IProfile } from '../types/models';

interface SearchFilters {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
  religion?: string;
  community?: string;
  city?: string;
  state?: string;
  maritalStatus?: string;
  educationLevel?: string;
  occupation?: string;
  diet?: string;
  isVerifiedOnly?: boolean;
  isPremiumOnly?: boolean;
}

interface SearchState {
  recommendedProfiles: IProfile[];
  searchResults: IProfile[];
  filters: SearchFilters;
  isLoading: boolean;
  isSearching: boolean;

  fetchRecommended: () => Promise<void>;
  search: (customFilters?: Partial<SearchFilters>) => Promise<void>;
  setFilter: (key: keyof SearchFilters, value: any) => void;
  resetFilters: () => void;
  reset: () => void;
}

const initialFilters: SearchFilters = {
  minAge: 21,
  maxAge: 35,
};

export const useSearchStore = create<SearchState>((set, get) => ({
  recommendedProfiles: [],
  searchResults: [],
  filters: initialFilters,
  isLoading: false,
  isSearching: false,

  fetchRecommended: async () => {
    try {
      set({ isLoading: true });
      const res = await searchApi.getRecommended();
      set({ recommendedProfiles: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  search: async (customFilters) => {
    try {
      set({ isSearching: true });
      const activeFilters = { ...get().filters, ...(customFilters || {}) };
      const res = await searchApi.searchProfiles(activeFilters);
      set({ searchResults: res.data, isSearching: false });
    } catch {
      set({ isSearching: false });
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  resetFilters: () => set({ filters: initialFilters }),
  reset: () => set({ recommendedProfiles: [], searchResults: [], filters: initialFilters, isLoading: false, isSearching: false }),
}));
