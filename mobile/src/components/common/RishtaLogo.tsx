import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  colorMode?: 'light' | 'dark' | 'brand';
  style?: ViewStyle;
}

export const RishtaLogo: React.FC<LogoProps> = ({
  size = 'medium',
  showTagline = true,
  colorMode = 'brand',
  style,
}) => {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const iconSize = isSmall ? 28 : isLarge ? 56 : 40;
  const titleSize = isSmall ? 18 : isLarge ? 32 : 24;
  const taglineSize = isSmall ? 11 : isLarge ? 15 : 13;

  const textColor = colorMode === 'dark' ? '#FFFFFF' : colors.textPrimary;
  const taglineColor = colorMode === 'dark' ? colors.primaryLight : colors.primary;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.logoRow}>
        {/* Connected Twin Hearts SVG Icon */}
        <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100" fill="none">
          <Defs>
            <SvgLinearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#E84C77" />
              <Stop offset="100%" stopColor="#D62F5B" />
            </SvgLinearGradient>
            <SvgLinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F7D070" />
              <Stop offset="100%" stopColor="#D9A441" />
            </SvgLinearGradient>
          </Defs>
          {/* Heart 1 */}
          <Path
            d="M38 24 C28 12, 12 18, 12 34 C12 50, 36 68, 48 76 C49 76.7, 51 76.7, 52 76 C64 68, 88 50, 88 34 C88 18, 72 12, 62 24 C50 38, 50 38, 38 24 Z"
            fill="url(#heartGrad)"
          />
          {/* Golden Ring of Commitment */}
          <Circle
            cx="50"
            cy="46"
            r="16"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Bindu/Sparkle */}
          <Circle cx="50" cy="30" r="3" fill="#FFFDF5" />
        </Svg>

        <View style={styles.textColumn}>
          <View style={styles.titleRow}>
            <Text style={[typography.h1, { fontSize: titleSize, color: textColor }]}>
              Rishta<Text style={{ color: colors.primary }}>24</Text>
            </Text>
          </View>
        </View>
      </View>

      {showTagline && (
        <Text style={[typography.brandTagline, { fontSize: taglineSize, color: taglineColor, marginTop: isLarge ? 4 : 2 }]}>
          Har Rishta, Ek Nayi Shuruaat
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textColumn: {
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
