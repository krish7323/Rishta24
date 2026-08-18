import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/splash/SplashScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { AuthNavigator } from './AuthNavigator';
import { ProfileWizardScreen } from '../screens/wizard/ProfileWizardScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { ProfileDetailScreen } from '../screens/profile/ProfileDetailScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { PremiumScreen } from '../screens/premium/PremiumScreen';
import { VisitorsScreen } from '../screens/visitors/VisitorsScreen';
import { NotificationScreen } from '../screens/notifications/NotificationScreen';
import { SafetyCenterScreen } from '../screens/safety/SafetyCenterScreen';
import { HelpCenterScreen } from '../screens/support/HelpCenterScreen';
import { PrivacySettingsScreen } from '../screens/settings/PrivacySettingsScreen';
import { BlockedUsersScreen } from '../screens/settings/BlockedUsersScreen';
import { InviteEarnScreen } from '../screens/referral/InviteEarnScreen';
import { ShortlistsScreen } from '../screens/matches/ShortlistsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { SearchResultsScreen } from '../screens/search/SearchResultsScreen';
import { RootStackParamList } from '../types/navigation';


const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="ProfileWizard" component={ProfileWizardScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Premium" component={PremiumScreen} />
      <Stack.Screen name="Visitors" component={VisitorsScreen} />
      <Stack.Screen name="Shortlists" component={ShortlistsScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="SafetyCenter" component={SafetyCenterScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="SupportTicket" component={HelpCenterScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
      <Stack.Screen name="InviteEarn" component={InviteEarnScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
    </Stack.Navigator>
  );
};

