import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { generalApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export const InviteEarnScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    generalApi.getReferralStats().then((res) => {
      setStats(res.data);
    });
  }, []);

  const referralCode = stats?.referralCode || user?.referralCode || 'R24-KABIR99';

  const handleCopy = () => {
    Alert.alert('Copied! 📋', `Referral code ${referralCode} copied to clipboard.`);
  };

  const handleShare = () => {
    Alert.alert(
      'Share Rishta24',
      `Invite Link: https://rishta24.in/invite/${referralCode}\n\nJoin Rishta24 to find verified matrimonial matches!`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={typography.h3}>Invite & Earn Premium</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={{ fontSize: 44, marginBottom: spacing.sm }}>🎁</Text>
          <Text style={[typography.h1, styles.heroTitle]}>Give 7 Days, Get 7 Days</Text>
          <Text style={[typography.bodySecondary, styles.heroSubtitle]}>
            Invite your friends and relatives searching for life partners. Both of you receive 7 days of free Rishta24 Gold Premium!
          </Text>
        </View>

        {/* Code Box */}
        <View style={styles.codeCard}>
          <Text style={[typography.caption, { fontWeight: '700', color: colors.textSecondary }]}>
            YOUR UNIQUE REFERRAL CODE
          </Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
              <Text style={styles.copyText}>Copy 📋</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{stats?.totalReferred || 3}</Text>
            <Text style={styles.statLabel}>Friends Invited</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{stats?.rewardsEarnedDays || 21} Days</Text>
            <Text style={styles.statLabel}>Free Premium Earned</Text>
          </View>
        </View>

        <Button
          title="Share Invite Link 💬"
          onPress={handleShare}
          size="large"
          style={{ marginTop: spacing.lg }}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  heroCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: 22,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  heroSubtitle: {
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  codeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    width: '100%',
    marginTop: spacing.sm,
  },
  codeText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 2,
  },
  copyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  copyText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statVal: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
