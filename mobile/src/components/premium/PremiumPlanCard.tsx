import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';

export interface PlanItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  durationDays: number;
  isPopular?: boolean;
  isBestValue?: boolean;
  badge?: string;
  features: string[];
}

interface PremiumPlanCardProps {
  plan: PlanItem;
  isSelected: boolean;
  onSelect: () => void;
  style?: ViewStyle;
}

export const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({
  plan,
  isSelected,
  onSelect,
  style,
}) => {
  const isHighlight = plan.isPopular || plan.isBestValue;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onSelect}
      style={[
        styles.card,
        isHighlight && styles.highlightBorder,
        isSelected && styles.selectedCard,
        style,
      ]}
    >
      {plan.badge && (
        <View style={styles.badgeBanner}>
          <Text style={styles.badgeText}>{plan.badge}</Text>
        </View>
      )}

      <View style={styles.header}>
        <View>
          <Text style={[typography.h3, styles.planName]}>{plan.name}</Text>
          <Text style={[typography.caption, styles.tagline]}>{plan.tagline}</Text>
        </View>

        <View style={styles.radioCircle}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.currency}>₹</Text>
        <Text style={styles.price}>{plan.price.toLocaleString('en-IN')}</Text>
        {plan.originalPrice && (
          <Text style={styles.originalPrice}>₹{plan.originalPrice.toLocaleString('en-IN')}</Text>
        )}
        {plan.discountPercentage && (
          <View style={styles.discountPill}>
            <Text style={styles.discountText}>{plan.discountPercentage}% OFF</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.featureList}>
        {plan.features.map((feature, idx) => (
          <View key={idx} style={styles.featureItem}>
            <Text style={styles.checkIcon}>✓</Text>
            <Text style={[typography.caption, styles.featureText]}>{feature}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    position: 'relative',
    ...shadows.card,
  },
  highlightBorder: {
    borderColor: colors.gold,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySubtle,
  },
  badgeBanner: {
    position: 'absolute',
    top: -12,
    right: spacing.xl,
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
    ...shadows.gold,
  },
  badgeText: {
    color: '#3B2904',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planName: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  tagline: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.md,
    gap: 4,
  },
  currency: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  originalPrice: {
    fontSize: 16,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
  discountPill: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginLeft: spacing.xs,
  },
  discountText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  featureList: {
    gap: spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    color: colors.success,
    fontWeight: 'bold',
    marginRight: spacing.sm,
    fontSize: 14,
  },
  featureText: {
    color: colors.textPrimary,
  },
});
