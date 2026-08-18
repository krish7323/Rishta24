import React, { useEffect } from 'react';
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
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { useMatchStore } from '../../store/matchStore';

export const VisitorsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const visitors = useMatchStore((state) => state.visitors);
  const isPremiumUnlocked = useMatchStore((state) => state.isVisitorsPremiumUnlocked);
  const totalVisitors = useMatchStore((state) => state.totalVisitorsCount);
  const fetchVisitors = useMatchStore((state) => state.fetchVisitors);
  const sendInterest = useMatchStore((state) => state.sendInterest);

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={typography.h3}>Recent Profile Visitors</Text>
        <View style={{ width: 36 }} />
      </View>

      {!isPremiumUnlocked && (
        <TouchableOpacity
          style={styles.premiumBanner}
          onPress={() => navigation.navigate('Premium')}
          activeOpacity={0.9}
        >
          <Text style={{ fontSize: 24, marginRight: spacing.md }}>👑</Text>
          <View style={{ flex: 1 }}>
            <Text style={[typography.caption, { fontWeight: '700', color: '#5A3F0B' }]}>
              Unlock All {totalVisitors || 8}+ Profile Visitors
            </Text>
            <Text style={[typography.small, { color: '#7A5B1E' }]}>
              Upgrade to Premium to view complete visitor history and contact directly.
            </Text>
          </View>
          <Text style={{ color: colors.goldDark, fontWeight: 'bold' }}>Upgrade →</Text>
        </TouchableOpacity>
      )}

      {visitors.length === 0 ? (
        <EmptyState
          icon="👀"
          title="No Profile Views Yet"
          description="As you search and send interests, members will view your profile and appear here."
        />
      ) : (
        <FlatList
          data={visitors}
          keyExtractor={(item) => item.visitorId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const timeAgo = item.lastViewedAt
              ? new Date(item.lastViewedAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recently';

            return (
              <ProfileCard
                profile={item.profile}
                variant="visitor"
                visitorTimestamp={timeAgo}
                onPress={() =>
                  navigation.navigate('ProfileDetail', {
                    profileId: item.profile?.user,
                    initialProfile: item.profile,
                  })
                }
                onSendInterest={async () => {
                  await sendInterest(item.profile?.user);
                  Alert.alert('Interest Sent 💕', `Interest delivered to ${item.profile?.firstName}.`);
                }}
              />
            );
          }}
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
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  listContent: {
    padding: spacing.lg,
  },
});
