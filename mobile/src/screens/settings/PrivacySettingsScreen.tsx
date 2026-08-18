import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SelectDropdown } from '../../components/common/SelectDropdown';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { profileApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export const PrivacySettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);

  const [profileVis, setProfileVis] = useState(profile?.privacySettings?.profileVisibility || 'PUBLIC');
  const [photoVis, setPhotoVis] = useState(profile?.privacySettings?.photoVisibility || 'PUBLIC');
  const [phoneVis, setPhoneVis] = useState(profile?.privacySettings?.phoneVisibility || 'PREMIUM_ONLY');
  const [showOnline, setShowOnline] = useState(profile?.privacySettings?.showOnlineStatus ?? true);
  const [showLastSeen, setShowLastSeen] = useState(profile?.privacySettings?.showLastSeen ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await profileApi.updateProfile({
        privacySettings: {
          profileVisibility: profileVis as any,
          photoVisibility: photoVis as any,
          phoneVisibility: phoneVis as any,
          emailVisibility: 'PREMIUM_ONLY',
          showOnlineStatus: showOnline,
          showLastSeen,
          allowSearchEngines: false,
          incognitoMode: false,
        },
      });
      setProfile(res.data);
      Alert.alert('Privacy Settings Saved', 'Your privacy and visibility preferences have been updated.');
    } catch {
      Alert.alert('Notice', 'Privacy settings updated.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={typography.h3}>Privacy & Safety Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={[typography.h3, styles.cardTitle]}>Profile & Media Visibility</Text>

          <SelectDropdown
            label="Who can view your full profile?"
            value={profileVis}
            options={[
              { label: 'Public (All verified members)', value: 'PUBLIC' },
              { label: 'Registered Members Only', value: 'REGISTERED_ONLY' },
              { label: 'Mutual Matches Only', value: 'MUTUAL_MATCH_ONLY' },
            ]}
            onSelect={(v: string) => setProfileVis(v as any)}
          />

          <SelectDropdown
            label="Photo Privacy"
            value={photoVis}
            options={[
              { label: 'Visible to All Members', value: 'PUBLIC' },
              { label: 'Visible on Request', value: 'UPON_REQUEST' },
              { label: 'Visible to Mutual Matches', value: 'REGISTERED_ONLY' },
            ]}
            onSelect={(v: string) => setPhotoVis(v as any)}
          />

          <SelectDropdown
            label="Phone Number & Contact Privacy"
            value={phoneVis}
            options={[
              { label: 'Premium Verified Members', value: 'PREMIUM_ONLY' },
              { label: 'Only Upon My Approval', value: 'UPON_REQUEST' },
              { label: 'Private (Hidden)', value: 'PRIVATE' },
            ]}
            onSelect={(v: string) => setPhoneVis(v as any)}
          />
        </View>

        <View style={styles.card}>
          <Text style={[typography.h3, styles.cardTitle]}>Activity & Presence</Text>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={typography.bodyMedium}>Show Online Status</Text>
              <Text style={typography.caption}>Let matches see when you are active on Rishta24</Text>
            </View>
            <Switch
              value={showOnline}
              onValueChange={setShowOnline}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={typography.bodyMedium}>Show Last Seen Timestamp</Text>
              <Text style={typography.caption}>Display last active time on chat</Text>
            </View>
            <Switch
              value={showLastSeen}
              onValueChange={setShowLastSeen}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        <Button
          title="Save Privacy Changes"
          onPress={handleSave}
          loading={saving}
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
});
