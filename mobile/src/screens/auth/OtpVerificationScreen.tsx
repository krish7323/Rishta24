import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { RishtaLogo } from '../../components/common/RishtaLogo';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export const OtpVerificationScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { identifier = 'your phone number', purpose = 'REGISTRATION' } = route.params || {};
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setAuthData = useAuthStore((state) => state.setAuthData);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (otp.length < 4) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await authApi.verifyOtp({
        identifier,
        otp: otp || '123456',
        purpose,
      });

      if (res.data?.user && res.data?.accessToken) {
        setAuthData({
          user: res.data.user,
          profile: res.data.profile,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        });
        navigation.replace('ProfileWizard');
      } else {
        navigation.replace('Main');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP code. Please enter 123456');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setTimer(60);
      setError('');
      await authApi.sendOtp({ identifier, purpose });
    } catch {
      setError('Failed to resend OTP');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <RishtaLogo size="medium" />

        <Text style={[typography.h2, styles.title]}>Verify Mobile Number</Text>
        <Text style={[typography.bodySecondary, styles.subtitle]}>
          We have sent a 6-digit verification code to {'\n'}
          <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{identifier}</Text>
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={[typography.caption, styles.otpLabel]}>Enter OTP Code</Text>
          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={(val) => {
              setOtp(val);
              setError('');
            }}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />

          <Text style={styles.demoHint}>💡 (Demo code: 123456)</Text>

          <Button
            title="Verify & Continue →"
            onPress={handleVerify}
            loading={loading}
            size="large"
            style={{ marginTop: spacing.lg }}
          />

          <View style={styles.resendRow}>
            {timer > 0 ? (
              <Text style={typography.caption}>Resend code in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
                  Resend OTP Code
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: spacing.xl,
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: spacing.xs,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  errorBox: {
    backgroundColor: colors.errorLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    width: '100%',
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.xxl,
    borderRadius: radius.xxl,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  otpLabel: {
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.textSecondary,
  },
  otpInput: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.xl,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 8,
    paddingVertical: spacing.md,
    color: colors.primary,
  },
  demoHint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
});
