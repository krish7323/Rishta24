import { TextStyle, Platform } from 'react-native';
import { colors } from './colors';

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

const sansFont = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'sans-serif',
});

export const typography: Record<string, TextStyle> = {
  display: {
    fontFamily: serifFont,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontFamily: serifFont,
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    fontWeight: '500',
    color: colors.primary,
    letterSpacing: 0.2,
  },
  h1: {
    fontFamily: serifFont,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: sansFont,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: sansFont,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  body: {
    fontFamily: sansFont,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  bodyMedium: {
    fontFamily: sansFont,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  bodySecondary: {
    fontFamily: sansFont,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  caption: {
    fontFamily: sansFont,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  button: {
    fontFamily: sansFont,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.textLight,
    letterSpacing: 0.3,
  },
  label: {
    fontFamily: sansFont,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  small: {
    fontFamily: sansFont,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
};
