import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { VerifiedBadge, OnlineBadge, PremiumCrownBadge } from './Badge';
import { colors } from '../../theme/colors';

interface AvatarProps {
  url?: string;
  size?: number;
  isVerified?: boolean;
  isOnline?: boolean;
  isPremium?: boolean;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  url,
  size = 54,
  isVerified = false,
  isOnline,
  isPremium = false,
  style,
}) => {
  const fallbackUrl =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Image
        source={{ uri: url || fallbackUrl }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: isPremium ? colors.gold : colors.primaryLight,
            borderWidth: isPremium ? 2 : 1,
          },
        ]}
      />

      {isVerified && (
        <View style={[styles.badgePos, { bottom: 0, right: 0 }]}>
          <VerifiedBadge size={size * 0.35} />
        </View>
      )}

      {isOnline !== undefined && !isVerified && (
        <View style={[styles.badgePos, { bottom: 0, right: 0 }]}>
          <OnlineBadge isOnline={isOnline} size={size * 0.28} />
        </View>
      )}

      {isPremium && (
        <View style={[styles.badgePos, { top: -2, right: -2 }]}>
          <PremiumCrownBadge size={size * 0.35} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.primaryLight,
  },
  badgePos: {
    position: 'absolute',
  },
});
