import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';

interface Particle {
  id: number;
  symbol: string;
  angle: number;
  distance: number;
  size: number;
}

interface HeartParticleBurstProps {
  variant?: 'classic' | 'gold';
}

const PARTICLES: Particle[] = [
  { id: 1, symbol: '❤️', angle: 0, distance: 90, size: 20 },
  { id: 2, symbol: '💖', angle: 45, distance: 110, size: 24 },
  { id: 3, symbol: '✨', angle: 90, distance: 85, size: 18 },
  { id: 4, symbol: '🌸', angle: 135, distance: 105, size: 22 },
  { id: 5, symbol: '💕', angle: 180, distance: 95, size: 20 },
  { id: 6, symbol: '🌟', angle: 225, distance: 115, size: 22 },
  { id: 7, symbol: '💗', angle: 270, distance: 80, size: 19 },
  { id: 8, symbol: '✨', angle: 315, distance: 100, size: 18 },
];

export const HeartParticleBurst: React.FC<HeartParticleBurstProps> = ({ variant = 'classic' }) => {
  const animValues = useRef(PARTICLES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animValues.map((val) =>
      Animated.timing(val, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      })
    );
    Animated.stagger(40, animations).start();
  }, [animValues]);

  return (
    <View style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}>

      {PARTICLES.map((particle, index) => {
        const anim = animValues[index];
        const rad = (particle.angle * Math.PI) / 180;
        const translateX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(rad) * particle.distance],
        });
        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(rad) * particle.distance],
        });
        const scale = anim.interpolate({
          inputRange: [0, 0.4, 1],
          outputRange: [0.2, 1.2, 0.8],
        });
        const opacity = anim.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [0, 1, 0],
        });
        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${particle.angle % 2 === 0 ? 45 : -45}deg`],
        });

        const symbol = variant === 'gold' && particle.symbol === '❤️' ? '👑' : particle.symbol;

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                transform: [{ translateX }, { translateY }, { scale }, { rotate }],
                opacity,
              },
            ]}
          >
            <Text style={{ fontSize: particle.size }}>{symbol}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -12,
    marginTop: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
