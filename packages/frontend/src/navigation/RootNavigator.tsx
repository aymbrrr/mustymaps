/**
 * Root navigator. Signed out → auth stack. Signed in → Map / Profile tabs.
 */
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Image, StyleSheet } from 'react-native';

import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../constants/theme';

import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { MapScreen } from '../screens/map/MapScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ReportScreen } from '../screens/report/ReportScreen';
import { LocationDetailScreen } from '../screens/location/LocationDetailScreen';

import { AuthStackParamList, AppRootParamList, AppTabParamList } from './types';

const TAB_ICONS: Record<keyof AppTabParamList, number> = {
  Map: require('../../assets/map.png'),
  Profile: require('../../assets/profile.png'),
};

// ─── Auth stack ──────────────────────────────────────────────────────────────
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────
const Tab = createBottomTabNavigator<AppTabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarIcon: ({ focused }) => (
          <Image
            source={TAB_ICONS[route.name]}
            style={{ width: 28, height: 28, opacity: focused ? 1 : 0.6 }}
            resizeMode="contain"
          />
        ),
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── App stack ───────────────────────────────────────────────────────────────
const AppRootStack = createNativeStackNavigator<AppRootParamList>();

function AppNavigator() {
  return (
    <AppRootStack.Navigator screenOptions={{ headerShown: false }}>
      <AppRootStack.Screen name="MainTabs" component={TabNavigator} />
      <AppRootStack.Screen
        name="Report"
        component={ReportScreen}
        options={{ presentation: 'modal' }}
      />
      <AppRootStack.Screen name="LocationDetail" component={LocationDetailScreen} />
    </AppRootStack.Navigator>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────
export function RootNavigator() {
  const { session, isGuest, setSession } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  if (isInitializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session || isGuest ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
