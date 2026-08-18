import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Avatar } from '../../components/common/Avatar';
import { ProgressBar } from '../../components/common/ProgressBar';
import { VerifiedBadge, PremiumCrownBadge } from '../../components/common/Badge';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { useAuthStore } from '../../store/authStore';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const logout = useAuthStore((state) => state.logout);

  const completion = profile?.profileCompletion || 75;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of Rishta24?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.replace('Auth');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h2}>My Profile & Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Profile Summary Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <Avatar
              url={profile?.avatar}
              size={70}
              isVerified={profile?.verificationBadge}
              isPremium={profile?.isPremium}
            />
            <View style={styles.profileMainInfo}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[typography.h2, { fontSize: 20 }]}>
                  {profile?.firstName} {profile?.lastName}
                </Text>
                {profile?.verificationBadge && <VerifiedBadge size={16} style={{ marginLeft: 6 }} />}
                {profile?.isPremium && <PremiumCrownBadge size={18} style={{ marginLeft: 4 }} />}
              </View>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                {user?.email} • {profile?.city}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}
                style={styles.editProfileBtn}
              >
                <Text style={styles.editProfileText}>✏️ View & Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Completion Meter */}
          <View style={styles.completionSection}>
            <ProgressBar progress={completion} label="Profile Strength" showPercentage={true} />
            {completion < 100 && (
              <Text style={[typography.small, { color: colors.primaryDark, marginTop: 4 }]}>
                Tip: Complete your family & education details for 3x more match requests!
              </Text>
            )}
          </View>
        </View>

        {/* Premium Upgrade Banner */}
        <TouchableOpacity
          style={styles.premiumBanner}
          onPress={() => navigation.navigate('Premium')}
          activeOpacity={0.9}
        >
          <View style={styles.crownIcon}>
            <Text style={{ fontSize: 28 }}>👑</Text>
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={[typography.h3, { color: '#5A3F0B', fontSize: 16 }]}>
              {profile?.isPremium ? 'Rishta24 VIP Active ✨' : 'Upgrade to Rishta24 Premium'}
            </Text>
            <Text style={[typography.caption, { color: '#7A5B1E', marginTop: 2 }]}>
              {profile?.isPremium
                ? 'Unlimited chats, priority matches, and visitor views enabled'
                : 'Direct messaging, contact access & profile boost'}
            </Text>
          </View>
          <Text style={{ color: colors.goldDark, fontSize: 18, fontWeight: 'bold' }}>→</Text>
        </TouchableOpacity>

        {/* Menu Items List */}
        <View style={styles.menuCard}>
          {[
            {
              icon: '👀',
              title: 'Who Viewed My Profile',
              subtitle: 'Check recent profile visitors',
              screen: 'Visitors',
            },
            {
              icon: '🤍',
              title: 'Shortlisted Profiles',
              subtitle: 'Saved profiles for easy access',
              screen: 'Shortlists',
            },
            {
              icon: '🛡️',
              title: 'ID & Photo Verification',
              subtitle: profile?.verificationBadge ? 'Verified Badge Active' : 'Get Verified Badge',
              screen: 'SafetyCenter',
            },
            {
              icon: '🎁',
              title: 'Invite & Earn Free Premium',
              subtitle: 'Refer friends to unlock rewards',
              screen: 'InviteEarn',
            },
            {
              icon: '⚙️',
              title: 'Privacy & Visibility Settings',
              subtitle: 'Manage phone, photo & status privacy',
              screen: 'PrivacySettings',
            },
            {
              icon: '🚫',
              title: 'Blocked Users',
              subtitle: 'Manage blocked profiles',
              screen: 'BlockedUsers',
            },
            {
              icon: '🛟',
              title: 'Help Center & Support Tickets',
              subtitle: 'FAQs, contact support team',
              screen: 'HelpCenter',
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuRow}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconCircle}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={[typography.bodyMedium, { color: colors.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </View>
              <Text style={{ color: colors.textMuted, fontSize: 16 }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Log Out of Rishta24</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileMainInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  editProfileBtn: {
    marginTop: spacing.xs,
  },
  editProfileText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  completionSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: radius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.gold,
    ...shadows.gold,
  },
  crownIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  logoutText: {
    color: colors.error,
    fontSize: 15,
    fontWeight: '700',
  },
});
