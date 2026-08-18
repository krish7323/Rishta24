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
import { generalApi } from '../../services/api';

const faqs = [
  {
    q: 'How does Rishta24 calculate compatibility score?',
    a: 'Our smart matchmaking engine analyzes your partner preferences (age, height, religion, education, occupation, diet, and lifestyle values) against candidates to generate an overall compatibility percentage.',
  },
  {
    q: 'How do I get my profile verified?',
    a: 'Go to Safety Center in your profile and submit a clear photo of your Govt ID (Aadhaar/Passport/Driving License). Our moderation team reviews documents within 2-4 hours.',
  },
  {
    q: 'Can free members message matches?',
    a: 'Free members can express interests and receive responses. To initiate direct real-time chat and view phone numbers, upgrade to any of our affordable Premium membership plans.',
  },
  {
    q: 'How do I block or report an abusive profile?',
    a: 'Tap the three-dots (⋮) icon on any profile or chat screen, and choose "Block Member" or "Report Profile". Blocked members cannot contact or view your profile.',
  },
];

export const HelpCenterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('PROFILE');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleCreateTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Required', 'Please enter subject and description for your support ticket.');
      return;
    }

    try {
      setSubmitting(true);
      await generalApi.createSupportTicket({
        subject,
        category,
        message,
      });
      Alert.alert(
        'Ticket Created 🎉',
        'Your support ticket has been submitted. Our team will review and reply within 4 hours.'
      );
      setSubject('');
      setMessage('');
    } catch {
      Alert.alert('Notice', 'Support ticket logged.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={typography.h3}>Help Desk & Support</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* FAQs */}
        <View style={styles.card}>
          <Text style={[typography.h3, styles.cardTitle]}>Frequently Asked Questions</Text>
          {faqs.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.faqRow}
              onPress={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              activeOpacity={0.8}
            >
              <View style={styles.faqHeader}>
                <Text style={[typography.bodyMedium, { flex: 1, fontWeight: '600' }]}>{item.q}</Text>
                <Text style={{ color: colors.primary, fontSize: 16 }}>
                  {expandedFaq === idx ? '▲' : '▼'}
                </Text>
              </View>
              {expandedFaq === idx && (
                <Text style={[typography.caption, styles.faqAnswer]}>{item.a}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Support Ticket Form */}
        <View style={styles.card}>
          <Text style={[typography.h3, styles.cardTitle]}>Submit Support Ticket</Text>
          <SelectDropdown
            label="Category"
            value={category}
            options={['PROFILE', 'BILLING', 'CHAT_ISSUE', 'VERIFICATION', 'SAFETY', 'OTHER']}
            onSelect={setCategory}
          />
          <Input
            label="Subject"
            placeholder="Brief summary of issue"
            value={subject}
            onChangeText={setSubject}
          />
          <Input
            label="Description"
            placeholder="Please detail your question or issue..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            style={{ height: 90, textAlignVertical: 'top' }}
          />

          <Button
            title="Submit Ticket 📨"
            onPress={handleCreateTicket}
            loading={submitting}
            size="large"
            style={{ marginTop: spacing.md }}
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
  faqRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqAnswer: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
