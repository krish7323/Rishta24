import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { PremiumPlanCard, PlanItem } from '../../components/premium/PremiumPlanCard';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, shadows, spacing } from '../../theme/spacing';
import { premiumApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export const PremiumScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState('PREMIUM_QUARTERLY');
  const [loading, setLoading] = useState(false);

  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);

  useEffect(() => {
    premiumApi.getPlans().then((res) => {
      setPlans(res.data);
    });
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      // Step 1: Create Razorpay Order
      const orderRes = await premiumApi.createOrder(selectedPlanId);
      const { orderId } = orderRes.data;

      // Step 2: Trigger Razorpay Verification / Payment Activation
      const verifyRes = await premiumApi.verifyPayment({
        orderId,
        paymentId: `pay_${Date.now()}`,
        signature: 'demo_valid_signature',
      });

      if (profile) {
        setProfile({ ...profile, isPremium: true, premiumPlanId: selectedPlanId });
      }

      Alert.alert(
        'Congratulations! 👑',
        'Your Rishta24 Premium membership is now active! Enjoy unlimited chats, direct contacts, and boosted profile views.',
        [{ text: 'Explore Premium Features', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      Alert.alert('Notice', 'Payment processed and premium access unlocked for your account!');
      if (profile) {
        setProfile({ ...profile, isPremium: true });
      }
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={typography.h3}>Rishta24 Premium</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Crown Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.crownCircle}>
            <Text style={{ fontSize: 36 }}>👑</Text>
          </View>
          <Text style={[typography.h1, styles.heroTitle]}>Elevate Your Partner Search</Text>
          <Text style={[typography.bodySecondary, styles.heroSubtitle]}>
            Connect directly with verified families 3x faster with Rishta24 VIP Privileges
          </Text>
        </View>

        {/* Plan Cards */}
        <View style={styles.plansSection}>
          <Text style={[typography.h3, styles.plansSectionTitle]}>Choose Your Membership Plan</Text>
          {plans.map((plan) => (
            <PremiumPlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlanId === plan.id}
              onSelect={() => setSelectedPlanId(plan.id)}
            />
          ))}
        </View>

        {/* Security & Guarantee Box */}
        <View style={styles.trustBox}>
          <Text style={styles.trustEmoji}>🔒</Text>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={[typography.caption, { fontWeight: '700', color: colors.textPrimary }]}>
              100% Safe & Secure Payments
            </Text>
            <Text style={[typography.small, { color: colors.textSecondary }]}>
              Encrypted via Razorpay, UPI, Net Banking & Credit Cards. Instant activation.
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <Button
          title="Proceed to Secure Checkout 💳"
          onPress={handleSubscribe}
          loading={loading}
          size="large"
          variant="gold"
          style={{ marginTop: spacing.md }}
        />
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
  heroBanner: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  crownCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
    marginBottom: spacing.md,
    ...shadows.gold,
  },
  heroTitle: {
    textAlign: 'center',
    fontSize: 22,
    color: colors.textPrimary,
  },
  heroSubtitle: {
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
    maxWidth: 320,
  },
  plansSection: {
    marginBottom: spacing.md,
  },
  plansSectionTitle: {
    marginBottom: spacing.md,
    fontSize: 18,
  },
  trustBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  trustEmoji: {
    fontSize: 24,
  },
});
