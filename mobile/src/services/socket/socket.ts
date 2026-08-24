import { io, Socket } from 'socket.io-client';
import { appStorage } from '../../utils/storage';

const rawServerUrl = process.env.EXPO_PUBLIC_SERVER_URL || process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
const SOCKET_URL = rawServerUrl.endsWith('/') ? rawServerUrl.slice(0, -1) : rawServerUrl;

class SocketService {
  private socket: Socket | null = null;

  async connect() {
    const token = await appStorage.getItem('r24_access_token');
    if (!token) return;

    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['polling', 'websocket'],
      autoConnect: true,
    });


    this.socket.on('connect', () => {
      console.log('✅ Connected to Rishta24 Socket Server');
    });

    this.socket.on('disconnect', () => {
      console.log('⚠️ Disconnected from Rishta24 Socket Server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinConversation(conversationId: string) {
    this.socket?.emit('join_conversation', conversationId);
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit('leave_conversation', conversationId);
  }

  sendMessage(receiverId: string, text?: string, mediaUrl?: string, messageType: 'TEXT' | 'IMAGE' = 'TEXT') {
    this.socket?.emit('send_message', { receiverId, text, mediaUrl, messageType });
  }

  sendTypingStart(conversationId: string, receiverId: string) {
    this.socket?.emit('typing_start', { conversationId, receiverId });
  }

  sendTypingStop(conversationId: string, receiverId: string) {
    this.socket?.emit('typing_stop', { conversationId, receiverId });
  }

  markRead(conversationId: string, senderId: string) {
    this.socket?.emit('mark_messages_read', { conversationId, senderId });
  }

  onNewMessage(callback: (data: any) => void) {
    this.socket?.on('new_message', callback);
  }

  onMessageReceived(callback: (message: any) => void) {
    this.socket?.on('message_received', callback);
  }

  onTypingStart(callback: (data: any) => void) {
    this.socket?.on('user_typing_start', callback);
  }

  onTypingStop(callback: (data: any) => void) {
    this.socket?.on('user_typing_stop', callback);
  }

  onPresenceChanged(callback: (data: any) => void) {
    this.socket?.on('user_presence_changed', callback);
  }

  offEvents() {
    this.socket?.off('new_message');
    this.socket?.off('message_received');
    this.socket?.off('user_typing_start');
    this.socket?.off('user_typing_stop');
    this.socket?.off('user_presence_changed');
  }
}

export const socketService = new SocketService();
