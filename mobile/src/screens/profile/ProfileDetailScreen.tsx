import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { VerifiedBadge, OnlineBadge, PremiumCrownBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { profileApi, matchApi, generalApi } from '../../services/api';
import { useMatchStore } from '../../store/matchStore';
import { AstroMatchModal } from '../../components/modals/AstroMatchModal';

const { width } = Dimensions.get('window');

export const ProfileDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { profileId, initialProfile } = route.params || {};
  const [profile, setProfile] = useState<any>(initialProfile || null);
  const [compatibility, setCompatibility] = useState<any>(initialProfile?.compatibility || null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [astroModalVisible, setAstroModalVisible] = useState(false);

  const [isShortlisted, setIsShortlisted] = useState(false);

  const sendInterest = useMatchStore((state) => state.sendInterest);
  const toggleShortlist = useMatchStore((state) => state.toggleShortlist);

  useEffect(() => {
    if (profileId) {
      profileApi.getProfileById(profileId).then((res: any) => {
        setProfile(res.data.profile);
        if (res.data.compatibility) {
          setCompatibility(res.data.compatibility);
        }
      });
    }
  }, [profileId]);

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={typography.bodySecondary}>Loading profile details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const photos =
    profile.photos && profile.photos.length > 0
      ? profile.photos.map((p: any) => p.url || p)
      : [profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'];

  const score = compatibility?.overallScore || 92;

  const handleSendInterest = async () => {
    try {
      const res = await sendInterest(profile.user?._id || profile.user);
      Alert.alert(
        res.isMutualMatch ? "It's a Match! 🎉" : 'Interest Sent! 💕',
        res.isMutualMatch
          ? 'You and this member have both expressed interest! You can now start chatting.'
          : `Your interest was sent to ${profile.firstName}.`
      );
    } catch (err: any) {
      Alert.alert('Notice', err.response?.data?.message || 'Interest sent successfully!');
    }
  };

  const handleToggleShortlist = async () => {
    try {
      const isShort = await toggleShortlist(profile.user?._id || profile.user);
      setIsShortlisted(isShort);
      Alert.alert('Shortlist', isShort ? 'Profile saved to your shortlist.' : 'Profile removed from shortlist.');
    } catch {
      // ignore
    }
  };

  const handleReportOrBlock = () => {
    Alert.alert('Safety & Privacy', `Take action for ${profile.firstName}'s profile:`, [
      {
        text: 'Report Inappropriate Profile 🚨',
        onPress: () => {
          generalApi.reportUser({
            reportedUserId: profile.user?._id || profile.user,
            reason: 'INAPPROPRIATE_CONTENT',
            description: 'Reported via profile details screen',
          });
          Alert.alert('Report Submitted', 'Our safety team has received your report.');
        },
        style: 'destructive',
      },
      {
        text: 'Block User 🚫',
        onPress: () => {
          generalApi.blockUser(profile.user?._id || profile.user);
          Alert.alert('User Blocked', 'This profile has been blocked.');
          navigation.goBack();
        },
        style: 'destructive',
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Floating Nav */}
      <View style={styles.topNavBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navIconBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>

        <View style={styles.navActions}>
          <TouchableOpacity onPress={handleReportOrBlock} style={styles.navIconBtn}>
            <Text style={{ fontSize: 20 }}>🛡️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Share', `Share ${profile.firstName}'s profile with your family.`)}
            style={styles.navIconBtn}
          >
            <Text style={{ fontSize: 20 }}>↗️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Swipeable Photo Gallery Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / width);
              setActivePhotoIdx(idx);
            }}
          >
            {photos.map((url: string, i: number) => (
              <Image key={i} source={{ uri: url }} style={styles.carouselImage} />
            ))}
          </ScrollView>

          {/* Photo Counter Pill */}
          <View style={styles.photoCountPill}>
            <Text style={styles.photoCountText}>
              📷 {activePhotoIdx + 1}/{photos.length}
            </Text>
          </View>
        </View>

        {/* Profile Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.nameRow}>
            <Text style={[typography.h1, styles.nameText]}>
              {profile.firstName} {profile.lastName}
            </Text>
            {profile.verificationBadge && <VerifiedBadge size={20} style={{ marginLeft: 6 }} />}
            {profile.isPremium && <PremiumCrownBadge size={22} style={{ marginLeft: 4 }} />}
          </View>

          <Text style={[typography.bodySecondary, styles.locationSubtitle]}>
            📍 {profile.city}, {profile.state}, {profile.country || 'India'}
          </Text>

          {/* Compatibility Breakdown Bar */}
          <View style={styles.compatibilityBox}>
            <View style={styles.compHeaderRow}>
              <Text style={[typography.caption, { fontWeight: '700', color: colors.primaryDark }]}>
                ✨ Compatibility Match
              </Text>
              <Text style={[typography.h3, { color: colors.primary, fontWeight: '800' }]}>
                {score}% Match
              </Text>
            </View>
            <View style={styles.compTrack}>
              <View style={[styles.compBar, { width: `${score}%` }]} />
            </View>
            {compatibility?.matchedCriteria && compatibility.matchedCriteria.length > 0 && (
              <Text style={[typography.small, { color: colors.textSecondary, marginTop: 4 }]}>
                Matched: {compatibility.matchedCriteria.slice(0, 3).join(' • ')}
              </Text>
            )}

            <TouchableOpacity
              style={styles.astroReportBtn}
              onPress={() => setAstroModalVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.astroReportText}>🕉️ View 36-Guna Astro Kundali Report →</Text>
            </TouchableOpacity>
          </View>


          {/* Quick Highlight Grid */}
          <View style={styles.quickGrid}>
            <View style={styles.quickGridItem}>
              <Text style={styles.gridEmoji}>🎂</Text>
              <Text style={styles.gridVal}>{profile.age} Years</Text>
              <Text style={styles.gridLabel}>Age</Text>
            </View>
            <View style={styles.quickGridItem}>
              <Text style={styles.gridEmoji}>📏</Text>
              <Text style={styles.gridVal}>{profile.height} cm</Text>
              <Text style={styles.gridLabel}>Height</Text>
            </View>
            <View style={styles.quickGridItem}>
              <Text style={styles.gridEmoji}>🕉️</Text>
              <Text style={styles.gridVal} numberOfLines={1}>{profile.religion}</Text>
              <Text style={styles.gridLabel}>{profile.community || 'Community'}</Text>
            </View>
            <View style={styles.quickGridItem}>
              <Text style={styles.gridEmoji}>🗣️</Text>
              <Text style={styles.gridVal} numberOfLines={1}>{profile.motherTongue}</Text>
              <Text style={styles.gridLabel}>Mother Tongue</Text>
            </View>
          </View>
        </View>

        {/* About Me Section */}
        {profile.about ? (
          <View style={styles.detailSection}>
            <Text style={[typography.h3, styles.sectionHeading]}>About Me</Text>
            <Text style={[typography.body, styles.aboutText]}>{profile.about}</Text>
          </View>
        ) : null}

        {/* Education & Career */}
        <View style={styles.detailSection}>
          <Text style={[typography.h3, styles.sectionHeading]}>Education & Career</Text>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Highest Degree</Text>
            <Text style={styles.attrValue}>{profile.degree || profile.educationLevel}</Text>
          </View>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Occupation</Text>
            <Text style={styles.attrValue}>{profile.occupation}</Text>
          </View>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Annual Income</Text>
            <Text style={styles.attrValue}>{profile.incomeRange || '₹20 - 35 Lakhs'}</Text>
          </View>
        </View>

        {/* Family Details */}
        <View style={styles.detailSection}>
          <Text style={[typography.h3, styles.sectionHeading]}>Family Details</Text>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Family Type</Text>
            <Text style={styles.attrValue}>{profile.familyType || 'Nuclear Family'}</Text>
          </View>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Father's Occupation</Text>
            <Text style={styles.attrValue}>{profile.fatherOccupation || 'Professional'}</Text>
          </View>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Mother's Occupation</Text>
            <Text style={styles.attrValue}>{profile.motherOccupation || 'Homemaker'}</Text>
          </View>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Family Values</Text>
            <Text style={styles.attrValue}>{profile.familyValues || 'Moderate'}</Text>
          </View>
        </View>

        {/* Astro / Kundali Information */}
        <View style={styles.detailSection}>
          <Text style={[typography.h3, styles.sectionHeading]}>Astro / Kundali Details</Text>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Manglik / Chevvai</Text>
            <Text style={styles.attrValue}>{profile.manglik || 'Non-Manglik'}</Text>
          </View>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Caste / Subcaste</Text>
            <Text style={styles.attrValue}>{profile.caste || profile.community || 'Not specified'}</Text>
          </View>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Gotra</Text>
            <Text style={styles.attrValue}>{profile.gotra || 'Self / Family specified'}</Text>
          </View>
        </View>

        {/* Lifestyle & Interests */}
        <View style={styles.detailSection}>
          <Text style={[typography.h3, styles.sectionHeading]}>Lifestyle & Habits</Text>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Diet</Text>
            <Text style={styles.attrValue}>{profile.diet}</Text>
          </View>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Smoking</Text>
            <Text style={styles.attrValue}>{profile.smoking || 'No'}</Text>
          </View>
          <View style={styles.attrRow}>
            <Text style={styles.attrTitle}>Drinking</Text>
            <Text style={styles.attrValue}>{profile.drinking || 'No'}</Text>
          </View>
          {profile.hobbies && profile.hobbies.length > 0 && (
            <View style={{ marginTop: spacing.sm }}>
              <Text style={[typography.caption, { fontWeight: '700', marginBottom: spacing.xs }]}>
                Hobbies & Passions
              </Text>
              <View style={styles.tagWrap}>
                {profile.hobbies.map((h: string, i: number) => (
                  <View key={i} style={styles.hobbyTag}>
                    <Text style={styles.hobbyTagText}>{h}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={styles.floatingActionBar}>
        <TouchableOpacity
          style={styles.actionHeartBtn}
          onPress={handleToggleShortlist}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 22 }}>{isShortlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionChatBtn}
          onPress={() =>
            navigation.navigate('Chat', {
              partnerProfile: profile,
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.actionChatText}>💬 Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionInterestBtn}
          onPress={handleSendInterest}
          activeOpacity={0.85}
        >
          <Text style={styles.actionInterestText}>Send Interest 💕</Text>
        </TouchableOpacity>
      </View>

      <AstroMatchModal
        visible={astroModalVisible}
        partnerName={profile?.firstName || 'Candidate'}
        onClose={() => setAstroModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  astroReportBtn: {
    marginTop: spacing.sm,
    backgroundColor: '#FFFBEB',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  astroReportText: {
    color: '#7A5B1E',
    fontSize: 12,
    fontWeight: '700',
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topNavBar: {
    position: 'absolute',
    top: 40,
    left: spacing.md,
    right: spacing.md,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navIconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  navActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  carouselContainer: {
    width,
    height: 380,
    position: 'relative',
  },
  carouselImage: {
    width,
    height: 380,
    backgroundColor: colors.primaryLight,
  },
  photoCountPill: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(50, 24, 32, 0.75)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  identityCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    marginTop: -24,
    padding: spacing.xl,
    ...shadows.card,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  locationSubtitle: {
    marginTop: 2,
    color: colors.textSecondary,
  },
  compatibilityBox: {
    backgroundColor: colors.primarySubtle,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  compHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compTrack: {
    height: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    marginVertical: spacing.xs,
    overflow: 'hidden',
  },
  compBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  quickGridItem: {
    alignItems: 'center',
    flex: 1,
  },
  gridEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  gridVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  gridLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  detailSection: {
    backgroundColor: colors.surface,
    marginTop: spacing.md,
    padding: spacing.xl,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionHeading: {
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontSize: 18,
  },
  aboutText: {
    lineHeight: 22,
    color: colors.textPrimary,
  },
  attrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  attrTitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  attrValue: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  hobbyTag: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  hobbyTagText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '500',
  },
  floatingActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.md,
    ...shadows.elevated,
  },
  actionHeartBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionChatBtn: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionChatText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  actionInterestBtn: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  actionInterestText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
