export const colors = {
  primary: '#D62F5B',
  primaryDark: '#B92349',
  primaryLight: '#FCEEF2',
  primarySubtle: '#FFF5F7',
  primaryBorder: '#FAD4DE',
  
  secondary: '#4A1525',
  secondaryLight: '#7C344A',

  background: '#FFF9FA',
  surface: '#FFFFFF',
  surfaceSubtle: '#FCF7F8',
  
  textPrimary: '#321820',
  textSecondary: '#7C6870',
  textMuted: '#A59299',
  textLight: '#FFFFFF',

  border: '#F0E2E6',
  borderLight: '#F7EDF0',
  borderDark: '#D8C7CC',

  gold: '#D9A441',
  goldLight: '#F7D070',
  goldDark: '#B3822B',
  goldBg: '#FFFDF5',

  success: '#36B56A',
  successLight: '#E8F8EE',
  
  warning: '#E9A23B',
  warningLight: '#FDF5E8',

  error: '#D64545',
  errorLight: '#FCECEB',

  overlay: 'rgba(50, 24, 32, 0.45)',
  overlayDark: 'rgba(20, 10, 14, 0.75)',

  gradient: {
    primary: ['#D62F5B', '#E84C77', '#B92349'],
    hero: ['#4A1525', '#7C1F3B', '#D62F5B'],
    gold: ['#D9A441', '#F7D070', '#C6922C'],
    softPink: ['#FFF5F7', '#FFF9FA'],
    cardOverlay: ['transparent', 'rgba(30, 10, 18, 0.85)'],
  },
};

export type ColorTheme = typeof colors;
