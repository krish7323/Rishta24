import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Avatar } from '../../components/common/Avatar';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { chatApi, generalApi } from '../../services/api';
import { socketService } from '../../services/socket/socket';

export const ChatScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { conversationId, partnerProfile } = route.params || {};
  const [messages, setMessages] = useState<any[]>([]);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const myUser = useAuthStore((state) => state.user);
  const myUserId = myUser?.id || myUser?._id || '';

  const partnerUserId = partnerProfile?.user?._id || partnerProfile?.user || '';

  useEffect(() => {
    // Fetch initial messages if conversation exists
    if (conversationId) {
      chatApi.getMessages(conversationId).then((res) => {
        setMessages(res.data);
      });
      socketService.joinConversation(conversationId);
    }

    // Listen for socket messages
    socketService.onMessageReceived((msg) => {
      setMessages((prev) => [...prev, msg]);
      flatListRef.current?.scrollToEnd({ animated: true });
    });

    socketService.onNewMessage((data) => {
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    });

    socketService.onTypingStart((data) => {
      if (data.userId === partnerUserId) {
        setIsPartnerTyping(true);
      }
    });

    socketService.onTypingStop((data) => {
      if (data.userId === partnerUserId) {
        setIsPartnerTyping(false);
      }
    });

    return () => {
      if (conversationId) {
        socketService.leaveConversation(conversationId);
      }
      socketService.offEvents();
    };
  }, [conversationId, partnerUserId]);

  const handleSend = async (text: string) => {
    // Optimistic UI append
    const tempMsg: any = {
      _id: `temp_${Date.now()}`,
      sender: myUserId,
      receiver: partnerUserId,
      text,
      messageType: 'TEXT',
      status: 'SENT',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    flatListRef.current?.scrollToEnd({ animated: true });

    // Emit via Socket
    socketService.sendMessage(partnerUserId, text, undefined, 'TEXT');

    // Also persist via REST for resilience
    try {
      await chatApi.sendMessage(partnerUserId, text);
    } catch {
      // ignore
    }
  };

  const handleAttachPhoto = () => {
    Alert.alert('Send Photo', 'Select a photo from gallery to send privately:', [
      {
        text: 'Send Demo Photo 📸',
        onPress: async () => {
          const demoPhoto =
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80';
          const tempMsg: any = {
            _id: `temp_${Date.now()}`,
            sender: myUserId,
            receiver: partnerUserId,
            mediaUrl: demoPhoto,
            messageType: 'IMAGE',
            status: 'SENT',
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, tempMsg]);
          socketService.sendMessage(partnerUserId, undefined, demoPhoto, 'IMAGE');
          await chatApi.sendMessage(partnerUserId, undefined, demoPhoto);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSafetyAction = () => {
    Alert.alert('Safety Actions', `Manage your interaction with ${partnerProfile?.firstName}:`, [
      {
        text: 'Report Profile 🚨',
        onPress: () => {
          Alert.prompt
            ? Alert.prompt('Report Reason', 'Please describe the issue:', async (desc) => {
                await generalApi.reportUser({
                  reportedUserId: partnerUserId,
                  reason: 'INAPPROPRIATE_CONTENT',
                  description: desc || 'Inappropriate communication',
                });
                Alert.alert('Report Received', 'Thank you. Our moderation team is reviewing this report.');
              })
            : Alert.alert('Report Submitted', 'Moderation team has been alerted.');
        },
        style: 'destructive',
      },
      {
        text: 'Block Member 🚫',
        onPress: async () => {
          await generalApi.blockUser(partnerUserId);
          Alert.alert('Member Blocked', `${partnerProfile?.firstName} has been blocked and will no longer be able to message you.`);
          navigation.goBack();
        },
        style: 'destructive',
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Chat Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 22 }}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerPartnerInfo}
            onPress={() =>
              navigation.navigate('ProfileDetail', {
                profileId: partnerUserId,
                initialProfile: partnerProfile,
              })
            }
            activeOpacity={0.8}
          >
            <Avatar
              url={partnerProfile?.avatar}
              size={40}
              isVerified={partnerProfile?.verificationBadge}
              isOnline={partnerProfile?.isOnline}
            />
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={[typography.h3, { fontSize: 16 }]} numberOfLines={1}>
                {partnerProfile?.firstName} {partnerProfile?.lastName}
              </Text>
              <Text style={[typography.small, { color: colors.success }]}>
                {partnerProfile?.isOnline ? 'Online' : 'Active recently'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.moreBtn} onPress={handleSafetyAction}>
            <Text style={{ fontSize: 20 }}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Anti-Scam Notice Banner */}
        <View style={styles.scamNoticeBanner}>
          <Text style={styles.scamNoticeText}>
            🔒 <Text style={{ fontWeight: '800' }}>Rishta24 Safety Notice:</Text> Never transfer money, UPI payments, or financial passwords to anyone met online.
          </Text>
        </View>

        {/* Message Feed */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={() => (
            <View style={styles.emptyChatBox}>
              <Text style={{ fontSize: 32, marginBottom: spacing.xs }}>💬</Text>
              <Text style={[typography.h3, { color: colors.textPrimary }]}>Start Your Conversation</Text>
              <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center', marginTop: 2, marginBottom: spacing.md }]}>
                Tap a suggested starter below to send your first message:
              </Text>
              <View style={styles.startersWrap}>
                {[
                  'Hi! Nice to connect with you on Rishta24.',
                  'What is your favourite pastime or weekend hobby?',
                  'Tell me a little about your work & aspirations.',
                ].map((st, i) => (
                  <TouchableOpacity key={i} style={styles.starterChip} onPress={() => handleSend(st)}>
                    <Text style={styles.starterChipText}>{st}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          renderItem={({ item }) => {
            const isMine = item.sender === myUserId || item.sender?._id === myUserId;
            return <MessageBubble message={item} isMyMessage={isMine} />;
          }}
        />


        {isPartnerTyping && (
          <View style={styles.typingIndicatorContainer}>
            <Text style={[typography.small, { color: colors.primary }]}>
              {partnerProfile?.firstName} is typing... ✍️
            </Text>
          </View>
        )}

        {/* Input Footer */}
        <ChatInput
          onSend={handleSend}
          onAttachMedia={handleAttachPhoto}
          onTyping={() => socketService.sendTypingStart(conversationId || '', partnerUserId)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPartnerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  moreBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scamNoticeBanner: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold,
  },
  scamNoticeText: {
    color: '#7A5B1E',
    fontSize: 11,
    textAlign: 'center',
  },
  emptyChatBox: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  startersWrap: {
    gap: spacing.sm,
    width: '100%',
  },
  starterChip: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    alignItems: 'center',
  },
  starterChipText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  messagesList: {
    paddingVertical: spacing.md,
  },
  typingIndicatorContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
});

