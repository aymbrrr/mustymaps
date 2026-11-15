/**
 * Domain entities. Pure data — no React, no network, no storage.
 *
 * Adapters in src/data translate whatever the backend returns into these shapes,
 * so screens never see a database row or an API envelope.
 */
import { BusyLevel } from './busyness';

export type SpotType = 'food' | 'study';

/** The one-word label on category tiles and type chips. */
export const SPOT_TYPE_LABEL: Record<SpotType, string> = { food: 'eat', study: 'study' };

export interface Spot {
  id: string;
  name: string;
  /** Short form used on map pins and the rate-a-spot picker. */
  shortName: string;
  type: SpotType;
  area: string;
  lat: number;
  lng: number;
  rating: number;
  ratingCount: number;
  /** "open till 12a" · "always open" */
  hoursLabel: string;
  /** "3 min" */
  walkTime: string;
  tags: string[];
  /** Four category averages, ordered to match SUB_SCORE_LABELS for the type. */
  subScores: [number, number, number, number];
  /** Occupancy 0-100 for each of the 17 hours from 7am. */
  hourlyBusy: number[];
  photos: string[];
}

export interface Review {
  id: string;
  spotId: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  stars: number;
  /** Relative time as the backend formatted it: "2h ago", "yesterday". */
  createdAtLabel: string;
  text: string;
}

export interface MyRating {
  spotId: string;
  stars: number;
  /** "sep 26" · "just now" */
  ratedAtLabel: string;
  note: string;
}

export interface Me {
  id: string;
  name: string;
  handle: string;
  /** "comm studies · 3rd yr" */
  majorYear: string;
  bio: string;
  email: string;
  followers: number;
  /** Shown as the "TOP RATER" badge on the profile avatar. */
  isTopRater: boolean;
}

export type MeDraft = Pick<Me, 'name' | 'handle' | 'majorYear' | 'bio'>;

export interface PublicProfile {
  id: string;
  name: string;
  handle: string;
  /** "mech e · 4th yr" */
  majorYear: string;
  ratingCount: number;
  avgGiven: number;
  followers: number;
  /** Counts for 5★ down to 1★. */
  ratingDistribution: [number, number, number, number, number];
  foodPct: number;
  labels: string[];
  goToSpots: { spotId: string; spotName: string; stars: number }[];
  recentRatings: { spotId: string; spotName: string; createdAtLabel: string; stars: number; text: string }[];
}

export interface RatingDraft {
  spotId: string;
  stars: number;
  /** Index into SUB_SCORE_LABELS for the spot's type → 1-5 value. */
  subScores: Record<number, number>;
  busyLevel: BusyLevel | null;
  tags: string[];
  text: string;
}

export interface QuickRateDraft {
  spotId: string;
  stars: number | null;
  busyLevel: BusyLevel | null;
}

export type LeaderboardMetric = 'ratings' | 'reviews' | 'spots' | 'streak';
export type LeaderboardScope = 'all' | 'week';

export interface LeaderboardEntry {
  /** Null for users without a viewable profile yet. */
  userId: string | null;
  name: string;
  handle: string;
  value: number;
  rank: number;
  isMe: boolean;
  /** "+5 this week" · "cal poly" · "that's you" */
  sub: string;
}

export interface Leaderboard {
  metric: LeaderboardMetric;
  scope: LeaderboardScope;
  unit: string;
  entries: LeaderboardEntry[];
  me: { rank: number; value: number; gapToNext: string };
}

export interface AppSettings {
  notifs: boolean;
  muteAll: boolean;
  replies: boolean;
  follows: boolean;
  busyAlerts: boolean;
  sounds: boolean;
  badges: boolean;
  precise: boolean;
  publicProfile: boolean;
  showRatings: boolean;
  tracking: boolean;
  reduceMotion: boolean;
  haptics: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  notifs: true,
  muteAll: false,
  replies: true,
  follows: true,
  busyAlerts: false,
  sounds: true,
  badges: true,
  precise: true,
  publicProfile: true,
  showRatings: true,
  tracking: false,
  reduceMotion: false,
  haptics: true,
};
