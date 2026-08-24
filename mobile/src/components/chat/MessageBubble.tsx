import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { IMessage } from '../../types/models';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { getMediaUrl } from '../../services/api/client';

interface MessageBubbleProps {
  message: IMessage;
  isMyMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMyMessage }) => {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.container,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMyMessage ? styles.myBubble : styles.otherBubble,
        ]}
      >
        {message.mediaUrl && (
          <Image source={{ uri: getMediaUrl(message.mediaUrl) }} style={styles.imageAttachment} />
        )}

        {message.text ? (
          <Text
            style={[
              typography.body,
              isMyMessage ? styles.myText : styles.otherText,
            ]}
          >
            {message.text}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <Text
            style={[
              styles.timeText,
              isMyMessage ? styles.myTimeText : styles.otherTimeText,
            ]}
          >
            {formattedTime}
          </Text>
          {isMyMessage && (
            <Text style={styles.statusText}>
              {message.status === 'READ' ? '✓✓' : message.status === 'DELIVERED' ? '✓✓' : '✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xxs,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius.xs,
  },
  otherBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderBottomLeftRadius: radius.xs,
  },
  myText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: colors.textPrimary,
  },
  imageAttachment: {
    width: 220,
    height: 160,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
    gap: 3,
  },
  timeText: {
    fontSize: 10,
  },
  myTimeText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherTimeText: {
    color: colors.textMuted,
  },
  statusText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 'bold',
  },
});
