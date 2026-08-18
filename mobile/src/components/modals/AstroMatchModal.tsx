import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';

interface AstroMatchModalProps {
  visible: boolean;
  partnerName: string;
  onClose: () => void;
}

const gunaBreakdown = [
  { name: 'Nadi (Health & Genes)', score: '8 / 8', desc: 'Optimal genetic & physical vitality alignment' },
  { name: 'Bhakoot (Emotional Harmony)', score: '7 / 7', desc: 'Deep emotional closeness & family prosperity' },
  { name: 'Gana (Temperament)', score: '6 / 6', desc: 'Deva-Deva matching temperament & mutual respect' },
  { name: 'Maitri (Friendship & Mind)', score: '5 / 5', desc: 'Exceptional intellectual rapport & communication' },
  { name: 'Yoni (Physical Attraction)', score: '3.5 / 4', desc: 'High physical chemistry & lifestyle sync' },
  { name: 'Tara (Destiny & Fortune)', score: '3 / 3', desc: 'Promotes good health and prosperity after marriage' },
  { name: 'Vasya (Mutual Attraction)', score: '2 / 2', desc: 'Strong natural devotion & understanding' },
  { name: 'Varna (Spiritual Alignment)', score: '1 / 1', desc: 'Harmonious spiritual goals & work ethics' },
];

export const AstroMatchModal: React.FC<AstroMatchModalProps> = ({
  visible,
  partnerName,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={{ fontSize: 24 }}>✨</Text>
              <Text style={[typography.h3, styles.titleText]}>
                36-Guna Kundali Match
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ fontSize: 18, color: colors.textSecondary }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Total Guna Banner */}
            <View style={styles.scoreBanner}>
              <Text style={styles.scoreNumber}>35.5 / 36</Text>
              <Text style={styles.scoreTag}>🌟 EXCELLENT VEDIC KUNDALI MATCH</Text>
              <Text style={styles.scoreSubtext}>
                Match report between your profile and <Text style={{ fontWeight: '700' }}>{partnerName}</Text>
              </Text>
            </View>

            {/* Guna Breakdown List */}
            <Text style={[typography.h3, styles.sectionHeader]}>Ashtakoot Guna Details</Text>

            {gunaBreakdown.map((item, idx) => (
              <View key={idx} style={styles.gunaRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.bodyMedium, { fontWeight: '700', color: colors.textPrimary }]}>
                    {item.name}
                  </Text>
                  <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 1 }]}>
                    {item.desc}
                  </Text>
                </View>
                <View style={styles.scorePill}>
                  <Text style={styles.scorePillText}>{item.score}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.downloadBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.downloadBtnText}>Close Report ✓</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(25, 10, 16, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    maxHeight: '85%',
    padding: spacing.xl,
    ...shadows.elevated,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  titleText: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  scrollBody: {
    paddingVertical: spacing.md,
  },
  scoreBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: radius.xxl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
    marginBottom: spacing.lg,
    ...shadows.gold,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.goldDark,
  },
  scoreTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7A5B1E',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  scoreSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  gunaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  scorePill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    borderRadius: radius.full,
    marginLeft: spacing.sm,
  },
  scorePillText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  downloadBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    alignItems: 'center',
    marginTop: spacing.xl,
    ...shadows.soft,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
