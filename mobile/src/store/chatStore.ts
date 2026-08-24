import { create } from 'zustand';
import { chatApi } from '../services/api';
import { IConversation, IMessage } from '../types/models';

interface ChatState {
  conversations: IConversation[];
  activeMessages: IMessage[];
  isLoading: boolean;
  activeConversationId: string | null;

  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  addMessage: (message: IMessage) => void;
  setActiveConversationId: (id: string | null) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeMessages: [],
  isLoading: false,
  activeConversationId: null,

  fetchConversations: async () => {
    try {
      set({ isLoading: true });
      const res = await chatApi.getConversations();
      set({ conversations: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (conversationId: string) => {
    try {
      set({ isLoading: true, activeConversationId: conversationId });
      const res = await chatApi.getMessages(conversationId);
      set({ activeMessages: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addMessage: (message: IMessage) => {
    set((state) => ({
      activeMessages: [...state.activeMessages, message],
      conversations: state.conversations.map((c) =>
        c._id === message.conversationId
          ? {
              ...c,
              lastMessage: message.text || (message.mediaUrl ? 'Photo' : ''),
              lastMessageAt: message.createdAt,
            }
          : c
      ),
    }));
  },

  setActiveConversationId: (id) => set({ activeConversationId: id }),
  reset: () => set({ conversations: [], activeMessages: [], isLoading: false, activeConversationId: null }),
}));
