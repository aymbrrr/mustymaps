/**
 * Navigation type definitions.
 * Import these in screens to get typed navigation props.
 */
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BusyLevel } from '../domain/busyness';

export type AuthStackParamList = {
  Intro: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type TabParamList = {
  Feed: undefined;
  Map: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  LocationDetail: { spotId: string };
  /** Quick Rate hands its stars and busyness level over when you write a full review. */
  Rate: { spotId: string; seedStars?: number; seedBusyLevel?: BusyLevel | null };
  PublicProfile: { userId: string };
  Settings: undefined;
};

/** Tab screens also need to push onto the app stack (location detail, rate, settings). */
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<AppStackParamList>
>;
