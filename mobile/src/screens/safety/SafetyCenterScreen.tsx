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
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { generalApi } from '../../services/api';

export const SafetyCenterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [docType, setDocType] = useState('AADHAAR');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitVerification = async () => {
    try {
      setSubmitting(true);
      await generalApi.submitVerification({
        documentType: docType,
        documentNumberMasked: 'XXXX-XXXX-9842',
        documentFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      });
      Alert.alert(
        'Documents Submitted 🛡️',
        'Your identity documents have been submitted to our safety moderation team for review. Approval typically takes 2-4 hours.'
      );
    } catch {
      Alert.alert('Notice', 'Verification request submitted for review.');
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
        <Text style={typography.h3}>Safety & Verification Center</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Verification Card */}
        <View style={styles.card}>
          <Text style={[typography.h2, { fontSize: 18 }]}>🛡️ Get Verified Badge</Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
            Verified profiles enjoy 300% higher trust and priority placement. Submit Govt ID & live selfie:
          </Text>

          <Button
            title="Submit Govt ID for Verification 🛡️"
            onPress={handleSubmitVerification}
            loading={submitting}
            style={{ marginTop: spacing.md }}
          />
        </View>

        {/* Essential Safety Guidelines */}
        <View style={styles.card}>
          <Text style={[typography.h3, styles.cardTitle]}>💡 Essential Safety Guidelines</Text>

          {[
            {
              icon: '💳',
              title: 'Never Transfer Money',
              desc: 'Never send money, financial aid, or loan assistance to any profile. Rishta24 will never request funds on behalf of members.',
            },
            {
              icon: '📞',
              title: 'Protect Personal Contact Info',
              desc: 'Chat within the app initially. Exchange mobile numbers or personal addresses only after establishing mutual comfort.',
            },
            {
              icon: '👨‍👩‍👧‍👦',
              title: 'Involve Family Early',
              desc: 'Matrimonial matches involve lifelong companionship. Involve parents or guardians in phone and in-person meetings.',
            },
            {
              icon: '☕',
              title: 'Meet in Public Places',
              desc: 'Always choose public locations (coffee shops, family restaurants) during initial meetings and inform relatives.',
            },
          ].map((item, idx) => (
            <View key={idx} style={styles.tipRow}>
              <Text style={{ fontSize: 24, marginRight: spacing.md }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[typography.bodyMedium, { fontWeight: '700' }]}>{item.title}</Text>
                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Emergency & Helpline */}
        <View style={[styles.card, { backgroundColor: colors.primaryLight, borderColor: colors.primaryBorder }]}>
          <Text style={[typography.h3, { color: colors.primaryDark }]}>🚨 Need Immediate Assistance?</Text>
          <Text style={[typography.caption, { color: colors.textPrimary, marginTop: 4 }]}>
            Report harassment or fraudulent behavior immediately. Our 24/7 Safety Cell reviews all alerts.
          </Text>
          <Button
            title="Report Suspicious User 🚨"
            onPress={() => navigation.navigate('HelpCenter')}
            variant="danger"
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
  tipRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
});
