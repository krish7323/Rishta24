import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ProfileCard } from '../../components/cards/ProfileCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ProfileCardSkeleton } from '../../components/common/SkeletonLoader';
import { MatchCelebrationModal } from '../../components/modals/MatchCelebrationModal';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useSearchStore } from '../../store/searchStore';
import { useMatchStore } from '../../store/matchStore';
import { useAuthStore } from '../../store/authStore';

export const SearchResultsScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { filters } = route.params || {};
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<any>(null);

  const searchResults = useSearchStore((state) => state.searchResults);
  const isSearching = useSearchStore((state) => state.isSearching);
  const profile = useAuthStore((state) => state.profile);
  const sendInterest = useMatchStore((state) => state.sendInterest);
  const toggleShortlist = useMatchStore((state) => state.toggleShortlist);

  const handleInterest = async (candidate: any) => {
    try {
      const res = await sendInterest(candidate.user?._id || candidate.user, 'Hello, I liked your profile!');
      if (res.isMutualMatch) {
        setMatchedProfile(candidate);
        setMatchModalVisible(true);
      } else {
        Alert.alert('Interest Sent 💕', `Your interest was sent to ${candidate.firstName}.`);
      }
    } catch (err: any) {
      Alert.alert('Notice', err.response?.data?.message || 'Interest sent successfully!');
    }
  };

  const handleShortlist = async (candidate: any) => {
    try {
      const isShort = await toggleShortlist(candidate.user?._id || candidate.user);
      Alert.alert('Shortlist', isShort ? `${candidate.firstName} added to shortlist.` : `${candidate.firstName} removed from shortlist.`);
    } catch {
      // ignore
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text style={typography.h3}>Search Results</Text>
          <Text style={[typography.small, { color: colors.textSecondary }]}>
            {searchResults.length} compatible matches found
          </Text>
        </View>
      </View>

      {isSearching ? (
        <View style={{ padding: spacing.lg }}>
          <ProfileCardSkeleton />
          <ProfileCardSkeleton />
        </View>
      ) : searchResults.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No Matching Profiles"
          description="Try broadening your age, religion, or location criteria to see more matches."
          actionTitle="Edit Search Criteria"
          onAction={() => navigation.goBack()}
        />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item}
              variant="large"
              onPress={() => {
                const uid = typeof item.user === 'object' ? (item.user as any)?._id : item.user;
                navigation.navigate('ProfileDetail', { profileId: uid, initialProfile: item });
              }}
              onSendInterest={() => handleInterest(item)}
              onShortlistToggle={() => handleShortlist(item)}
              onChat={() => navigation.navigate('Chat', { partnerProfile: item })}
            />
          )}
        />
      )}

      {/* Match Celebration Modal */}
      {matchedProfile && (
        <MatchCelebrationModal
          visible={matchModalVisible}
          partnerName={matchedProfile.firstName}
          partnerAvatarUrl={matchedProfile.avatar}
          myAvatarUrl={profile?.avatar}
          onStartChat={() => {
            setMatchModalVisible(false);
            navigation.navigate('Chat', {
              partnerProfile: matchedProfile,
            });
          }}
          onClose={() => setMatchModalVisible(false)}
        />
      )}
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
  listContent: {
    padding: spacing.lg,
  },
});
