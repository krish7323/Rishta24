import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SelectDropdown } from '../../components/common/SelectDropdown';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { useSearchStore } from '../../store/searchStore';

const religions = ['Open to All', 'Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist'];
const communities = ['Open to All', 'Brahmin', 'Punjabi', 'Maratha', 'Rajput', 'Agarwal', 'Baniya', 'Kayastha', 'Reddy', 'Nair', 'Khatri', 'Jat', 'Patel'];
const maritalStatuses = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
const diets = ['Open to All', 'Vegetarian Only', 'Non-Vegetarian', 'Eggetarian', 'Jain'];
const educations = ['Open to All', 'Bachelors or above', 'Masters or above', 'Doctorate'];

export const SearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [minAge, setMinAge] = useState('22');
  const [maxAge, setMaxAge] = useState('32');
  const [religion, setReligion] = useState('Open to All');
  const [community, setCommunity] = useState('Open to All');
  const [city, setCity] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('Never Married');
  const [diet, setDiet] = useState('Open to All');
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [isPremiumOnly, setIsPremiumOnly] = useState(false);

  const search = useSearchStore((state) => state.search);
  const resetFilters = useSearchStore((state) => state.resetFilters);

  const handleSearch = async () => {
    const filters: any = {
      minAge: Number(minAge) || 21,
      maxAge: Number(maxAge) || 35,
      isVerifiedOnly,
      isPremiumOnly,
    };

    if (religion !== 'Open to All') filters.religion = religion;
    if (community !== 'Open to All') filters.community = community;
    if (city.trim()) filters.city = city.trim();
    if (maritalStatus !== 'Open to All') filters.maritalStatus = maritalStatus.toUpperCase().replace(/\s+/g, '_');
    if (diet !== 'Open to All') filters.diet = diet.toUpperCase().replace(/\s+/g, '_');

    await search(filters);
    navigation.navigate('SearchResults', { filters });
  };

  const handleReset = () => {
    setMinAge('21');
    setMaxAge('35');
    setReligion('Open to All');
    setCommunity('Open to All');
    setCity('');
    setMaritalStatus('Never Married');
    setDiet('Open to All');
    setIsVerifiedOnly(false);
    setIsPremiumOnly(false);
    resetFilters();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h2}>Search Matches</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
            Reset All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Premium Advanced Search Banner */}
        <View style={styles.premiumBanner}>
          <View style={styles.crownCircle}>
            <Text style={{ fontSize: 24 }}>👑</Text>
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={[typography.h3, { color: '#5A3F0B', fontSize: 16 }]}>
              Rishta24 VIP Matchmaker
            </Text>
            <Text style={[typography.caption, { color: '#7A5B1E', marginTop: 2 }]}>
              Unlock 36-Guna Astro matching and direct phone number search with Premium.
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          {/* Age Range */}
          <Text style={[typography.caption, styles.sectionLabel]}>Age Range (Years)</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Input
                label="Min Age"
                value={minAge}
                onChangeText={setMinAge}
                keyboardType="number-pad"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Max Age"
                value={maxAge}
                onChangeText={setMaxAge}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Religion & Community */}
          <SelectDropdown
            label="Religion"
            value={religion}
            options={religions}
            onSelect={setReligion}
          />

          <SelectDropdown
            label="Community / Caste"
            value={community}
            options={communities}
            onSelect={setCommunity}
          />

          {/* Location */}
          <Input
            label="City / Location"
            placeholder="e.g. Mumbai, Delhi, Bengaluru"
            value={city}
            onChangeText={setCity}
          />

          {/* Marital Status */}
          <SelectDropdown
            label="Marital Status"
            value={maritalStatus}
            options={maritalStatuses}
            onSelect={setMaritalStatus}
          />

          {/* Diet */}
          <SelectDropdown
            label="Dietary Preference"
            value={diet}
            options={diets}
            onSelect={setDiet}
          />

          {/* Toggles */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodyMedium, { color: colors.textPrimary }]}>
                Verified Profiles Only 🛡️
              </Text>
              <Text style={typography.caption}>Show only ID-verified members</Text>
            </View>
            <Switch
              value={isVerifiedOnly}
              onValueChange={setIsVerifiedOnly}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodyMedium, { color: colors.textPrimary }]}>
                Premium VIP Members 👑
              </Text>
              <Text style={typography.caption}>Show active premium subscribers</Text>
            </View>
            <Switch
              value={isPremiumOnly}
              onValueChange={setIsPremiumOnly}
              trackColor={{ false: colors.border, true: colors.gold }}
            />
          </View>

          {/* Search Button */}
          <Button
            title="Show Matching Profiles 🔍"
            onPress={handleSearch}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  scrollContent: {
    padding: spacing.lg,
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
  crownCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  sectionLabel: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
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
