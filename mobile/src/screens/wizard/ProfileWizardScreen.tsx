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
import { Input } from '../../components/common/Input';
import { SelectDropdown } from '../../components/common/SelectDropdown';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { profileApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const steps = [
  { id: 1, title: 'Personal Details', subtitle: 'Basic identity & language' },
  { id: 2, title: 'Profile Photo', subtitle: 'Upload attractive portraits' },
  { id: 3, title: 'Religion & Caste', subtitle: 'Cultural & family background' },
  { id: 4, title: 'Location', subtitle: 'Where do you currently reside?' },
  { id: 5, title: 'Education & Career', subtitle: 'Academic degree & occupation' },
  { id: 6, title: 'Family Background', subtitle: 'Family structure and values' },
  { id: 7, title: 'Lifestyle & Hobbies', subtitle: 'Dietary habits & interests' },
  { id: 8, title: 'About Me', subtitle: 'Describe your personality & outlook' },
  { id: 9, title: 'Partner Preferences', subtitle: 'What are you seeking in a partner?' },
  { id: 10, title: 'Privacy & Safety', subtitle: 'Control who views your details' },
];

export const ProfileWizardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || 'Kabir',
    lastName: profile?.lastName || 'Kapoor',
    height: profile?.height || 178,
    motherTongue: profile?.motherTongue || 'Hindi',
    maritalStatus: profile?.maritalStatus || 'NEVER_MARRIED',
    avatar: profile?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    religion: profile?.religion || 'Hindu',
    community: profile?.community || 'Punjabi',
    caste: profile?.caste || 'Khatri',
    manglik: profile?.manglik || 'NO',
    city: profile?.city || 'Mumbai',
    state: profile?.state || 'Maharashtra',
    country: 'India',
    educationLevel: profile?.educationLevel || 'Masters',
    degree: profile?.degree || 'M.Tech in Computer Science',
    occupation: profile?.occupation || 'Software Architect',
    incomeRange: profile?.incomeRange || '₹30 - 45 Lakhs',
    familyType: profile?.familyType || 'NUCLEAR',
    fatherOccupation: profile?.fatherOccupation || 'Executive Director (Retd.)',
    motherOccupation: profile?.motherOccupation || 'Educator',
    familyValues: profile?.familyValues || 'MODERATE',
    diet: profile?.diet || 'VEGETARIAN',
    smoking: profile?.smoking || 'NO',
    drinking: profile?.drinking || 'OCCASIONALLY',
    hobbies: ['Photography', 'Music', 'Fitness', 'Travel'],
    about: profile?.about || 'Warm, family-oriented professional with a passion for innovation, road trips, and meaningful conversations.',
  });

  const progressPercentage = Math.round((currentStep / steps.length) * 100);

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final Submit
      try {
        setLoading(true);
        const res = await profileApi.updateProfile(formData as any);
        setProfile(res.data);
        Alert.alert('Congratulations! 🎉', 'Your profile is now complete and active on Rishta24.', [
          { text: 'Enter Rishta24', onPress: () => navigation.replace('Main') },
        ]);
      } catch (err: any) {
        Alert.alert('Notice', 'Profile saved! Entering Rishta24.', [
          { text: 'Continue', onPress: () => navigation.replace('Main') },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={handleBack} disabled={currentStep === 1}>
          <Text
            style={[
              typography.button,
              { color: currentStep === 1 ? colors.textMuted : colors.primary },
            ]}
          >
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={[typography.caption, { fontWeight: '700', color: colors.textSecondary }]}>
          Step {currentStep} of {steps.length}
        </Text>

        <TouchableOpacity onPress={() => navigation.replace('Main')}>
          <Text style={[typography.button, { color: colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: spacing.xl }}>
        <ProgressBar progress={progressPercentage} showPercentage={false} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Profile Quality Banner */}
        <View style={styles.qualityCard}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.caption, { color: colors.goldDark, fontWeight: '800' }]}>
              PROFILE QUALITY SCORE
            </Text>
            <Text style={[typography.h3, { color: colors.textPrimary, marginTop: 2 }]}>
              {progressPercentage >= 80 ? '🌟 Excellent Profile' : '✨ Good Start (Completing details boosts matches)'}
            </Text>
          </View>
          <View style={styles.qualityBadge}>
            <Text style={styles.qualityBadgeText}>{progressPercentage}% Complete</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[typography.h2, styles.stepTitle]}>
              {steps[currentStep - 1].title}
            </Text>
            {currentStep > 1 && (
              <TouchableOpacity onPress={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}>
                <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
                  Complete Later →
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={[typography.bodySecondary, styles.stepSubtitle]}>
            {steps[currentStep - 1].subtitle}
          </Text>
        </View>

        <View style={styles.card}>
          {currentStep === 1 && (
            <>
              <Input
                label="First Name"
                value={formData.firstName}
                onChangeText={(v) => setFormData({ ...formData, firstName: v })}
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChangeText={(v) => setFormData({ ...formData, lastName: v })}
              />
              <Input
                label="Height (in cm)"
                placeholder="e.g. 175"
                value={String(formData.height)}
                onChangeText={(v) => setFormData({ ...formData, height: Number(v) || 170 })}
                keyboardType="number-pad"
              />
              <SelectDropdown
                label="Mother Tongue"
                value={formData.motherTongue}
                options={['Hindi', 'Punjabi', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Bengali', 'Malayalam', 'Kannada', 'Odia', 'Other']}
                onSelect={(v) => setFormData({ ...formData, motherTongue: v })}
              />
            </>
          )}

          {currentStep === 2 && (
            <View style={{ alignItems: 'center' }}>
              <Text style={[typography.body, { textAlign: 'center', marginBottom: spacing.lg }]}>
                Adding clear photos increases your match requests by 400%!
              </Text>
              <Input
                label="Photo URL (Demo / Unsplash)"
                value={formData.avatar}
                onChangeText={(v) => setFormData({ ...formData, avatar: v })}
              />
              <Button
                title="📸 Add From Device Gallery"
                onPress={() => Alert.alert('Upload', 'Photo added to your private gallery!')}
                variant="outline"
                style={{ marginTop: spacing.sm }}
              />
            </View>
          )}

          {currentStep === 3 && (
            <>
              <SelectDropdown
                label="Religion"
                value={formData.religion}
                options={['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Other']}
                onSelect={(v) => setFormData({ ...formData, religion: v })}
              />
              <Input
                label="Community / Caste"
                value={formData.community}
                onChangeText={(v) => setFormData({ ...formData, community: v })}
              />
              <SelectDropdown
                label="Manglik / Chevvai Dosham"
                value={formData.manglik}
                options={['NO', 'YES', 'DO_NOT_KNOW', 'ANSHIK']}
                onSelect={(v) => setFormData({ ...formData, manglik: v as any })}
              />
            </>
          )}

          {currentStep === 4 && (
            <>
              <Input
                label="Current City"
                value={formData.city}
                onChangeText={(v) => setFormData({ ...formData, city: v })}
              />
              <Input
                label="State"
                value={formData.state}
                onChangeText={(v) => setFormData({ ...formData, state: v })}
              />
            </>
          )}

          {currentStep === 5 && (
            <>
              <SelectDropdown
                label="Highest Degree"
                value={formData.educationLevel}
                options={['Bachelors', 'Masters', 'Doctorate', 'Diploma', 'CA / CS']}
                onSelect={(v) => setFormData({ ...formData, educationLevel: v })}
              />
              <Input
                label="Profession / Job Title"
                value={formData.occupation}
                onChangeText={(v) => setFormData({ ...formData, occupation: v })}
              />
              <SelectDropdown
                label="Annual Income Range"
                value={formData.incomeRange}
                options={[
                  'Under ₹5 Lakhs',
                  '₹5 - 10 Lakhs',
                  '₹10 - 15 Lakhs',
                  '₹15 - 25 Lakhs',
                  '₹25 - 35 Lakhs',
                  '₹35 - 50 Lakhs',
                  '₹50 - 75 Lakhs',
                  '₹75 Lakhs - 1 Crore+',
                ]}
                onSelect={(v) => setFormData({ ...formData, incomeRange: v })}
              />
            </>
          )}

          {currentStep === 6 && (
            <>
              <SelectDropdown
                label="Family Type"
                value={formData.familyType}
                options={['NUCLEAR', 'JOINT']}
                onSelect={(v) => setFormData({ ...formData, familyType: v as any })}
              />
              <Input
                label="Father's Occupation"
                value={formData.fatherOccupation}
                onChangeText={(v) => setFormData({ ...formData, fatherOccupation: v })}
              />
              <Input
                label="Mother's Occupation"
                value={formData.motherOccupation}
                onChangeText={(v) => setFormData({ ...formData, motherOccupation: v })}
              />
            </>
          )}

          {currentStep === 7 && (
            <>
              <SelectDropdown
                label="Dietary Preference"
                value={formData.diet}
                options={['VEGETARIAN', 'NON_VEGETARIAN', 'EGGETARIAN', 'JAIN', 'VEGAN']}
                onSelect={(v) => setFormData({ ...formData, diet: v as any })}
              />
              <SelectDropdown
                label="Smoking Habits"
                value={formData.smoking}
                options={['NO', 'OCCASIONALLY', 'YES']}
                onSelect={(v) => setFormData({ ...formData, smoking: v as any })}
              />
              <SelectDropdown
                label="Drinking Habits"
                value={formData.drinking}
                options={['NO', 'OCCASIONALLY', 'YES']}
                onSelect={(v) => setFormData({ ...formData, drinking: v as any })}
              />
            </>
          )}

          {currentStep === 8 && (
            <>
              <Input
                label="About Me & Family"
                placeholder="Share your hobbies, what matters to you in life, and your vision of marriage..."
                value={formData.about}
                onChangeText={(v) => setFormData({ ...formData, about: v })}
                multiline
                numberOfLines={4}
                style={{ height: 100, textAlignVertical: 'top' }}
              />
            </>
          )}

          {currentStep === 9 && (
            <View>
              <Text style={[typography.body, { marginBottom: spacing.md }]}>
                Set preferred age, education, and community criteria for optimal match scoring.
              </Text>
              <SelectDropdown
                label="Preferred Marital Status"
                value="Never Married"
                options={['Never Married', 'Divorced', 'Widowed', 'Open to All']}
                onSelect={() => {}}
              />
              <SelectDropdown
                label="Preferred Diet"
                value={formData.diet}
                options={['Vegetarian Only', 'Non-Vegetarian', 'Open to All']}
                onSelect={() => {}}
              />
            </View>
          )}

          {currentStep === 10 && (
            <View>
              <Text style={[typography.body, { marginBottom: spacing.md }]}>
                🔒 Your privacy is fully safeguarded. You can adjust visibility at any time.
              </Text>
              <SelectDropdown
                label="Photo Visibility"
                value="Visible to all registered members"
                options={[
                  'Visible to all registered members',
                  'Visible upon mutual interest',
                  'Private / Hidden',
                ]}
                onSelect={() => {}}
              />
              <SelectDropdown
                label="Phone Number Privacy"
                value="Only Premium Members / On Request"
                options={[
                  'Only Premium Members / On Request',
                  'Visible to all matched members',
                  'Hidden completely',
                ]}
                onSelect={() => {}}
              />
            </View>
          )}

          <Button
            title={currentStep === steps.length ? 'Complete Profile 🎉' : 'Save & Continue →'}
            onPress={handleNext}
            loading={loading}
            size="large"
            style={{ marginTop: spacing.xl }}
          />
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  qualityCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: radius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
    marginBottom: spacing.md,
  },
  qualityBadge: {
    backgroundColor: colors.goldDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    borderRadius: radius.full,
    marginLeft: spacing.sm,
  },
  qualityBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  titleSection: {
    marginVertical: spacing.md,
  },
  stepTitle: {
    color: colors.textPrimary,
  },
  stepSubtitle: {
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

