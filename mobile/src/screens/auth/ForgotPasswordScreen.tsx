import React, { useState } from 'react';
import {
  View,
  Text,
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

export const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      setError('Please enter your registered email or phone');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authApi.sendOtp({ identifier: identifier.trim(), purpose: 'FORGOT_PASSWORD' });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!otp.trim() || !newPassword.trim()) {
      setError('Please enter OTP and new password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authApi.resetPassword({
        identifier: identifier.trim(),
        otp: otp.trim(),
        newPassword,
      });
      Alert.alert('Success', 'Password reset successfully! Please log in with your new password.', [
        { text: 'Log In', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Check OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <RishtaLogo size="medium" />
        <Text style={[typography.h2, styles.title]}>Reset Password</Text>
        <Text style={[typography.bodySecondary, styles.subtitle]}>
          {step === 1
            ? 'Enter your registered email or phone number to receive a verification code'
            : 'Enter the 6-digit code and your new password'}
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          {step === 1 ? (
            <>
              <Input
                label="Email or Mobile Number"
                placeholder="e.g. rahul@example.com"
                value={identifier}
                onChangeText={(v) => {
                  setIdentifier(v);
                  setError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Button
                title="Send Verification Code →"
                onPress={handleSendOtp}
                loading={loading}
                size="large"
                style={{ marginTop: spacing.md }}
              />
            </>
          ) : (
            <>
              <Input
                label="6-Digit OTP Code"
                placeholder="123456"
                value={otp}
                onChangeText={(v) => {
                  setOtp(v);
                  setError('');
                }}
                keyboardType="number-pad"
              />
              <Input
                label="New Password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChangeText={(v) => {
                  setNewPassword(v);
                  setError('');
                }}
                isPassword
              />
              <Button
                title="Set New Password & Log In"
                onPress={handleReset}
                loading={loading}
                size="large"
                style={{ marginTop: spacing.md }}
              />
            </>
          )}

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
              ← Back to Login
            </Text>
          </TouchableOpacity>
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
    lineHeight: 20,
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
    padding: spacing.xl,
    borderRadius: radius.xxl,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  backBtn: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
});
