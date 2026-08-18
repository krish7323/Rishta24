import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

export const VerifiedBadge: React.FC<{ size?: number; style?: ViewStyle }> = ({ size = 16, style }) => (
  <View
    style={[
      styles.verifiedBadge,
      { width: size, height: size, borderRadius: size / 2 },
      style,
    ]}
  >
    <Text style={{ color: '#FFFFFF', fontSize: size * 0.65, fontWeight: 'bold' }}>✓</Text>
  </View>
);

export const OnlineBadge: React.FC<{ isOnline?: boolean; size?: number; style?: ViewStyle }> = ({
  isOnline = true,
  size = 12,
  style,
}) => (
  <View
    style={[
      styles.onlineBadge,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: isOnline ? colors.success : colors.textMuted,
      },
      style,
    ]}
  />
);

export const PremiumCrownBadge: React.FC<{ size?: number; style?: ViewStyle }> = ({
  size = 20,
  style,
}) => (
  <View
    style={[
      styles.crownBadge,
      { width: size, height: size, borderRadius: size / 2 },
      style,
    ]}
  >
    <Text style={{ fontSize: size * 0.6 }}>👑</Text>
  </View>
);

export const CompatibilityTag: React.FC<{ score: number; style?: ViewStyle }> = ({
  score,
  style,
}) => (
  <View style={[styles.compatTag, style]}>
    <Text style={[typography.small, styles.compatText]}>✨ {score}% Match</Text>
  </View>
);

const styles = StyleSheet.create({
  verifiedBadge: {
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  onlineBadge: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  crownBadge: {
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  compatTag: {
    backgroundColor: 'rgba(214, 47, 91, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  compatText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
