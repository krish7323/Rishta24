import { IProfile } from './models';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  ProfileWizard: undefined;
  Main: undefined;
  ProfileDetail: { profileId: string; initialProfile?: IProfile };
  Chat: { conversationId?: string; partnerProfile: IProfile };
  Premium: undefined;
  Visitors: undefined;
  Shortlists: undefined;
  Notifications: undefined;
  SafetyCenter: undefined;
  HelpCenter: undefined;
  SupportTicket: undefined;
  Settings: undefined;
  PrivacySettings: undefined;
  BlockedUsers: undefined;
  InviteEarn: undefined;
  EditProfile: undefined;
  SearchResults: { filters: any; initialQuery?: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OtpVerification: { identifier: string; purpose: 'REGISTRATION' | 'LOGIN' | 'FORGOT_PASSWORD' | 'VERIFY_PHONE' };
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  MatchesTab: undefined;
  ChatsTab: undefined;
  ProfileTab: undefined;
};
