import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const dimensions = {
  windowWidth: width,
  windowHeight: height,
  isSmallDevice: width < 375,
  isTablet: width >= 768,
  cardWidthCompact: width * 0.44,
  cardWidthLarge: width * 0.76,
  cardWidthFull: width - 32,
  headerHeight: Platform.OS === 'ios' ? 44 : 56,
  bottomBarHeight: 64,
};
