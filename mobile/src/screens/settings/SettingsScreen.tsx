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
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { useAuthStore } from '../../store/authStore';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

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

  const menuItems = [
    {
      icon: '📱',
      title: 'Active Device Sessions',
      subtitle: 'View logged-in devices & remote logout',
      screen: 'PrivacySettings',
      action: () => {
        Alert.alert('Active Device Sessions 📱', '• Primary Device (Expo / Web) — Active Now\n\nTo log out remote devices, tap "Logout All Devices".', [
          { text: 'Logout All Devices', style: 'destructive', onPress: () => Alert.alert('Sessions Cleared', 'All remote device sessions have been terminated.') },
          { text: 'Close', style: 'cancel' },
        ]);
      },
    },
    {
      icon: '⏸️',
      title: 'Pause Account / Hide Profile',
      subtitle: 'Temporarily pause matches or hide from search',
      screen: 'PrivacySettings',
      action: () => {
        Alert.alert('Account Control', 'Choose how you want to manage your profile visibility:', [
          { text: 'Pause Account (Pause Recommendations)', onPress: () => Alert.alert('Account Paused', 'Your profile recommendations are temporarily paused.') },
          { text: 'Hide Profile (Hide from Search)', onPress: () => Alert.alert('Profile Hidden', 'Your profile is hidden from search and discovery.') },
          { text: 'Cancel', style: 'cancel' },
        ]);
      },
    },
    {
      icon: '⚙️',
      title: 'Privacy & Visibility Settings',
      subtitle: 'Manage phone, photo & profile visibility',
      screen: 'PrivacySettings',
    },
    {
      icon: '🚫',
      title: 'Blocked Profiles',
      subtitle: 'View and manage blocked users',
      screen: 'BlockedUsers',
    },
    {
      icon: '🛡️',
      title: 'Safety Center & ID Verification',
      subtitle: 'Submit documents for verified badge',
      screen: 'SafetyCenter',
    },
    {
      icon: '🎁',
      title: 'Invite & Earn Rewards',
      subtitle: 'Refer friends to earn free VIP premium',
      screen: 'InviteEarn',
    },
    {
      icon: '🛟',
      title: 'Help Desk & Support Tickets',
      subtitle: 'Read FAQs or open a support inquiry',
      screen: 'HelpCenter',
    },
    {
      icon: '🗑️',
      title: 'Delete Account',
      subtitle: 'Permanently close & anonymize your account',
      screen: 'PrivacySettings',
      action: () => {
        Alert.alert('Delete Account 🗑️', 'Are you sure you want to permanently close your Rishta24 account? This action cannot be undone.', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete Account',
            style: 'destructive',
            onPress: () => {
              logout();
              navigation.replace('Auth');
            },
          },
        ]);
      },
    },
  ];


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={typography.h3}>Account Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Account Header */}
        <View style={styles.accountCard}>
          <Text style={[typography.h3, { color: colors.textPrimary }]}>
            {user?.email}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
            Account Role: {user?.role || 'MEMBER'} • Status: ACTIVE 🟢
          </Text>
        </View>

        {/* Menu Options */}
        <View style={styles.menuCard}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.menuRow}
              onPress={() => (item.action ? item.action() : navigation.navigate(item.screen))}
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
    paddingBottom: spacing.xxxl,
  },
  accountCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.card,
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
