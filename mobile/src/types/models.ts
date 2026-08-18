export interface IUser {
  id: string;
  _id?: string;
  email: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'SUPPORT' | 'FINANCE' | 'USER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED' | 'DELETED' | 'PENDING_VERIFICATION';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  referralCode: string;
  createdAt: string;
}

export interface IProfilePhoto {
  _id?: string;
  url: string;
  isPrimary: boolean;
  privacy: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
  isApproved: boolean;
}

export interface IPartnerPreferences {
  minAge: number;
  maxAge: number;
  minHeight: number;
  maxHeight: number;
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

export interface ICompatibility {
  overallScore: number;
  ageScore?: number;
  religionScore?: number;
  locationScore?: number;
  educationScore?: number;
  lifestyleScore?: number;
  interestsScore?: number;
  matchedCriteria?: string[];
}

export interface IProfile {
  _id: string;
  user: string | IUser;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  age: number;
  height: number;
  motherTongue: string;
  maritalStatus: 'NEVER_MARRIED' | 'DIVORCED' | 'WIDOWED' | 'AWAITING_DIVORCE';
  religion: string;
  community: string;
  caste?: string;
  subCaste?: string;
  gotra?: string;
  manglik: 'NO' | 'YES' | 'DO_NOT_KNOW' | 'ANSHIK';
  about: string;

  city: string;
  state: string;
  country: string;
  citizenship: string;

  educationLevel: string;
  degree: string;
  college?: string;
  occupation: string;
  employer?: string;
  annualIncome: number;
  incomeRange: string;

  familyType: 'JOINT' | 'NUCLEAR';
  fatherOccupation: string;
  motherOccupation: string;
  brothersCount?: number;
  sistersCount?: number;
  familyValues: 'TRADITIONAL' | 'MODERATE' | 'LIBERAL';
  familyLocation?: string;

  diet: 'VEGETARIAN' | 'NON_VEGETARIAN' | 'EGGETARIAN' | 'JAIN' | 'VEGAN';
  smoking: 'NO' | 'OCCASIONALLY' | 'YES';
  drinking: 'NO' | 'OCCASIONALLY' | 'YES';
  hobbies: string[];
  interests: string[];

  avatar: string;
  photos: IProfilePhoto[];
  partnerPreferences?: IPartnerPreferences;
  privacySettings?: IPrivacySettings;
  notificationSettings?: INotificationSettings;

  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  verificationBadge: boolean;
  profileCompletion: number;
  isPremium: boolean;
  premiumPlanId?: string;
  premiumExpiresAt?: string;
  isBoosted: boolean;
  viewCount: number;
  shortlistCount: number;
  interestCount?: number;
  lastActiveAt?: string;
  isOnline: boolean;
  compatibility?: ICompatibility | null;
}

export interface IConversation {
  _id: string;
  lastMessage?: string;
  lastMessageType?: 'TEXT' | 'IMAGE';
  lastMessageSender?: string;
  lastMessageAt: string;
  isBlocked: boolean;
  unreadCount: number;
  partnerProfile?: IProfile;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  sender: string;
  receiver: string;
  messageType: 'TEXT' | 'IMAGE' | 'AUDIO';
  text?: string;
  mediaUrl?: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  readAt?: string;
  createdAt: string;
}

export interface INotificationItem {
  _id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface ISubscription {
  _id: string;
  planId: 'FREE' | 'PREMIUM_MONTHLY' | 'PREMIUM_QUARTERLY' | 'PREMIUM_YEARLY';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  features: {
    dailyInterestLimit: number;
    dailyProfileViews: number;
    canChat: boolean;
    canViewContact: boolean;
    canViewVisitors: boolean;
    hasIncognito: boolean;
    hasBoost: boolean;
  };
  interestsSentToday: number;
  profilesViewedToday: number;
}
