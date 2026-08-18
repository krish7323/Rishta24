import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { ConversationItem } from '../../components/chat/ConversationItem';
import { EmptyState } from '../../components/common/EmptyState';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { useChatStore } from '../../store/chatStore';

export const ChatListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const conversations = useChatStore((state) => state.conversations);
  const fetchConversations = useChatStore((state) => state.fetchConversations);
  const isLoading = useChatStore((state) => state.isLoading);

  useEffect(() => {
    fetchConversations();
  }, []);

  const filtered = conversations.filter((c) => {
    const name = `${c.partnerProfile?.firstName || ''} ${c.partnerProfile?.lastName || ''}`;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h2}>Messages & Chats</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search conversations..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No Active Conversations"
          description="Send an interest or accept an incoming match request to start chatting with potential partners."
          actionTitle="Explore Matches"
          onAction={() => navigation.navigate('MatchesTab')}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ConversationItem
              conversation={item}
              onPress={() =>
                navigation.navigate('Chat', {
                  conversationId: item._id,
                  partnerProfile: item.partnerProfile,
                })
              }
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchInput: {
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
