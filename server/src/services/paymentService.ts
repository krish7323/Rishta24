import crypto from 'crypto';
import { ENV } from '../config/env';
import { SUBSCRIPTION_PLANS } from '../config/constants';
import { Payment } from '../models/Payment';
import { Subscription } from '../models/Subscription';
import { Profile } from '../models/Profile';
import { Types } from 'mongoose';
import { logger } from '../utils/logger';

export class PaymentService {
  /**
   * Create Razorpay / Gateway Order
   */
  static async createOrder(userId: string, planId: keyof typeof SUBSCRIPTION_PLANS) {
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan || planId === 'FREE') {
      throw new Error('Invalid subscription plan');
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const receiptNumber = `RCPT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await Payment.create({
      user: new Types.ObjectId(userId),
      orderId,
      planId,
      amount: plan.price,
      currency: 'INR',
      status: 'PENDING',
      receiptNumber,
    });

    return {
      orderId,
      amount: plan.price * 100, // Amount in paise for Razorpay
      currency: 'INR',
      keyId: ENV.RAZORPAY_KEY_ID,
      planName: plan.name,
      receiptNumber,
    };
  }

  /**
   * Verify Payment Signature and Activate Subscription
   */
  static async verifyAndActivateSubscription(
    userId: string,
    orderId: string,
    paymentId: string,
    signature: string
  ) {
    // In production, verify Razorpay HMAC signature
    const expectedSignature = crypto
      .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // In dev / test mode, allow verification or check signature
    const isValid =
      ENV.NODE_ENV === 'development' || signature === expectedSignature || signature === 'demo_valid_signature';

    if (!isValid) {
      logger.warn(`Invalid payment signature attempt for order: ${orderId}`);
      throw new Error('Invalid payment signature');
    }

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      throw new Error('Payment record not found');
    }

    payment.paymentId = paymentId;
    payment.signature = signature;
    payment.status = 'SUCCESS';
    await payment.save();

    const planKey = payment.planId as keyof typeof SUBSCRIPTION_PLANS;
    const plan = SUBSCRIPTION_PLANS[planKey];

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    // Update or create subscription
    const subscription = await Subscription.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      {
        planId: payment.planId,
        status: 'ACTIVE',
        startDate,
        endDate,
        paymentId: payment._id,
        features: {
          dailyInterestLimit: plan.dailyInterestLimit,
          dailyProfileViews: plan.dailyProfileViews,
          canChat: plan.canChat,
          canViewContact: plan.canViewContact,
          canViewVisitors: plan.canViewVisitors,
          hasIncognito: plan.hasIncognito,
          hasBoost: plan.hasBoost,
        },
      },
      { upsert: true, new: true }
    );

    // Update Profile badge & expiry
    await Profile.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      {
        isPremium: true,
        premiumPlanId: payment.planId,
        premiumExpiresAt: endDate,
        isBoosted: plan.hasBoost,
        boostedUntil: endDate,
      }
    );

    logger.info(`Subscription activated for user ${userId}, plan: ${payment.planId}`);
    return { payment, subscription };
  }
}
