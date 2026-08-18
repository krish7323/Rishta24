import { Platform } from 'react-native';

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
};

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

const isWeb = Platform.OS === 'web';

export const shadows = {
  none: isWeb
    ? { boxShadow: 'none' }
    : {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
  soft: isWeb
    ? { boxShadow: '0px 3px 10px rgba(214, 47, 91, 0.08)' }
    : {
        shadowColor: '#D62F5B',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
      },
  card: isWeb
    ? { boxShadow: '0px 4px 12px rgba(50, 24, 32, 0.06)' }
    : {
        shadowColor: '#321820',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
      },
  elevated: isWeb
    ? { boxShadow: '0px 8px 24px rgba(50, 24, 32, 0.12)' }
    : {
        shadowColor: '#321820',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
      },
  gold: isWeb
    ? { boxShadow: '0px 4px 12px rgba(217, 164, 65, 0.25)' }
    : {
        shadowColor: '#D9A441',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
      },
};

