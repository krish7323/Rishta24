import mongoose, { Schema, Document, Types } from 'mongoose';
import { VERIFICATION_STATUS, VerificationStatus } from '../config/constants';

export interface IProfilePhoto {
  _id?: Types.ObjectId;
  url: string;
  isPrimary: boolean;
  privacy: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
  isApproved: boolean;
  uploadedAt: Date;
}

export interface IPartnerPreferences {
  minAge: number;
  maxAge: number;
  minHeight: number; // in cm
  maxHeight: number; // in cm
  maritalStatus: string[];
  religions: string[];
  communities: string[];
  motherTongues: string[];
  educations: string[];
  occupations: string[];
  minIncome: number;
  diets: string[];
  states: string[];
  countries: string[];
}

export interface IPrivacySettings {
  profileVisibility: 'PUBLIC' | 'REGISTERED_ONLY' | 'MUTUAL_MATCH_ONLY';
  phoneVisibility: 'PUBLIC' | 'PREMIUM_ONLY' | 'UPON_REQUEST' | 'PRIVATE';
  emailVisibility: 'PUBLIC' | 'PREMIUM_ONLY' | 'UPON_REQUEST' | 'PRIVATE';
  photoVisibility: 'PUBLIC' | 'REGISTERED_ONLY' | 'UPON_REQUEST' | 'PRIVATE';
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  allowSearchEngines: boolean;
  incognitoMode: boolean;
}

export interface INotificationSettings {
  emailAlerts: boolean;
  pushAlerts: boolean;
  smsAlerts: boolean;
  interestReceived: boolean;
  interestAccepted: boolean;
  messages: boolean;
  profileViewed: boolean;
  matchesRecommended: boolean;
  promotions: boolean;
}

export interface IProfile extends Document {
  user: Types.ObjectId;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: Date;
  age: number;
  height: number; // in cm
  motherTongue: string;
  maritalStatus: 'NEVER_MARRIED' | 'DIVORCED' | 'WIDOWED' | 'AWAITING_DIVORCE';
  religion: string;
  community: string;
  caste?: string;
  subCaste?: string;
  gotra?: string;
  manglik: 'NO' | 'YES' | 'DO_NOT_KNOW' | 'ANSHIK';
  about: string;
  
  // Location
  city: string;
  state: string;
  country: string;
  citizenship: string;
  residencyStatus?: string;

  // Education & Profession
  educationLevel: string;
  degree: string;
  college?: string;
  occupation: string;
  employer?: string;
  annualIncome: number; // in Lakhs INR (e.g., 12.5)
  incomeRange: string; // e.g. "₹10 - 15 Lakhs"

  // Family
  familyType: 'JOINT' | 'NUCLEAR';
  fatherOccupation: string;
  motherOccupation: string;
  brothersCount: number;
  sistersCount: number;
  familyValues: 'TRADITIONAL' | 'MODERATE' | 'LIBERAL';
  familyLocation?: string;

  // Lifestyle
  diet: 'VEGETARIAN' | 'NON_VEGETARIAN' | 'EGGETARIAN' | 'JAIN' | 'VEGAN';
  smoking: 'NO' | 'OCCASIONALLY' | 'YES';
  drinking: 'NO' | 'OCCASIONALLY' | 'YES';
  hobbies: string[];
  interests: string[];

  // Photos
  avatar: string;
  photos: IProfilePhoto[];
  
  // Partner Preferences
  partnerPreferences: IPartnerPreferences;

  // Settings
  privacySettings: IPrivacySettings;
  notificationSettings: INotificationSettings;

  // Verification & Metrics
  verificationStatus: VerificationStatus;
  verificationBadge: boolean;
  profileCompletion: number; // 0 - 100 %
  isPremium: boolean;
  premiumPlanId?: string;
  premiumExpiresAt?: Date;
  isBoosted: boolean;
  boostedUntil?: Date;
  viewCount: number;
  shortlistCount: number;
  interestCount: number;
  lastActiveAt: Date;
  isOnline: boolean;

  createdAt: Date;
  updatedAt: Date;
  calculateCompletion(): number;
}

const ProfileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true, index: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true, index: true },
    height: { type: Number, required: true, index: true },
    motherTongue: { type: String, required: true, index: true },
    maritalStatus: {
      type: String,
      enum: ['NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'AWAITING_DIVORCE'],
      default: 'NEVER_MARRIED',
      index: true,
    },
    religion: { type: String, required: true, index: true },
    community: { type: String, required: true, index: true },
    caste: { type: String, index: true },
    subCaste: String,
    gotra: String,
    manglik: {
      type: String,
      enum: ['NO', 'YES', 'DO_NOT_KNOW', 'ANSHIK'],
      default: 'NO',
    },
    about: { type: String, default: '' },

    // Location
    city: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    country: { type: String, default: 'India', index: true },
    citizenship: { type: String, default: 'Indian' },
    residencyStatus: String,

    // Education & Career
    educationLevel: { type: String, required: true },
    degree: { type: String, required: true },
    college: String,
    occupation: { type: String, required: true, index: true },
    employer: String,
    annualIncome: { type: Number, default: 0, index: true },
    incomeRange: { type: String, default: 'Not specified' },

    // Family
    familyType: { type: String, enum: ['JOINT', 'NUCLEAR'], default: 'NUCLEAR' },
    fatherOccupation: { type: String, default: 'Not Specified' },
    motherOccupation: { type: String, default: 'Home Maker' },
    brothersCount: { type: Number, default: 0 },
    sistersCount: { type: Number, default: 0 },
    familyValues: { type: String, enum: ['TRADITIONAL', 'MODERATE', 'LIBERAL'], default: 'MODERATE' },
    familyLocation: String,

    // Lifestyle
    diet: {
      type: String,
      enum: ['VEGETARIAN', 'NON_VEGETARIAN', 'EGGETARIAN', 'JAIN', 'VEGAN'],
      default: 'VEGETARIAN',
      index: true,
    },
    smoking: { type: String, enum: ['NO', 'OCCASIONALLY', 'YES'], default: 'NO' },
    drinking: { type: String, enum: ['NO', 'OCCASIONALLY', 'YES'], default: 'NO' },
    hobbies: [{ type: String }],
    interests: [{ type: String }],

    // Photos
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    photos: [
      {
        url: String,
        isPrimary: { type: Boolean, default: false },
        privacy: { type: String, enum: ['PUBLIC', 'PROTECTED', 'PRIVATE'], default: 'PUBLIC' },
        isApproved: { type: Boolean, default: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // Partner Preferences
    partnerPreferences: {
      minAge: { type: Number, default: 21 },
      maxAge: { type: Number, default: 35 },
      minHeight: { type: Number, default: 150 },
      maxHeight: { type: Number, default: 195 },
      maritalStatus: { type: [String], default: ['NEVER_MARRIED'] },
      religions: { type: [String], default: [] },
      communities: { type: [String], default: [] },
      motherTongues: { type: [String], default: [] },
      educations: { type: [String], default: [] },
      occupations: { type: [String], default: [] },
      minIncome: { type: Number, default: 0 },
      diets: { type: [String], default: [] },
      states: { type: [String], default: [] },
      countries: { type: [String], default: ['India'] },
    },

    // Privacy & Notification
    privacySettings: {
      profileVisibility: { type: String, default: 'PUBLIC' },
      phoneVisibility: { type: String, default: 'PREMIUM_ONLY' },
      emailVisibility: { type: String, default: 'PREMIUM_ONLY' },
      photoVisibility: { type: String, default: 'PUBLIC' },
      showOnlineStatus: { type: Boolean, default: true },
      showLastSeen: { type: Boolean, default: true },
      allowSearchEngines: { type: Boolean, default: false },
      incognitoMode: { type: Boolean, default: false },
    },
    notificationSettings: {
      emailAlerts: { type: Boolean, default: true },
      pushAlerts: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: false },
      interestReceived: { type: Boolean, default: true },
      interestAccepted: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      profileViewed: { type: Boolean, default: true },
      matchesRecommended: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false },
    },

    // Verification & Metrics
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.UNVERIFIED,
      index: true,
    },
    verificationBadge: { type: Boolean, default: false, index: true },
    profileCompletion: { type: Number, default: 20 },
    isPremium: { type: Boolean, default: false, index: true },
    premiumPlanId: String,
    premiumExpiresAt: Date,
    isBoosted: { type: Boolean, default: false },
    boostedUntil: Date,
    viewCount: { type: Number, default: 0 },
    shortlistCount: { type: Number, default: 0 },
    interestCount: { type: Number, default: 0 },
    lastActiveAt: { type: Date, default: Date.now, index: true },
    isOnline: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for high-speed matchmaking queries
ProfileSchema.index({ gender: 1, age: 1, religion: 1, city: 1 });
ProfileSchema.index({ isPremium: -1, verificationBadge: -1, lastActiveAt: -1 });

ProfileSchema.methods.calculateCompletion = function (): number {
  let score = 0;
  if (this.firstName && this.lastName && this.gender && this.dateOfBirth) score += 20;
  if (this.avatar && this.photos?.length > 0) score += 15;
  if (this.about && this.about.length > 20) score += 10;
  if (this.educationLevel && this.degree && this.occupation) score += 15;
  if (this.city && this.state) score += 10;
  if (this.religion && this.community) score += 10;
  if (this.fatherOccupation && this.motherOccupation) score += 10;
  if (this.partnerPreferences?.minAge) score += 10;
  return Math.min(score, 100);
};

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
