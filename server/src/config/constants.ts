export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  SUPPORT: 'SUPPORT',
  FINANCE: 'FINANCE',
  USER: 'USER',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
  DELETED: 'DELETED',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
} as const;

export type AccountStatus = typeof ACCOUNT_STATUS[keyof typeof ACCOUNT_STATUS];

export const VERIFICATION_STATUS = {
  UNVERIFIED: 'UNVERIFIED',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const;

export type VerificationStatus = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'FREE',
    name: 'Free Starter',
    price: 0,
    durationDays: 365,
    dailyInterestLimit: 3,
    dailyProfileViews: 10,
    canChat: false,
    canViewContact: false,
    canViewVisitors: false,
    hasIncognito: false,
    hasBoost: false,
  },
  PREMIUM_MONTHLY: {
    id: 'PREMIUM_MONTHLY',
    name: '1 Month Premium',
    price: 1499,
    originalPrice: 1999,
    discountPercentage: 25,
    durationDays: 30,
    dailyInterestLimit: 50,
    dailyProfileViews: 200,
    canChat: true,
    canViewContact: true,
    canViewVisitors: true,
    hasIncognito: true,
    hasBoost: true,
  },
  PREMIUM_QUARTERLY: {
    id: 'PREMIUM_QUARTERLY',
    name: '3 Months Gold',
    price: 3499,
    originalPrice: 4999,
    discountPercentage: 30,
    isPopular: true,
    durationDays: 90,
    dailyInterestLimit: 150,
    dailyProfileViews: 500,
    canChat: true,
    canViewContact: true,
    canViewVisitors: true,
    hasIncognito: true,
    hasBoost: true,
  },
  PREMIUM_YEARLY: {
    id: 'PREMIUM_YEARLY',
    name: '12 Months Platinum',
    price: 7999,
    originalPrice: 15999,
    discountPercentage: 50,
    isBestValue: true,
    durationDays: 365,
    dailyInterestLimit: 9999,
    dailyProfileViews: 9999,
    canChat: true,
    canViewContact: true,
    canViewVisitors: true,
    hasIncognito: true,
    hasBoost: true,
  },
} as const;

export const INTEREST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
} as const;

export const NOTIFICATION_TYPES = {
  INTEREST_RECEIVED: 'INTEREST_RECEIVED',
  INTEREST_ACCEPTED: 'INTEREST_ACCEPTED',
  NEW_MATCH: 'NEW_MATCH',
  NEW_MESSAGE: 'NEW_MESSAGE',
  PROFILE_VIEW: 'PROFILE_VIEW',
  SHORTLIST: 'SHORTLIST',
  VERIFICATION_APPROVED: 'VERIFICATION_APPROVED',
  VERIFICATION_REJECTED: 'VERIFICATION_REJECTED',
  PREMIUM_ACTIVATED: 'PREMIUM_ACTIVATED',
  PREMIUM_EXPIRING: 'PREMIUM_EXPIRING',
  SECURITY_ALERT: 'SECURITY_ALERT',
} as const;
