import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Avatar } from '../../components/common/Avatar';
import { EmptyState } from '../../components/common/EmptyState';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { generalApi } from '../../services/api';
import { IProfile } from '../../types/models';

export const BlockedUsersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [blockedUsers, setBlockedUsers] = useState<IProfile[]>([]);

  useEffect(() => {
    generalApi.getBlockedUsers().then((res) => {
      setBlockedUsers(res.data);
    });
  }, []);

  const handleUnblock = async (targetId: string, name: string) => {
    Alert.alert('Unblock Member', `Are you sure you want to unblock ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unblock',
        onPress: async () => {
          await generalApi.unblockUser(targetId);
          setBlockedUsers((prev) =>
            prev.filter((p) => {
              const uid = typeof p.user === 'object' ? (p.user as any)?._id : p.user;
              return uid !== targetId;
            })
          );
          Alert.alert('Success', `${name} has been unblocked.`);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={typography.h3}>Blocked Users</Text>
        <View style={{ width: 36 }} />
      </View>

      {blockedUsers.length === 0 ? (
        <EmptyState
          icon="🛡️"
          title="No Blocked Users"
          description="Members you block will be listed here. They will not be able to message you or view your details."
        />
      ) : (
        <FlatList
          data={blockedUsers}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Avatar url={item.avatar} size={48} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={typography.h3}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={typography.caption}>
                  {item.city} • {item.occupation}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.unblockBtn}
                onPress={() => {
                  const uid = typeof item.user === 'object' ? (item.user as any)?._id : item.user;
                  handleUnblock(uid, item.firstName);
                }}
              >
                <Text style={styles.unblockText}>Unblock</Text>
              </TouchableOpacity>
            </View>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unblockBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  unblockText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
});
