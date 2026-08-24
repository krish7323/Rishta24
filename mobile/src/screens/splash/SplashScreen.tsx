import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { RishtaLogo } from '../../components/common/RishtaLogo';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const isOnboarded = useAuthStore((state) => state.isOnboarded);

  const useNative = Platform.OS !== 'web';

  useEffect(() => {
    // Smooth logo entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: useNative,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: useNative,
      }),
    ]).start();

    const init = async () => {
      const isRestored = await restoreSession();
      setTimeout(() => {
        if (isRestored) {
          navigation.replace('Main');
        } else if (isOnboarded) {
          navigation.replace('Auth');
        } else {
          navigation.replace('Onboarding');
        }
      }, 1200);
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <RishtaLogo size="large" showTagline={true} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
