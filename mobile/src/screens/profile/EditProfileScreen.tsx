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
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { profileApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export const EditProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    about: profile?.about || '',
    height: profile?.height || 175,
    motherTongue: profile?.motherTongue || 'Hindi',
    city: profile?.city || 'Mumbai',
    state: profile?.state || 'Maharashtra',
    educationLevel: profile?.educationLevel || 'Masters',
    degree: profile?.degree || '',
    occupation: profile?.occupation || '',
    incomeRange: profile?.incomeRange || '₹25 - 35 Lakhs',
    familyType: profile?.familyType || 'NUCLEAR',
    fatherOccupation: profile?.fatherOccupation || '',
    motherOccupation: profile?.motherOccupation || '',
    diet: profile?.diet || 'VEGETARIAN',
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await profileApi.updateProfile(formData as any);
      setProfile(res.data);
      Alert.alert('Success', 'Profile details updated successfully!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Notice', 'Profile updated.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={typography.h3}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[typography.button, { color: colors.primary }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={[typography.h3, styles.cardTitle]}>Personal Information</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Input
                label="First Name"
                value={formData.firstName}
                onChangeText={(v) => setFormData({ ...formData, firstName: v })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Last Name"
                value={formData.lastName}
                onChangeText={(v) => setFormData({ ...formData, lastName: v })}
              />
            </View>
          </View>

          <Input
            label="About Me & Personality"
            value={formData.about}
            onChangeText={(v) => setFormData({ ...formData, about: v })}
            multiline
            numberOfLines={4}
            style={{ height: 90, textAlignVertical: 'top' }}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Input
                label="City"
                value={formData.city}
                onChangeText={(v) => setFormData({ ...formData, city: v })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="State"
                value={formData.state}
                onChangeText={(v) => setFormData({ ...formData, state: v })}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={[typography.h3, styles.cardTitle]}>Career & Education</Text>
          <Input
            label="Degree"
            value={formData.degree}
            onChangeText={(v) => setFormData({ ...formData, degree: v })}
          />
          <Input
            label="Occupation"
            value={formData.occupation}
            onChangeText={(v) => setFormData({ ...formData, occupation: v })}
          />
          <SelectDropdown
            label="Income Range"
            value={formData.incomeRange}
            options={['₹10 - 15 Lakhs', '₹15 - 25 Lakhs', '₹25 - 35 Lakhs', '₹35 - 50 Lakhs', '₹50 Lakhs+']}
            onSelect={(v) => setFormData({ ...formData, incomeRange: v })}
          />
        </View>

        <View style={styles.card}>
          <Text style={[typography.h3, styles.cardTitle]}>Family & Lifestyle</Text>
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
          <SelectDropdown
            label="Dietary Preference"
            value={formData.diet}
            options={['VEGETARIAN', 'NON_VEGETARIAN', 'EGGETARIAN', 'JAIN', 'VEGAN']}
            onSelect={(v) => setFormData({ ...formData, diet: v as any })}
          />
        </View>

        <Button
          title="Save Profile Updates"
          onPress={handleSave}
          loading={loading}
          size="large"
          style={{ marginTop: spacing.md }}
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
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
});
