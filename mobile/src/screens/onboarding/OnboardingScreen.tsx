import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  highlights: string[];
}

const slides: Slide[] = [
  {
    id: '1',
    emoji: '💍',
    title: 'Why Choose Rishta24?',
    subtitle: 'India’s most trusted matrimonial platform uniting families with dignity.',
    highlights: ['🛡️ 100% Verified Profiles', '🔒 Safe & Privacy First', '👨‍👩‍👧‍👦 Family-Friendly Matching'],
  },
  {
    id: '2',
    emoji: '📝',
    title: 'Create Your Profile',
    subtitle: 'Share your background, aspirations, family values, and lifestyle.',
    highlights: ['✨ 10-Step Guided Flow', '📸 Private Photo Gallery', '🔍 Detailed Partner Preferences'],
  },
  {
    id: '3',
    emoji: '✨',
    title: 'Smart Compatibility Match',
    subtitle: 'Our multi-factor matching engine finds partners genuinely aligned with you.',
    highlights: ['🎯 Multi-Factor Scoring', '🕉️ Horoscope & Kundali Matching', '📍 Community & City Filters'],
  },
  {
    id: '4',
    emoji: '💬',
    title: 'Connect & Chat Privately',
    subtitle: 'Send instant interests, chat securely, and share contact details when ready.',
    highlights: ['💌 Express Interest in 1-Click', '💬 Real-Time Direct Messaging', '📞 Secure Contact Requests'],
  },
  {
    id: '5',
    emoji: '❤️',
    title: 'Begin Your Journey',
    subtitle: 'Join millions of happy couples who found their soulmate on Rishta24.',
    highlights: ['🌹 Har Rishta, Ek Nayi Shuruaat', '🏆 24/7 Safety Assistance', '🌟 Premium VIP Privileges'],
  },
];

export const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const setIsOnboarded = useAuthStore((state) => state.setIsOnboarded);

  const handleFinish = () => {
    setIsOnboarded(true);
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (isAuthenticated) {
      navigation.replace('Main');
    } else {
      navigation.replace('Auth');
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      try {
        flatListRef.current?.scrollToOffset({ offset: nextIndex * width, animated: true });
      } catch {
        flatListRef.current?.scrollToIndex({ index: nextIndex });
      }
    } else {
      handleFinish();
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleFinish}>
          <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.emojiCircle}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>

            <Text style={[typography.h1, styles.title]}>{item.title}</Text>
            <Text style={[typography.bodySecondary, styles.subtitle]}>{item.subtitle}</Text>

            <View style={styles.highlightCard}>
              {item.highlights.map((h: string, i: number) => (
                <Text key={i} style={[typography.bodyMedium, styles.highlightText]}>
                  {h}
                </Text>
              ))}
            </View>
          </View>
        )}
      />

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentIndex === i ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <Button
          title={currentIndex === slides.length - 1 ? "Let's Begin 🌹" : 'Continue →'}
          onPress={handleNext}
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
  },
  emojiCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 50,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  highlightCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  highlightText: {
    color: colors.textPrimary,
  },
  footer: {
    padding: spacing.xl,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: colors.borderDark,
  },
});
