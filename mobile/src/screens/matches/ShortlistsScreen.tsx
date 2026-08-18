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
import { spacing } from '../../theme/spacing';
import { useMatchStore } from '../../store/matchStore';

export const ShortlistsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const shortlists = useMatchStore((state) => state.shortlists);
  const fetchShortlists = useMatchStore((state) => state.fetchShortlists);
  const sendInterest = useMatchStore((state) => state.sendInterest);

  useEffect(() => {
    fetchShortlists();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={typography.h3}>Shortlisted Profiles 🤍</Text>
        <View style={{ width: 36 }} />
      </View>

      {shortlists.length === 0 ? (
        <EmptyState
          icon="🤍"
          title="No Shortlisted Profiles"
          description="Tap the heart icon on any candidate profile to bookmark them for easy access later."
          actionTitle="Explore Matches"
          onAction={() => navigation.navigate('Main')}
        />
      ) : (
        <FlatList
          data={shortlists}
          keyExtractor={(item) => item.shortlistId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item.profile}
              variant="large"
              isShortlisted={true}
              onPress={() =>
                navigation.navigate('ProfileDetail', {
                  profileId: item.profile?.user,
                  initialProfile: item.profile,
                })
              }
              onSendInterest={async () => {
                await sendInterest(item.profile?.user);
                Alert.alert('Interest Sent 💕', `Interest request sent to ${item.profile?.firstName}.`);
              }}
            />
          )}
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
  listContent: {
    padding: spacing.lg,
  },
});
