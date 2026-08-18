import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IConversation } from '../../types/models';
import { Avatar } from '../common/Avatar';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

interface ConversationItemProps {
  conversation: IConversation;
  onPress: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onPress,
}) => {
  const partner = conversation.partnerProfile;
  const time = conversation.lastMessageAt
    ? new Date(conversation.lastMessageAt).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Avatar
        url={partner?.avatar}
        isVerified={partner?.verificationBadge}
        isOnline={partner?.isOnline}
        isPremium={partner?.isPremium}
        size={54}
      />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[typography.h3, styles.name]} numberOfLines={1}>
            {partner?.firstName} {partner?.lastName}
          </Text>
          <Text style={[typography.small, styles.time]}>{time}</Text>
        </View>

        <View style={styles.messageRow}>
          <Text
            style={[
              typography.bodySecondary,
              styles.lastMessage,
              conversation.unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {conversation.lastMessage || 'Start conversation...'}
          </Text>

          {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCountText}>{conversation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  time: {
    color: colors.textMuted,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  unreadMessage: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: spacing.sm,
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
