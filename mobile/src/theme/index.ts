export * from './colors';
export * from './typography';
export * from './spacing';
export * from './dimensions';

import { colors } from './colors';
import { typography } from './typography';
import { spacing, radius, shadows } from './spacing';
import { dimensions } from './dimensions';

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  dimensions,
};

export type Theme = typeof theme;
