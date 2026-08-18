import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { RishtaLogo } from '../../components/common/RishtaLogo';
import { ProfileCard } from '../../components/cards/ProfileCard';
import { MatchCelebrationModal } from '../../components/modals/MatchCelebrationModal';
import { Skeleton, ProfileCardSkeleton } from '../../components/common/SkeletonLoader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { dimensions } from '../../theme/dimensions';
import { useAuthStore } from '../../store/authStore';
import { useSearchStore } from '../../store/searchStore';
import { useMatchStore } from '../../store/matchStore';
import { socketService } from '../../services/socket/socket';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<any>(null);

  const profile = useAuthStore((state) => state.profile);
  const recommendedProfiles = useSearchStore((state) => state.recommendedProfiles);
  const fetchRecommended = useSearchStore((state) => state.fetchRecommended);
  const isLoading = useSearchStore((state) => state.isLoading);
  const sendInterest = useMatchStore((state) => state.sendInterest);
  const toggleShortlist = useMatchStore((state) => state.toggleShortlist);

  useEffect(() => {
    fetchRecommended();
    socketService.connect();
    return () => {
      // Keep alive during navigation
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecommended();
    setRefreshing(false);
  };

  const handleInterest = async (candidate: any) => {
    try {
      const res = await sendInterest(candidate.user?._id || candidate.user, 'Hello, I liked your profile!');
      if (res.isMutualMatch) {
        setMatchedProfile(candidate);
        setMatchModalVisible(true);
      } else {
        Alert.alert('Interest Sent! 💕', `Your interest request was delivered to ${candidate.firstName}.`);
      }
    } catch (err: any) {
      Alert.alert('Notice', err.response?.data?.message || 'Interest sent successfully!');
    }
  };

  const handleShortlist = async (candidate: any) => {
    try {
      const isShort = await toggleShortlist(candidate.user?._id || candidate.user);
      Alert.alert('Shortlist', isShort ? `${candidate.firstName} added to your shortlist.` : `${candidate.firstName} removed from shortlist.`);
    } catch {
      // ignore
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.menuIconBtn} onPress={() => navigation.navigate('Settings')}>
          <Text style={{ fontSize: 20 }}>☰</Text>
        </TouchableOpacity>

        <RishtaLogo size="small" showTagline={false} />

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={{ fontSize: 19 }}>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* Hero Banner with Couple */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <View style={styles.trustedBadge}>
              <Text style={styles.trustedText}>🛡️ TRUSTED BY MILLIONS</Text>
            </View>
            <Text style={[typography.h2, styles.heroTitle]}>
              Find Your Perfect{'\n'}Life Partner
            </Text>
            <Text style={[typography.caption, styles.heroSubtitle]}>
              100% verified matrimonial profiles across India
            </Text>

            <TouchableOpacity
              style={styles.heroCtaBtn}
              onPress={() => navigation.navigate('SearchTab')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroCtaText}>Explore Matches →</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=500&q=80',
            }}
            style={styles.heroImage}
          />
        </View>

        {/* Quick Action Shortcuts Grid */}
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('SearchTab')}
          >
            <View style={[styles.quickActionIconCircle, { backgroundColor: '#FCEEF2' }]}>
              <Text style={{ fontSize: 22 }}>🔍</Text>
            </View>
            <Text style={styles.quickActionLabel}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('MatchesTab')}
          >
            <View style={[styles.quickActionIconCircle, { backgroundColor: '#FFF5E6' }]}>
              <Text style={{ fontSize: 22 }}>💕</Text>
            </View>
            <Text style={styles.quickActionLabel}>Matches</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('Premium')}
          >
            <View style={[styles.quickActionIconCircle, { backgroundColor: '#FFFBEB' }]}>
              <Text style={{ fontSize: 22 }}>👑</Text>
            </View>
            <Text style={styles.quickActionLabel}>Premium</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('Visitors')}
          >
            <View style={[styles.quickActionIconCircle, { backgroundColor: '#EDFDF5' }]}>
              <Text style={{ fontSize: 22 }}>👀</Text>
            </View>
            <Text style={styles.quickActionLabel}>Visitors</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Profiles Section */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={[typography.h2, styles.sectionTitle]}>Recommended For You</Text>
            <Text style={[typography.caption, styles.sectionSubtitle]}>
              Handpicked profiles aligned with your partner preferences
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('SearchTab')}>
            <Text style={[typography.caption, styles.seeAllText]}>See All →</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.xl }}>
            <View style={{ width: dimensions.cardWidthLarge, marginRight: spacing.md }}>
              <ProfileCardSkeleton />
            </View>
            <View style={{ width: dimensions.cardWidthLarge }}>
              <ProfileCardSkeleton />
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalCardList}
          >
            {recommendedProfiles.map((item) => (
              <ProfileCard
                key={item._id}
                profile={item}
                variant="recommended"
                onPress={() =>
                  navigation.navigate('ProfileDetail', {
                    profileId: typeof item.user === 'object' ? (item.user as any)?._id : item.user,
                    initialProfile: item,
                  })
                }
                onSendInterest={() => handleInterest(item)}
                onShortlistToggle={() => handleShortlist(item)}
              />
            ))}
          </ScrollView>
        )}

        {/* Why Choose Rishta24 Trust Section */}
        <View style={styles.trustSection}>
          <Text style={[typography.h2, styles.trustTitle]}>Why Choose Rishta24?</Text>
          <Text style={[typography.caption, styles.trustSubtitle]}>
            Dedicated to creating meaningful, lifelong bonds
          </Text>

          <View style={styles.trustGrid}>
            <View style={styles.trustCard}>
              <Text style={styles.trustIcon}>🛡️</Text>
              <Text style={[typography.h3, styles.trustCardTitle]}>100% Verified Profiles</Text>
              <Text style={[typography.caption, styles.trustCardDesc]}>
                Every profile is verified via Govt ID and contact verification.
              </Text>
            </View>

            <View style={styles.trustCard}>
              <Text style={styles.trustIcon}>🔒</Text>
              <Text style={[typography.h3, styles.trustCardTitle]}>Safe & Private</Text>
              <Text style={[typography.caption, styles.trustCardDesc]}>
                Full control over photo visibility, contact details, and messaging.
              </Text>
            </View>

            <View style={styles.trustCard}>
              <Text style={styles.trustIcon}>✨</Text>
              <Text style={[typography.h3, styles.trustCardTitle]}>Smart Matchmaking</Text>
              <Text style={[typography.caption, styles.trustCardDesc]}>
                AI compatibility scoring covering education, values, and lifestyle.
              </Text>
            </View>

            <View style={styles.trustCard}>
              <Text style={styles.trustIcon}>👨‍👩‍👧‍👦</Text>
              <Text style={[typography.h3, styles.trustCardTitle]}>Family Connections</Text>
              <Text style={[typography.caption, styles.trustCardDesc]}>
                Built for traditional Indian values and modern lifestyle harmony.
              </Text>
            </View>
          </View>
        </View>

        {/* Success Stories Banner */}
        <View style={styles.successCard}>
          <Text style={{ fontSize: 28, marginBottom: 4 }}>🌹</Text>
          <Text style={[typography.h3, { color: colors.textPrimary, textAlign: 'center' }]}>
            Over 500,000+ Happy Marriages
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>
            “We connected on Rishta24 and knew we were meant to be. Our families met the next week!”
          </Text>
          <Text style={[typography.small, { color: colors.primary, fontWeight: '700', marginTop: 8 }]}>
            — Neha & Siddharth (Married Nov 2025)
          </Text>
        </View>
      </ScrollView>

      {/* Match Celebration Modal */}
      {matchedProfile && (
        <MatchCelebrationModal
          visible={matchModalVisible}
          partnerName={matchedProfile.firstName}
          partnerAvatarUrl={matchedProfile.avatar}
          myAvatarUrl={profile?.avatar}
          onStartChat={() => {
            setMatchModalVisible(false);
            navigation.navigate('Chat', {
              partnerProfile: matchedProfile,
            });
          }}
          onClose={() => setMatchModalVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  heroBanner: {
    flexDirection: 'row',
    backgroundColor: '#4A1525',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    minHeight: 180,
    ...shadows.elevated,
  },
  heroContent: {
    flex: 1.2,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  trustedBadge: {
    backgroundColor: 'rgba(214, 47, 91, 0.4)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  trustedText: {
    color: '#FFD4E0',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    lineHeight: 25,
    fontFamily: 'serif',
  },
  heroSubtitle: {
    color: '#F8D5DD',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  heroCtaBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.xl,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    ...shadows.soft,
  },
  heroCtaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  heroImage: {
    flex: 0.8,
    height: '100%',
    backgroundColor: colors.secondaryLight,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xl,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  quickActionItem: {
    alignItems: 'center',
  },
  quickActionIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '700',
  },
  horizontalCardList: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
    marginBottom: spacing.xl,
  },
  trustSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  trustTitle: {
    textAlign: 'center',
    fontSize: 20,
  },
  trustSubtitle: {
    textAlign: 'center',
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  trustCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    width: '47.5%',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  trustIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  trustCardTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  trustCardDesc: {
    lineHeight: 16,
    fontSize: 11,
  },
  successCard: {
    backgroundColor: colors.primaryLight,
    marginHorizontal: spacing.lg,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
});
