import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { Button } from '../common/Button';
import { HeartParticleBurst } from '../common/HeartParticleBurst';

interface MatchCelebrationModalProps {
  visible: boolean;
  myAvatarUrl?: string;
  partnerAvatarUrl?: string;
  partnerName?: string;
  compatibilityScore?: number;
  animationVariant?: 'classic' | 'gold';
  onStartChat: () => void;
  onClose: () => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  visible,
  myAvatarUrl,
  partnerAvatarUrl,
  partnerName = 'Your Match',
  compatibilityScore = 94,
  animationVariant = 'classic',
  onStartChat,
  onClose,
}) => {
  const [showBurst, setShowBurst] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  // Animated values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const photoAOffset = useRef(new Animated.Value(-120)).current;
  const photoBOffset = useRef(new Animated.Value(120)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartRotateY = useRef(new Animated.Value(0)).current;
  const heartPulse = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(25)).current;

  const isWeb = Platform.OS === 'web';
  const useNative = !isWeb;

  useEffect(() => {
    if (!visible) {
      resetAnimation();
      return;
    }

    setIsSkipped(false);
    setShowBurst(false);

    // Timeline Animation
    Animated.sequence([
      // 0 - 250ms: Backdrop & Photo Entrance
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: useNative,
        }),
        Animated.spring(photoAOffset, {
          toValue: -15,
          friction: 6,
          tension: 40,
          useNativeDriver: useNative,
        }),
        Animated.spring(photoBOffset, {
          toValue: 15,
          friction: 6,
          tension: 40,
          useNativeDriver: useNative,
        }),
      ]),

      // 300 - 700ms: 3D Heart Appears & Rotates
      Animated.parallel([
        Animated.spring(heartScale, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: useNative,
        }),
        Animated.timing(heartRotateY, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: useNative,
        }),
      ]),

      // Pulse & Burst
      Animated.timing(heartPulse, {
        toValue: 1.15,
        duration: 350,
        useNativeDriver: useNative,
      }),
    ]).start(() => {
      setShowBurst(true);

      // Return pulse to normal and show text/buttons
      Animated.parallel([
        Animated.timing(heartPulse, {
          toValue: 1,
          duration: 300,
          useNativeDriver: useNative,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: useNative,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: useNative,
        }),
      ]).start();
    });
  }, [visible]);

  const resetAnimation = () => {
    backdropOpacity.setValue(0);
    photoAOffset.setValue(-120);
    photoBOffset.setValue(120);
    heartScale.setValue(0);
    heartRotateY.setValue(0);
    heartPulse.setValue(1);
    contentOpacity.setValue(0);
    contentTranslateY.setValue(25);
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setShowBurst(true);
    backdropOpacity.setValue(1);
    photoAOffset.setValue(-15);
    photoBOffset.setValue(15);
    heartScale.setValue(1);
    heartRotateY.setValue(1);
    heartPulse.setValue(1);
    contentOpacity.setValue(1);
    contentTranslateY.setValue(0);
  };

  if (!visible) return null;

  const spinY = heartRotateY.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isGold = animationVariant === 'gold';

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.touchBackdrop}
        onPress={isSkipped ? undefined : handleSkip}
      >
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <SafeAreaView style={styles.container}>
            {/* Skip Button */}
            {!isSkipped && (
              <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip Animation ⚡</Text>
              </TouchableOpacity>
            )}

            {/* Central Celebration Card */}
            <View style={[styles.card, isGold && styles.goldCard]}>
              {/* Interlocking Avatars & 3D Heart */}
              <View style={styles.stageArea}>
                <Animated.View
                  style={[
                    styles.avatarWrapper,
                    { transform: [{ translateX: photoAOffset }] },
                  ]}
                >
                  <Image
                    source={{
                      uri:
                        myAvatarUrl ||
                        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
                    }}
                    style={styles.avatar}
                  />
                </Animated.View>

                {/* 3D Glossy Floating Heart Container */}
                <Animated.View
                  style={[
                    styles.heartCenter,
                    isGold && styles.goldHeartCenter,
                    {
                      transform: [
                        { scale: Animated.multiply(heartScale, heartPulse) },
                        { rotateY: spinY },
                      ],
                    },
                  ]}
                >
                  <Text style={{ fontSize: isGold ? 32 : 36 }}>{isGold ? '👑' : '💖'}</Text>

                  {/* Particle Burst System */}
                  {showBurst && <HeartParticleBurst variant={animationVariant} />}
                </Animated.View>

                <Animated.View
                  style={[
                    styles.avatarWrapper,
                    { transform: [{ translateX: photoBOffset }] },
                  ]}
                >
                  <Image
                    source={{
                      uri:
                        partnerAvatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                    }}
                    style={styles.avatar}
                  />
                </Animated.View>
              </View>

              {/* Match Details & Text */}
              <Animated.View
                style={[
                  styles.contentBox,
                  {
                    opacity: contentOpacity,
                    transform: [{ translateY: contentTranslateY }],
                  },
                ]}
              >
                <View style={styles.scorePill}>
                  <Text style={styles.scorePillText}>✨ {compatibilityScore}% Mutual Match</Text>
                </View>

                <Text style={[typography.display, styles.title, isGold && styles.goldTitle]}>
                  It's a Match!
                </Text>
                <Text style={[typography.body, styles.subtitle]}>
                  You and <Text style={{ fontWeight: '800', color: colors.primary }}>{partnerName}</Text> both expressed mutual interest!
                </Text>

                <Button
                  title="Start Conversation 💬"
                  onPress={onStartChat}
                  size="large"
                  style={styles.chatBtn}
                />

                <TouchableOpacity style={styles.keepExploringBtn} onPress={onClose}>
                  <Text style={styles.keepExploringText}>Keep Exploring Matches</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </SafeAreaView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  touchBackdrop: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(25, 8, 15, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    padding: spacing.lg,
  },
  skipBtn: {
    position: 'absolute',
    top: 40,
    right: spacing.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    zIndex: 10,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    ...shadows.elevated,
  },
  goldCard: {
    borderColor: colors.gold,
    backgroundColor: '#FFFDF7',
  },
  stageArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
    width: '100%',
    position: 'relative',
    marginVertical: spacing.md,
  },
  avatarWrapper: {
    position: 'absolute',
  },
  avatar: {
    width: 105,
    height: 105,
    borderRadius: 52.5,
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    ...shadows.card,
  },
  heartCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF0F4',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.gold,
  },
  goldHeartCenter: {
    backgroundColor: '#FFFBEB',
    borderColor: colors.gold,
  },
  contentBox: {
    alignItems: 'center',
    width: '100%',
  },
  scorePill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 2,
    borderRadius: radius.full,
    marginBottom: spacing.xs,
  },
  scorePillText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  title: {
    color: colors.primary,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontWeight: '900',
  },
  goldTitle: {
    color: colors.goldDark,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
    fontSize: 14,
  },
  chatBtn: {
    width: '100%',
    marginBottom: spacing.md,
  },
  keepExploringBtn: {
    paddingVertical: spacing.sm,
  },
  keepExploringText: {
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 14,
  },
});
