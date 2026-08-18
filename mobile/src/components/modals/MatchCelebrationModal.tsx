import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { Button } from '../common/Button';

interface MatchCelebrationModalProps {
  visible: boolean;
  myAvatarUrl?: string;
  partnerAvatarUrl?: string;
  partnerName?: string;
  onStartChat: () => void;
  onClose: () => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  visible,
  myAvatarUrl,
  partnerAvatarUrl,
  partnerName = 'Your Match',
  onStartChat,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <SafeAreaView style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.emojiDecor}>❤️ ✨ 🎉</Text>
          <Text style={[typography.display, styles.title]}>It's a Match!</Text>
          <Text style={[typography.body, styles.subtitle]}>
            You and <Text style={{ fontWeight: '700', color: colors.primary }}>{partnerName}</Text> liked each other!
          </Text>

          {/* Interlocking Avatars */}
          <View style={styles.avatarRow}>
            <Image
              source={{
                uri:
                  myAvatarUrl ||
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
              }}
              style={[styles.avatar, styles.myAvatar]}
            />
            <View style={styles.heartCenter}>
              <Text style={{ fontSize: 24 }}>💖</Text>
            </View>
            <Image
              source={{
                uri:
                  partnerAvatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              }}
              style={[styles.avatar, styles.partnerAvatar]}
            />
          </View>

          <Button
            title="Start Chatting 💬"
            onPress={onStartChat}
            size="large"
            style={styles.chatBtn}
          />

          <TouchableOpacity style={styles.keepExploringBtn} onPress={onClose}>
            <Text style={[typography.button, styles.keepExploringText]}>Keep Exploring</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(30, 10, 18, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    ...shadows.elevated,
  },
  emojiDecor: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  myAvatar: {
    marginRight: -18,
    zIndex: 1,
  },
  partnerAvatar: {
    marginLeft: -18,
    zIndex: 1,
  },
  heartCenter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...shadows.soft,
  },
  chatBtn: {
    marginBottom: spacing.md,
  },
  keepExploringBtn: {
    paddingVertical: spacing.sm,
  },
  keepExploringText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
