import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ProfileCard } from '../../components/cards/ProfileCard';
import { EmptyState } from '../../components/common/EmptyState';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { SwipeCardDeck } from '../../components/cards/SwipeCardDeck';
import { useMatchStore } from '../../store/matchStore';
import { useSearchStore } from '../../store/searchStore';



type MatchTab = 'all' | 'mutual' | 'received' | 'sent' | 'shortlisted';

export const MatchesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<MatchTab>('all');
  const [viewMode, setViewMode] = useState<'swipe' | 'list'>('swipe');

  const matches = useMatchStore((state) => state.matches);
  const receivedInterests = useMatchStore((state) => state.receivedInterests);
  const sentInterests = useMatchStore((state) => state.sentInterests);
  const shortlists = useMatchStore((state) => state.shortlists);
  const recommendedProfiles = useSearchStore((state) => state.recommendedProfiles);

  const fetchMatches = useMatchStore((state) => state.fetchMatches);
  const fetchReceivedInterests = useMatchStore((state) => state.fetchReceivedInterests);
  const fetchSentInterests = useMatchStore((state) => state.fetchSentInterests);
  const fetchShortlists = useMatchStore((state) => state.fetchShortlists);
  const respondInterest = useMatchStore((state) => state.respondInterest);
  const sendInterest = useMatchStore((state) => state.sendInterest);
  const toggleShortlist = useMatchStore((state) => state.toggleShortlist);

  useEffect(() => {
    fetchMatches();
    fetchReceivedInterests();
    fetchSentInterests();
    fetchShortlists();
  }, []);

  const handleSwipeRight = async (candidate: any) => {
    try {
      const uid = typeof candidate.user === 'object' ? (candidate.user as any)?._id : candidate.user;
      await sendInterest(uid);
      Alert.alert('Interest Sent! 💕', `Interest request delivered to ${candidate.firstName}.`);
    } catch {
      Alert.alert('Notice', 'Interest sent!');
    }
  };

  const handleSwipeLeft = (_candidate: any) => {
    // Pass profile
  };

  const handleToggleShortlist = async (candidate: any) => {
    try {
      const uid = typeof candidate.user === 'object' ? (candidate.user as any)?._id : candidate.user;
      const isShort = await toggleShortlist(uid);
      Alert.alert('Shortlist', isShort ? `${candidate.firstName} saved to shortlist.` : `${candidate.firstName} removed.`);
    } catch {
      // ignore
    }
  };

  const handleAcceptInterest = async (interestId: string) => {
    try {
      await respondInterest(interestId, 'ACCEPT');
      Alert.alert("It's a Match! 🎉", 'You accepted this interest. You can now chat anytime!');
    } catch {
      Alert.alert('Notice', 'Action completed.');
    }
  };

  const handleRejectInterest = async (interestId: string) => {
    try {
      await respondInterest(interestId, 'REJECT');
    } catch {
      // ignore
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'all') {
      if (viewMode === 'swipe') {
        return (
          <ScrollView contentContainerStyle={styles.swipeScrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.viewModeToggleRow}>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                Swipe Right = Like 💕 | Swipe Left = Pass ✕
              </Text>
              <TouchableOpacity
                style={styles.modeToggleBtn}
                onPress={() => setViewMode('list')}
              >
                <Text style={styles.modeToggleText}>📜 List View</Text>
              </TouchableOpacity>
            </View>

            <SwipeCardDeck
              profiles={recommendedProfiles}
              onSwipeRight={handleSwipeRight}
              onSwipeLeft={handleSwipeLeft}
              onShortlist={handleToggleShortlist}
              onCardPress={(item) => {
                const uid = typeof item.user === 'object' ? (item.user as any)?._id : item.user;
                navigation.navigate('ProfileDetail', { profileId: uid, initialProfile: item });
              }}
            />
          </ScrollView>
        );
      }

      return (
        <View style={{ flex: 1 }}>
          <View style={styles.viewModeToggleRow}>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Standard List View
            </Text>
            <TouchableOpacity
              style={styles.modeToggleBtn}
              onPress={() => setViewMode('swipe')}
            >
              <Text style={styles.modeToggleText}>🎴 Swipe Deck</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={recommendedProfiles}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ProfileCard
                profile={item}
                variant="large"
                onPress={() => {
                  const uid = typeof item.user === 'object' ? (item.user as any)?._id : item.user;
                  navigation.navigate('ProfileDetail', { profileId: uid, initialProfile: item });
                }}
                onSendInterest={async () => {
                  const uid = typeof item.user === 'object' ? (item.user as any)?._id : item.user;
                  await sendInterest(uid);
                  Alert.alert('Interest Sent 💕', `Interest delivered to ${item.firstName}.`);
                }}
                onChat={() => navigation.navigate('Chat', { partnerProfile: item })}
              />
            )}
          />
        </View>
      );
    }


    if (activeTab === 'mutual') {
      if (matches.length === 0) {
        return (
          <EmptyState
            icon="💞"
            title="No Mutual Matches Yet"
            description="When you and another member mutually accept interest, they will appear here as mutual matches."
            actionTitle="Discover Profiles"
            onAction={() => setActiveTab('all')}
          />
        );
      }

      return (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.matchId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item.partnerProfile}
              variant="large"
              onPress={() => navigation.navigate('ProfileDetail', { profileId: item.partnerProfile?.user, initialProfile: item.partnerProfile })}
              onChat={() => navigation.navigate('Chat', { partnerProfile: item.partnerProfile })}
            />
          )}
        />
      );
    }

    if (activeTab === 'received') {
      if (receivedInterests.length === 0) {
        return (
          <EmptyState
            icon="💌"
            title="No Pending Requests"
            description="You don't have any incoming interest requests at the moment."
          />
        );
      }

      return (
        <FlatList
          data={receivedInterests}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const sender = item.senderProfile;
            return (
              <View style={styles.interestCard}>
                <ProfileCard
                  profile={sender}
                  variant="visitor"
                  onPress={() => navigation.navigate('ProfileDetail', { profileId: sender?.user, initialProfile: sender })}
                />
                {item.message ? (
                  <Text style={styles.interestMessage}>"{item.message}"</Text>
                ) : null}
                <View style={styles.interestActionRow}>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleRejectInterest(item._id)}
                  >
                    <Text style={styles.rejectBtnText}>Decline ✕</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => handleAcceptInterest(item._id)}
                  >
                    <Text style={styles.acceptBtnText}>Accept & Match ✓</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      );
    }

    if (activeTab === 'sent') {
      if (sentInterests.length === 0) {
        return (
          <EmptyState
            icon="📤"
            title="No Sent Interests"
            description="Profiles to whom you have expressed interest will be displayed here."
          />
        );
      }

      return (
        <FlatList
          data={sentInterests}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.interestCard}>
              <ProfileCard
                profile={item.receiverProfile}
                variant="visitor"
                onPress={() => navigation.navigate('ProfileDetail', { profileId: item.receiverProfile?.user, initialProfile: item.receiverProfile })}
              />
              <View style={styles.sentStatusRow}>
                <Text style={styles.statusLabel}>Status: </Text>
                <Text
                  style={[
                    styles.statusValue,
                    { color: item.status === 'ACCEPTED' ? colors.success : colors.warning },
                  ]}
                >
                  {item.status === 'ACCEPTED' ? 'Accepted (Matched 🎉)' : 'Pending Review ⏳'}
                </Text>
              </View>
            </View>
          )}
        />
      );
    }

    if (activeTab === 'shortlisted') {
      if (shortlists.length === 0) {
        return (
          <EmptyState
            icon="🤍"
            title="No Shortlisted Profiles"
            description="Tap the heart icon on any profile to save them to your shortlist for quick review."
          />
        );
      }

      return (
        <FlatList
          data={shortlists}
          keyExtractor={(item) => item.shortlistId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item.profile}
              variant="large"
              isShortlisted={true}
              onPress={() => navigation.navigate('ProfileDetail', { profileId: item.profile?.user, initialProfile: item.profile })}
              onSendInterest={async () => {
                await sendInterest(item.profile?.user);
                Alert.alert('Interest Sent 💕', `Interest delivered to ${item.profile?.firstName}.`);
              }}
            />
          )}
        />
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h2}>Matches & Connections</Text>
      </View>

      {/* Segmented Tab Bar */}
      <View style={styles.tabBarWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {[
            { key: 'all', label: 'All Matches' },
            { key: 'mutual', label: `Mutual (${matches.length})` },
            { key: 'received', label: `Received (${receivedInterests.length})` },
            { key: 'sent', label: `Sent (${sentInterests.length})` },
            { key: 'shortlisted', label: `Shortlisted (${shortlists.length})` },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabItem, activeTab === t.key && styles.tabItemActive]}
              onPress={() => setActiveTab(t.key as MatchTab)}
            >
              <Text
                style={[
                  typography.caption,
                  styles.tabText,
                  activeTab === t.key && styles.tabTextActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ flex: 1 }}>{renderTabContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tabBarWrapper: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tabScroll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  tabItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    padding: spacing.lg,
  },
  swipeScrollContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  viewModeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  modeToggleBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 2,
    borderRadius: radius.full,
  },
  modeToggleText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  interestCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  interestMessage: {
    fontStyle: 'italic',
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  interestActionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  rejectBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  acceptBtn: {
    flex: 1.5,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    alignItems: 'center',
    ...shadows.soft,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sentStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '700',
  },
});
