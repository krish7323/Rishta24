import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Subscription } from '../models/Subscription';
import { Payment } from '../models/Payment';
import { SUBSCRIPTION_PLANS } from '../config/constants';
import { PaymentService } from '../services/paymentService';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';

export class PremiumController {
  /**
   * Get all available premium plans & feature matrix
   */
  static async getPlans(req: AuthRequest, res: Response): Promise<void> {
    try {
      const plans = [
        {
          id: 'PREMIUM_MONTHLY',
          name: '1 Month Gold',
          tagline: 'Ideal for quick connections',
          price: 1499,
          originalPrice: 1999,
          discountPercentage: 25,
          durationDays: 30,
          isPopular: false,
          features: [
            '50 Interests per day',
            '200 Profile views per day',
            'Unlimited direct chat',
            'View contact phone & email',
            'See who viewed your profile',
            'Instant match notifications',
          ],
        },
        {
          id: 'PREMIUM_QUARTERLY',
          name: '3 Months Diamond',
          tagline: 'Most loved by families',
          price: 3499,
          originalPrice: 4999,
          discountPercentage: 30,
          durationDays: 90,
          isPopular: true,
          badge: 'MOST POPULAR',
          features: [
            '150 Interests per day',
            '500 Profile views per day',
            'Unlimited direct chat & media',
            'View all verified phone numbers',
            'Complete visitor history',
            'Profile Boost (3x more views)',
            'Priority Customer Support',
          ],
        },
        {
          id: 'PREMIUM_YEARLY',
          name: '12 Months Platinum VIP',
          tagline: 'Until you find your soulmate',
          price: 7999,
          originalPrice: 15999,
          discountPercentage: 50,
          durationDays: 365,
          isBestValue: true,
          badge: 'BEST VALUE (SAVE 50%)',
          features: [
            'Unlimited Interests',
            'Unlimited Profile views',
            'Direct WhatsApp & Call Connect',
            'Dedicated Relationship Advisor',
            'Top search ranking placement',
            'Incognito Mode browsing',
            'Priority verification badge',
            'Full Astro / Kundali matching',
          ],
        },
      ];

      sendSuccess(res, plans, 'Plans fetched successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get user's active subscription details
   */
  static async getMySubscription(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const subscription = await Subscription.findOne({
        user: new Types.ObjectId(userId),
        status: 'ACTIVE',
      });

      sendSuccess(res, subscription, 'Subscription status fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Create Razorpay Order
   */
  static async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { planId } = req.body;

      const orderData = await PaymentService.createOrder(userId, planId);
      sendSuccess(res, orderData, 'Order created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  /**
   * Verify Razorpay Payment and Activate Subscription
   */
  static async verifyPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { orderId, paymentId, signature } = req.body;

      const result = await PaymentService.verifyAndActivateSubscription(
        userId,
        orderId,
        paymentId,
        signature
      );

      sendSuccess(res, result, 'Payment verified and subscription activated successfully! 🎉');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
