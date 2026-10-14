/**
 * Signed out → intro / sign in / sign up. Signed in → tabs plus the pushed
 * screens (location, rate, public profile, settings).
 */
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { IntroScreen } from '../screens/auth/IntroScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { FeedScreen } from '../screens/feed/FeedScreen';
import { LeaderboardScreen } from '../screens/leaderboard/LeaderboardScreen';
import { LocationDetailScreen } from '../screens/location/LocationDetailScreen';
import { MapScreen } from '../screens/map/MapScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { PublicProfileScreen } from '../screens/profile/PublicProfileScreen';
import { RateScreen } from '../screens/rate/RateScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { useSessionStore } from '../stores/sessionStore';
import { useSpotStore } from '../stores/spotStore';
import { TabBar } from './TabBar';
import { AppStackParamList, AuthStackParamList, TabParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Intro" component={IntroScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const loadSpots = useSpotStore((state) => state.load);
  const selectedSpotId = useSpotStore((state) => state.selectedSpotId);
  const lastSpotId = useSpotStore((state) => state.lastSpotId);
  const firstSpotId = useSpotStore((state) => state.spots[0]?.id ?? null);

  // Every tab reads from the spot catalogue, so load it once here.
  useEffect(() => {
    void loadSpots();
  }, [loadSpots]);

  // The FAB preselects whatever spot you were just looking at.
  const openRate = () => {
    const spotId = selectedSpotId ?? lastSpotId ?? firstSpotId;
    if (spotId) navigation.navigate('Rate', { spotId });
  };

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} onRatePress={openRate} />}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const AppStack = createNativeStackNavigator<AppStackParamList>();

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="MainTabs" component={TabNavigator} />
      <AppStack.Screen name="LocationDetail" component={LocationDetailScreen} />
      <AppStack.Screen name="Rate" component={RateScreen} />
      <AppStack.Screen name="PublicProfile" component={PublicProfileScreen} />
      <AppStack.Screen name="Settings" component={SettingsScreen} />
    </AppStack.Navigator>
  );
}

export function RootNavigator() {
  const signedIn = useSessionStore((state) => state.status === 'signedIn');

  return <NavigationContainer>{signedIn ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>;
}
