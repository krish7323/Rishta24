import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { EmptyState } from '../../components/common/EmptyState';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { generalApi } from '../../services/api';
import { INotificationItem } from '../../types/models';

export const NotificationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<INotificationItem[]>([]);

  useEffect(() => {
    generalApi.getNotifications().then((res) => {
      setNotifications(res.data.notifications);
      generalApi.markAllNotificationsRead();
    });
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_MATCH':
        return '❤️';
      case 'INTEREST_RECEIVED':
        return '💌';
      case 'INTEREST_ACCEPTED':
        return '🎉';
      case 'NEW_MESSAGE':
        return '💬';
      case 'VERIFICATION_APPROVED':
        return '🛡️';
      case 'PREMIUM_ACTIVATED':
        return '👑';
      default:
        return '🔔';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={typography.h3}>Notifications</Text>
        <View style={{ width: 36 }} />
      </View>

      {notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No Notifications"
          description="You are all caught up! Updates regarding matches, interests, and messages will appear here."
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.notificationCard, !item.isRead && styles.unreadCard]}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 20 }}>{getNotificationIcon(item.type)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={[typography.h3, styles.notifTitle]}>{item.title}</Text>
                <Text style={[typography.bodySecondary, styles.notifBody]}>{item.body}</Text>
                <Text style={[typography.small, styles.notifTime]}>
                  {new Date(item.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
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
    padding: spacing.md,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  unreadCard: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primaryBorder,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  notifBody: {
    marginTop: 2,
    fontSize: 13,
  },
  notifTime: {
    marginTop: 4,
    color: colors.textMuted,
  },
});
