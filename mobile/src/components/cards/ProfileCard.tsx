import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { IProfile } from '../../types/models';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { dimensions } from '../../theme/dimensions';
import { VerifiedBadge, OnlineBadge, PremiumCrownBadge, CompatibilityTag } from '../common/Badge';

export type CardVariant =
  | 'recommended'
  | 'large'
  | 'compact'
  | 'match'
  | 'visitor'
  | 'searchResult'
  | 'horizontal';

interface ProfileCardProps {
  profile: IProfile;
  variant?: CardVariant;
  onPress?: () => void;
  onSendInterest?: () => void;
  onShortlistToggle?: () => void;
  onChat?: () => void;
  isShortlisted?: boolean;
  visitorTimestamp?: string;
  style?: ViewStyle;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  variant = 'large',
  onPress,
  onSendInterest,
  onShortlistToggle,
  onChat,
  isShortlisted = false,
  visitorTimestamp,
  style,
}) => {
  const avatarUrl =
    profile.avatar ||
    (profile.photos && profile.photos.length > 0 ? profile.photos[0].url : '') ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const score = profile.compatibility?.overallScore || 88;

  // 1. RECOMMENDED VARIANT (Used on Home Screen Horizontal Slider)
  if (variant === 'recommended') {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.recommendedCard, style]}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: avatarUrl }} style={styles.recommendedImage} />
          
          {/* Compatibility score pill */}
          <View style={styles.scorePill}>
            <Text style={styles.scoreText}>✨ {score}% Match</Text>
          </View>

          {/* Shortlist heart button */}
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={onShortlistToggle}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 18 }}>{isShortlisted ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>

          {/* Online Indicator */}
          {profile.isOnline && (
            <View style={styles.onlineDotContainer}>
              <OnlineBadge isOnline={true} size={10} />
            </View>
          )}
        </View>

        <View style={styles.recommendedContent}>
          <View style={styles.nameRow}>
            <Text style={[typography.h3, styles.nameText]} numberOfLines={1}>
              {profile.firstName} {profile.lastName?.charAt(0)}.
            </Text>
            {profile.verificationBadge && <VerifiedBadge size={15} style={{ marginLeft: 4 }} />}
            {profile.isPremium && <PremiumCrownBadge size={16} style={{ marginLeft: 2 }} />}
          </View>

          <Text style={[typography.caption, styles.subtitleText]} numberOfLines={1}>
            {profile.age} yrs • {profile.height} cm • {profile.city}
          </Text>

          <Text style={[typography.small, styles.professionText]} numberOfLines={1}>
            💼 {profile.occupation}
          </Text>

          {onSendInterest && (
            <TouchableOpacity
              style={styles.interestBtn}
              onPress={onSendInterest}
              activeOpacity={0.85}
            >
              <Text style={styles.interestBtnText}>Connect 💕</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // 2. COMPACT VARIANT (Used in 2-Column Grid Discovery)
  if (variant === 'compact') {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.compactCard, style]}
      >
        <Image source={{ uri: avatarUrl }} style={styles.compactImage} />
        <View style={styles.compactOverlay}>
          <View style={styles.nameRow}>
            <Text style={styles.compactName} numberOfLines={1}>
              {profile.firstName}, {profile.age}
            </Text>
            {profile.verificationBadge && <VerifiedBadge size={13} style={{ marginLeft: 3 }} />}
          </View>
          <Text style={styles.compactLocation} numberOfLines={1}>
            📍 {profile.city}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // 3. VISITOR VARIANT
  if (variant === 'visitor') {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.visitorCard, style]}
      >
        <Image source={{ uri: avatarUrl }} style={styles.visitorAvatar} />
        <View style={styles.visitorInfo}>
          <View style={styles.nameRow}>
            <Text style={[typography.h3, { fontSize: 16 }]} numberOfLines={1}>
              {profile.firstName} {profile.lastName}
            </Text>
            {profile.verificationBadge && <VerifiedBadge size={14} style={{ marginLeft: 4 }} />}
          </View>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {profile.age} yrs • {profile.city} • {profile.occupation}
          </Text>
          {visitorTimestamp && (
            <Text style={[typography.small, { color: colors.textMuted, marginTop: 2 }]}>
              Viewed {visitorTimestamp}
            </Text>
          )}
        </View>
        {onSendInterest && (
          <TouchableOpacity
            style={styles.compactConnectBtn}
            onPress={onSendInterest}
            activeOpacity={0.8}
          >
            <Text style={styles.compactConnectText}>Connect</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  // 4. LARGE / SEARCH RESULT / DEFAULT FEED VARIANT
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={[styles.largeCard, style]}
    >
      <View style={styles.largeImageWrapper}>
        <Image source={{ uri: avatarUrl }} style={styles.largeImage} />
        
        {/* Floating Top Badges */}
        <View style={styles.largeTopRow}>
          <CompatibilityTag score={score} />
          <TouchableOpacity
            style={styles.largeHeartBtn}
            onPress={onShortlistToggle}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 20 }}>{isShortlisted ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Gradient Overlay Details */}
        <View style={styles.largeImageBottom}>
          <View style={styles.nameRow}>
            <Text style={styles.largeName}>
              {profile.firstName} {profile.lastName}, {profile.age}
            </Text>
            {profile.verificationBadge && <VerifiedBadge size={18} style={{ marginLeft: 6 }} />}
            {profile.isPremium && <PremiumCrownBadge size={20} style={{ marginLeft: 4 }} />}
          </View>
          <Text style={styles.largeLocation}>
            📍 {profile.city}, {profile.state} • {profile.religion} ({profile.community})
          </Text>
        </View>
      </View>

      <View style={styles.largeBody}>
        <View style={styles.attributeGrid}>
          <View style={styles.attrItem}>
            <Text style={styles.attrEmoji}>🎓</Text>
            <Text style={styles.attrText} numberOfLines={1}>{profile.degree}</Text>
          </View>
          <View style={styles.attrItem}>
            <Text style={styles.attrEmoji}>💼</Text>
            <Text style={styles.attrText} numberOfLines={1}>{profile.occupation}</Text>
          </View>
          <View style={styles.attrItem}>
            <Text style={styles.attrEmoji}>💰</Text>
            <Text style={styles.attrText} numberOfLines={1}>{profile.incomeRange || '₹15 - 25 Lakhs'}</Text>
          </View>
          <View style={styles.attrItem}>
            <Text style={styles.attrEmoji}>🥗</Text>
            <Text style={styles.attrText} numberOfLines={1}>{profile.diet}</Text>
          </View>
        </View>

        {profile.about ? (
          <Text style={[typography.bodySecondary, styles.aboutPreview]} numberOfLines={2}>
            "{profile.about}"
          </Text>
        ) : null}

        {/* Action Button Row */}
        <View style={styles.largeActionRow}>
          {onChat && (
            <TouchableOpacity style={styles.chatActionBtn} onPress={onChat} activeOpacity={0.85}>
              <Text style={styles.chatActionText}>💬 Chat</Text>
            </TouchableOpacity>
          )}

          {onSendInterest && (
            <TouchableOpacity
              style={styles.sendInterestActionBtn}
              onPress={onSendInterest}
              activeOpacity={0.85}
            >
              <Text style={styles.sendInterestActionText}>Send Interest 💕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Recommended Slider Card
  recommendedCard: {
    width: dimensions.cardWidthLarge,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    marginRight: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  imageContainer: {
    width: '100%',
    height: 190,
    position: 'relative',
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primaryLight,
  },
  scorePill: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(214, 47, 91, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heartBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  onlineDotContainer: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
  },
  recommendedContent: {
    padding: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitleText: {
    marginTop: 2,
    color: colors.textSecondary,
  },
  professionText: {
    marginTop: 4,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  interestBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  interestBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Compact Grid Card
  compactCard: {
    width: dimensions.cardWidthCompact,
    height: 180,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    position: 'relative',
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(50, 24, 32, 0.75)',
    padding: spacing.sm,
  },
  compactName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  compactLocation: {
    color: colors.primaryLight,
    fontSize: 11,
    marginTop: 1,
  },

  // Visitor Card
  visitorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  visitorAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primaryLight,
    marginRight: spacing.md,
  },
  visitorInfo: {
    flex: 1,
  },
  compactConnectBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  compactConnectText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  // Large Feed Card
  largeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    marginBottom: spacing.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  largeImageWrapper: {
    height: 280,
    width: '100%',
    position: 'relative',
  },
  largeImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primaryLight,
  },
  largeTopRow: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  largeHeartBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  largeImageBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30, 10, 18, 0.82)',
    padding: spacing.lg,
  },
  largeName: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },
  largeLocation: {
    color: colors.primaryLight,
    fontSize: 13,
    marginTop: 3,
  },
  largeBody: {
    padding: spacing.lg,
  },
  attributeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  attrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: '48%',
  },
  attrEmoji: {
    fontSize: 13,
    marginRight: 4,
  },
  attrText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  aboutPreview: {
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  largeActionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  chatActionBtn: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatActionText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  sendInterestActionBtn: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  sendInterestActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
