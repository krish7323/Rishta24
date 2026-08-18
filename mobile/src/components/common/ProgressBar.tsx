import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

interface ProgressBarProps {
  progress: number; // 0 - 100
  label?: string;
  showPercentage?: boolean;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  style,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={[styles.container, style]}>
      {(label || showPercentage) && (
        <View style={styles.labelRow}>
          {label && <Text style={[typography.caption, styles.label]}>{label}</Text>}
          {showPercentage && (
            <Text style={[typography.small, styles.percentage]}>
              {clampedProgress}% Complete
            </Text>
          )}
        </View>
      )}

      <View style={styles.track}>
        <View style={[styles.bar, { width: `${clampedProgress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  percentage: {
    color: colors.primary,
    fontWeight: '700',
  },
  track: {
    height: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
});
