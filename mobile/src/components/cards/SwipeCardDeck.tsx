import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { IProfile } from '../../types/models';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { VerifiedBadge, PremiumCrownBadge, CompatibilityTag } from '../common/Badge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 110;

interface SwipeCardDeckProps {
  profiles: IProfile[];
  onSwipeRight: (profile: IProfile) => void;
  onSwipeLeft: (profile: IProfile) => void;
  onShortlist: (profile: IProfile) => void;
  onCardPress: (profile: IProfile) => void;
  onEmpty?: () => void;
}

export const SwipeCardDeck: React.FC<SwipeCardDeckProps> = ({
  profiles,
  onSwipeRight,
  onSwipeLeft,
  onShortlist,
  onCardPress,
  onEmpty,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.2 : -SCREEN_WIDTH * 1.2;
    Animated.timing(pan, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    const item = profiles[currentIndex];
    pan.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);

    if (direction === 'right') {
      onSwipeRight(item);
    } else {
      onSwipeLeft(item);
    }

    if (currentIndex + 1 >= profiles.length && onEmpty) {
      onEmpty();
    }
  };

  const resetPosition = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  if (!currentProfile || currentIndex >= profiles.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 40, marginBottom: 8 }}>🌹</Text>
        <Text style={[typography.h3, { color: colors.textPrimary, textAlign: 'center' }]}>
          No More Recommendations
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>
          You have viewed all matching candidate profiles for today. Check back soon for fresh recommendations!
        </Text>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => setCurrentIndex(0)}
          activeOpacity={0.8}
        >
          <Text style={styles.resetBtnText}>🔄 Replay Recommendations</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Card Rotation Interpolation
  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-25deg', '0deg', '25deg'],
  });

  const animatedCardStyle = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
  };

  // Like & Pass Badge Opacities
  const likeOpacity = pan.x.interpolate({
    inputRange: [10, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const avatarUrl =
    currentProfile.avatar ||
    (currentProfile.photos && currentProfile.photos.length > 0 ? currentProfile.photos[0].url : '') ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const score = currentProfile.compatibility?.overallScore || 92;

  return (
    <View style={styles.deckContainer}>
      {/* Background Next Card */}
      {nextProfile && (
        <View style={[styles.card, styles.nextCard]}>
          <Image
            source={{
              uri:
                nextProfile.avatar ||
                (nextProfile.photos && nextProfile.photos.length > 0 ? nextProfile.photos[0].url : ''),
            }}
            style={styles.cardImage}
          />
        </View>
      )}

      {/* Interactive Top Card */}
      <Animated.View
        style={[styles.card, animatedCardStyle]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.98}
          onPress={() => onCardPress(currentProfile)}
          style={{ flex: 1 }}
        >
          <Image source={{ uri: avatarUrl }} style={styles.cardImage} />

          {/* LIKE Badge Overlay */}
          <Animated.View style={[styles.badgeOverlay, styles.likeBadge, { opacity: likeOpacity }]}>
            <Text style={styles.likeBadgeText}>LIKE 💕</Text>
          </Animated.View>

          {/* PASS Badge Overlay */}
          <Animated.View style={[styles.badgeOverlay, styles.passBadge, { opacity: passOpacity }]}>
            <Text style={styles.passBadgeText}>PASS ✕</Text>
          </Animated.View>

          {/* Compatibility Score Tag */}
          <View style={styles.topScoreTag}>
            <CompatibilityTag score={score} />
          </View>

          {/* Card Info Drawer Overlay */}
          <View style={styles.cardInfoOverlay}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText}>
                {currentProfile.firstName} {currentProfile.lastName}, {currentProfile.age}
              </Text>
              {currentProfile.verificationBadge && (
                <VerifiedBadge size={18} style={{ marginLeft: 6 }} />
              )}
              {currentProfile.isPremium && (
                <PremiumCrownBadge size={20} style={{ marginLeft: 4 }} />
              )}
            </View>

            <Text style={styles.subInfoText}>
              📍 {currentProfile.city}, {currentProfile.state} • {currentProfile.religion} ({currentProfile.community})
            </Text>

            <Text style={styles.occupationText}>
              💼 {currentProfile.occupation} • 🎓 {currentProfile.degree}
            </Text>

            {currentProfile.about ? (
              <Text style={styles.aboutSnippet} numberOfLines={2}>
                "{currentProfile.about}"
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Swipe Action Controller Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.circleBtn, styles.passBtn]}
          onPress={() => forceSwipe('left')}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 24, color: '#EF4444' }}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.circleBtn, styles.shortlistBtn]}
          onPress={() => onShortlist(currentProfile)}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 22 }}>🤍</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.circleBtn, styles.likeBtn]}
          onPress={() => forceSwipe('right')}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 26, color: '#FFFFFF' }}>💕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  deckContainer: {
    height: 480,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - spacing.lg * 2,
    height: 400,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  nextCard: {
    transform: [{ scale: 0.94 }, { translateY: 15 }],
    opacity: 0.6,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primaryLight,
  },
  badgeOverlay: {
    position: 'absolute',
    top: 24,
    borderWidth: 3,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    zIndex: 10,
  },
  likeBadge: {
    left: 24,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    transform: [{ rotate: '-15deg' }],
  },
  likeBadgeText: {
    color: '#10B981',
    fontSize: 20,
    fontWeight: '900',
  },
  passBadge: {
    right: 24,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    transform: [{ rotate: '15deg' }],
  },
  passBadgeText: {
    color: '#EF4444',
    fontSize: 20,
    fontWeight: '900',
  },
  topScoreTag: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    zIndex: 5,
  },
  cardInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30, 10, 18, 0.86)',
    padding: spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  subInfoText: {
    color: colors.primaryLight,
    fontSize: 12,
    marginTop: 2,
  },
  occupationText: {
    color: '#F8D5DD',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  aboutSnippet: {
    color: '#E0C5CD',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 6,
  },
  actionRow: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  circleBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.elevated,
  },
  passBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  shortlistBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.gold,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  likeBtn: {
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
  },
  emptyContainer: {
    height: 380,
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  resetBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  resetBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
