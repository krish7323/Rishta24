import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dateOfBirth: z.string().or(z.date()),
  motherTongue: z.string().min(2, 'Mother tongue is required'),
  religion: z.string().min(2, 'Religion is required'),
  community: z.string().min(2, 'Community is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  educationLevel: z.string().min(2, 'Education level is required'),
  degree: z.string().min(2, 'Degree is required'),
  occupation: z.string().min(2, 'Occupation is required'),
  referralCode: z.string().optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Email or Phone is required'),
  password: z.string().min(6, 'Password is required'),
});

export const sendOtpSchema = z.object({
  identifier: z.string().min(3, 'Email or Phone is required'),
  purpose: z.enum(['REGISTRATION', 'LOGIN', 'FORGOT_PASSWORD', 'VERIFY_PHONE']),
});

export const verifyOtpSchema = z.object({
  identifier: z.string().min(3, 'Email or Phone is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  purpose: z.enum(['REGISTRATION', 'LOGIN', 'FORGOT_PASSWORD', 'VERIFY_PHONE']),
});

export const resetPasswordSchema = z.object({
  identifier: z.string().min(3, 'Email or Phone is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});
