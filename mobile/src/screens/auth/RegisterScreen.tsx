import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { RishtaLogo } from '../../components/common/RishtaLogo';
import { Input } from '../../components/common/Input';
import { SelectDropdown } from '../../components/common/SelectDropdown';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { authApi } from '../../services/api';

const religions = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other'];
const communities = ['Brahmin', 'Punjabi', 'Maratha', 'Rajput', 'Agarwal', 'Baniya', 'Kayastha', 'Reddy', 'Nair', 'Khatri', 'Jat', 'Patel', 'Yadav', 'Other'];
const educationLevels = ['Bachelors', 'Masters', 'Doctorate', 'Diploma', 'Higher Secondary'];

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    gender: 'FEMALE',
    dateOfBirth: '1998-05-15',
    motherTongue: 'Hindi',
    religion: 'Hindu',
    community: 'Brahmin',
    city: 'Mumbai',
    state: 'Maharashtra',
    educationLevel: 'Masters',
    degree: 'B.Tech / MBA',
    occupation: 'Software Engineer',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all mandatory fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authApi.register(formData);
      navigation.navigate('OtpVerification', {
        identifier: formData.phone,
        purpose: 'REGISTRATION',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <RishtaLogo size="medium" />
          <Text style={[typography.h2, styles.title]}>Create Free Matrimonial Profile</Text>
          <Text style={[typography.bodySecondary, styles.subtitle]}>
            Find genuine, family-verified life partners on Rishta24
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.genderRow}>
            <Text style={[typography.caption, { fontWeight: '700', marginBottom: spacing.xs }]}>
              Profile For
            </Text>
            <View style={styles.genderBtnGroup}>
              {['FEMALE', 'MALE'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderBtn,
                    formData.gender === g && styles.genderBtnActive,
                  ]}
                  onPress={() => setFormData({ ...formData, gender: g })}
                >
                  <Text
                    style={[
                      typography.bodyMedium,
                      formData.gender === g && { color: '#FFFFFF', fontWeight: '700' },
                    ]}
                  >
                    {g === 'FEMALE' ? 'Bride (Female)' : 'Groom (Male)'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Input
                label="First Name *"
                placeholder="e.g. Rahul"
                value={formData.firstName}
                onChangeText={(val) => setFormData({ ...formData, firstName: val })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Last Name *"
                placeholder="e.g. Sharma"
                value={formData.lastName}
                onChangeText={(val) => setFormData({ ...formData, lastName: val })}
              />
            </View>
          </View>

          <Input
            label="Email Address *"
            placeholder="e.g. rahul.sharma@example.com"
            value={formData.email}
            onChangeText={(val) => setFormData({ ...formData, email: val })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Mobile Number *"
            placeholder="e.g. +91 9876543210"
            value={formData.phone}
            onChangeText={(val) => setFormData({ ...formData, phone: val })}
            keyboardType="phone-pad"
          />

          <Input
            label="Create Password *"
            placeholder="At least 8 characters"
            value={formData.password}
            onChangeText={(val) => setFormData({ ...formData, password: val })}
            isPassword
          />

          <SelectDropdown
            label="Religion *"
            value={formData.religion}
            options={religions}
            onSelect={(val) => setFormData({ ...formData, religion: val })}
          />

          <SelectDropdown
            label="Community / Caste *"
            value={formData.community}
            options={communities}
            onSelect={(val) => setFormData({ ...formData, community: val })}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Input
                label="City *"
                placeholder="e.g. Mumbai"
                value={formData.city}
                onChangeText={(val) => setFormData({ ...formData, city: val })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="State *"
                placeholder="e.g. Maharashtra"
                value={formData.state}
                onChangeText={(val) => setFormData({ ...formData, state: val })}
              />
            </View>
          </View>

          <SelectDropdown
            label="Highest Education *"
            value={formData.educationLevel}
            options={educationLevels}
            onSelect={(val) => setFormData({ ...formData, educationLevel: val })}
          />

          <Input
            label="Profession / Occupation *"
            placeholder="e.g. Senior Software Engineer"
            value={formData.occupation}
            onChangeText={(val) => setFormData({ ...formData, occupation: val })}
          />

          <Button
            title="Register Free & Continue →"
            onPress={handleRegister}
            loading={loading}
            size="large"
            style={{ marginTop: spacing.md }}
          />

          <View style={styles.footerRow}>
            <Text style={typography.bodySecondary}>Already registered? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[typography.body, { color: colors.primary, fontWeight: '700' }]}>
                Log In
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
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
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
  },
  form: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  genderRow: {
    marginBottom: spacing.md,
  },
  genderBtnGroup: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  genderBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  row: {
    flexDirection: 'row',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
});
