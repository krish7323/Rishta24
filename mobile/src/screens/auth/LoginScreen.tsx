import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RishtaLogo } from '../../components/common/RishtaLogo';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setAuthData = useAuthStore((state) => state.setAuthData);

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your email/phone and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await authApi.login({ identifier: identifier.trim(), password });
      setAuthData({
        user: res.data.user,
        profile: res.data.profile,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      navigation.replace('Main');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIdentifier('demo@rishta24.test');
    setPassword('Password123!');
    try {
      setLoading(true);
      setError('');
      const res = await authApi.login({ identifier: 'demo@rishta24.test', password: 'Password123!' });
      setAuthData({
        user: res.data.user,
        profile: res.data.profile,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      navigation.replace('Main');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <RishtaLogo size="medium" />
          <Text style={[typography.h2, styles.welcomeTitle]}>Welcome Back</Text>
          <Text style={[typography.bodySecondary, styles.welcomeSubtitle]}>
            Sign in to continue your matchmaking journey
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            label="Email or Mobile Number"
            placeholder="e.g. rahul@example.com or 9876543210"
            value={identifier}
            onChangeText={(val) => {
              setIdentifier(val);
              setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              setError('');
            }}
            isPassword
          />

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={[typography.caption, { color: colors.primary, fontWeight: '600' }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            size="large"
            style={{ marginTop: spacing.md }}
          />

          {/* Quick Demo Login Shortcut */}
          <TouchableOpacity style={styles.demoShortcut} onPress={handleDemoLogin}>
            <Text style={styles.demoText}>⚡ Quick Demo Account Login (Pre-filled Profiles & Matches)</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={typography.bodySecondary}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[typography.body, { color: colors.primary, fontWeight: '700' }]}>
                Register Free
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.xl,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  welcomeTitle: {
    marginTop: spacing.lg,
    color: colors.textPrimary,
  },
  welcomeSubtitle: {
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: colors.errorLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
  },
  form: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  demoShortcut: {
    backgroundColor: colors.goldBg,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  demoText: {
    color: colors.goldDark,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
});
