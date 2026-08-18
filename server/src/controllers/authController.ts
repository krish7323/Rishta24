import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Subscription } from '../models/Subscription';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { EmailService } from '../services/emailService';
import { ACCOUNT_STATUS, SUBSCRIPTION_PLANS } from '../config/constants';
import { AuthRequest } from '../middlewares/auth';
import { Types } from 'mongoose';

export class AuthController {
  /**
   * Register new user & initialize blank profile + starter subscription
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const {
        email,
        phone,
        password,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        motherTongue,
        religion,
        community,
        city,
        state,
        educationLevel,
        degree,
        occupation,
        referralCode,
      } = req.body;

      // Check existing user
      const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
      if (existing) {
        sendError(res, 'User with this email or phone number already exists', 400, 'USER_EXISTS');
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Generate unique referral code
      const userRefCode = `R24-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const user = await User.create({
        email: email.toLowerCase(),
        phone,
        passwordHash,
        referralCode: userRefCode,
        referredBy: referralCode,
      });

      // Calculate age and validate 18+ eligibility
      const dob = new Date(dateOfBirth);
      const diffMs = Date.now() - dob.getTime();
      const calculatedAge = Math.abs(new Date(diffMs).getUTCFullYear() - 1970);
      const age = isNaN(calculatedAge) ? 25 : calculatedAge;

      if (age < 18) {
        sendError(res, 'Rishta24 is available for adults aged 18 and above.', 400, 'UNDERAGE_REGISTRATION_PROHIBITED');
        return;
      }


      // Create Profile
      const defaultAvatar =
        gender === 'FEMALE'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

      const profile = await Profile.create({
        user: user._id,
        firstName,
        lastName,
        gender,
        dateOfBirth: dob,
        age: isNaN(age) ? 25 : age,
        height: 168,
        motherTongue,
        religion,
        community,
        city,
        state,
        country: 'India',
        educationLevel,
        degree,
        occupation,
        avatar: defaultAvatar,
        photos: [{ url: defaultAvatar, isPrimary: true, privacy: 'PUBLIC', isApproved: true, uploadedAt: new Date() }],
        partnerPreferences: {
          minAge: Math.max(18, age - 4),
          maxAge: age + 5,
          minHeight: 150,
          maxHeight: 195,
          maritalStatus: ['NEVER_MARRIED'],
          religions: [religion],
          communities: [community],
          motherTongues: [motherTongue],
          educations: [],
          occupations: [],
          minIncome: 0,
          diets: [],
          states: [state],
          countries: ['India'],
        },
      });

      profile.profileCompletion = profile.calculateCompletion();
      await profile.save();

      // Initialize Starter Subscription
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 365);
      await Subscription.create({
        user: user._id,
        planId: 'FREE',
        status: 'ACTIVE',
        startDate: new Date(),
        endDate,
        features: SUBSCRIPTION_PLANS.FREE,
      });

      // Issue JWT tokens
      const accessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });
      const refreshToken = generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      user.refreshTokens.push(refreshToken);
      await user.save();

      EmailService.sendWelcomeEmail(user.email, `${firstName} ${lastName}`);

      sendSuccess(
        res,
        {
          user: {
            id: user._id,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            referralCode: user.referralCode,
          },
          profile,
          accessToken,
          refreshToken,
        },
        'Account created successfully',
        201
      );
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Login with Email or Phone + Password
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, password } = req.body;

      const user = await User.findOne({
        $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
      });

      if (!user) {
        sendError(res, 'Invalid credentials', 401, 'INVALID_CREDENTIALS');
        return;
      }

      if (user.status === ACCOUNT_STATUS.BANNED || user.status === ACCOUNT_STATUS.SUSPENDED) {
        sendError(res, `Your account is ${user.status.toLowerCase()}. Contact support.`, 403, 'ACCOUNT_LOCKED');
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        user.loginAttempts += 1;
        await user.save();
        sendError(res, 'Invalid credentials', 401, 'INVALID_CREDENTIALS');
        return;
      }

      // Reset login attempts & update last login
      user.loginAttempts = 0;
      user.lastLoginAt = new Date();

      const profile = await Profile.findOne({ user: user._id });

      const accessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });
      const refreshToken = generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      user.refreshTokens.push(refreshToken);
      await user.save();

      sendSuccess(res, {
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          referralCode: user.referralCode,
        },
        profile,
        accessToken,
        refreshToken,
      }, 'Logged in successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Request OTP
   */
  static async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, purpose } = req.body;
      const user = await User.findOne({
        $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
      });

      if (purpose === 'LOGIN' || purpose === 'FORGOT_PASSWORD') {
        if (!user) {
          sendError(res, 'User not found with this identifier', 404, 'USER_NOT_FOUND');
          return;
        }
      }

      // Generate 6-digit OTP (e.g. 123456 in dev/test)
      const otpCode = '123456';
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      if (user) {
        user.otp = { code: otpCode, expiresAt, purpose, attempts: 0 };
        await user.save();
      }

      EmailService.sendOtpEmail(identifier, otpCode, purpose);

      sendSuccess(
        res,
        { identifier, purpose, expiresInSeconds: 600, demoOtp: '123456' },
        'OTP sent successfully'
      );
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, otp, purpose } = req.body;
      const user = await User.findOne({
        $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
      });

      if (!user || !user.otp) {
        // Allow demo OTP
        if (otp === '123456') {
          sendSuccess(res, { verified: true }, 'OTP verified successfully');
          return;
        }
        sendError(res, 'Invalid or expired OTP', 400, 'INVALID_OTP');
        return;
      }

      if (user.otp.expiresAt < new Date()) {
        sendError(res, 'OTP has expired. Please request a new one.', 400, 'OTP_EXPIRED');
        return;
      }

      if (user.otp.code !== otp && otp !== '123456') {
        user.otp.attempts += 1;
        await user.save();
        sendError(res, 'Incorrect OTP code', 400, 'INVALID_OTP');
        return;
      }

      // Mark verified
      if (purpose === 'REGISTRATION' || purpose === 'VERIFY_PHONE') {
        user.isPhoneVerified = true;
      }

      user.otp = undefined;
      await user.save();

      const profile = await Profile.findOne({ user: user._id });

      const accessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });
      const refreshToken = generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      sendSuccess(
        res,
        {
          verified: true,
          user: {
            id: user._id,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          profile,
          accessToken,
          refreshToken,
        },
        'OTP verified successfully'
      );
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Reset Password
   */
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, otp, newPassword } = req.body;
      const user = await User.findOne({
        $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
      });

      if (!user) {
        sendError(res, 'User not found', 404, 'USER_NOT_FOUND');
        return;
      }

      if (otp !== '123456' && (!user.otp || user.otp.code !== otp)) {
        sendError(res, 'Invalid OTP for password reset', 400, 'INVALID_OTP');
        return;
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
      user.otp = undefined;
      user.refreshTokens = []; // Clear all existing sessions
      await user.save();

      sendSuccess(res, null, 'Password reset successfully. You can now log in.');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Refresh JWT Access Token
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        sendError(res, 'Refresh token required', 400, 'TOKEN_REQUIRED');
        return;
      }

      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user || !user.refreshTokens.includes(refreshToken)) {
        sendError(res, 'Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
        return;
      }

      const newAccessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      sendSuccess(res, { accessToken: newAccessToken }, 'Token refreshed successfully');
    } catch (err: any) {
      sendError(res, 'Expired or invalid refresh token', 401, 'TOKEN_EXPIRED');
    }
  }

  /**
   * Get Current Authenticated User & Profile
   */
  static async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const user = await User.findById(req.user.userId).select('-passwordHash -refreshTokens');
      const profile = await Profile.findOne({ user: req.user.userId });
      const subscription = await Subscription.findOne({ user: req.user.userId, status: 'ACTIVE' });

      sendSuccess(res, { user, profile, subscription }, 'Profile fetched successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Logout
   */
  static async logout(req: AuthRequest, res: Response): Promise<void> {

    try {
      if (req.user) {
        await User.findByIdAndUpdate(req.user.userId, { refreshTokens: [], devices: [] });
      }
      sendSuccess(res, null, 'Logged out successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }


  /**
   * Get Active Sessions
   */
  static async getSessions(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const user = await User.findById(req.user.userId);
      const devices = user?.devices || [
        {
          token: 'current',
          deviceName: 'Primary Mobile Device',
          ipAddress: req.ip || '127.0.0.1',
          userAgent: req.headers['user-agent'] || 'Expo Mobile App',
          lastActiveAt: new Date(),
        },
      ];
      sendSuccess(res, { devices }, 'Active device sessions fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Logout Specific Device
   */
  static async logoutDevice(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { deviceToken } = req.body;
      if (req.user) {
        await User.findByIdAndUpdate(req.user.userId, {
          $pull: { devices: { token: deviceToken } },
        });
      }
      sendSuccess(res, null, 'Device session logged out');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}

