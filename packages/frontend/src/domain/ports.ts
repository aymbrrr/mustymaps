/**
 * Ports — the contract the frontend needs a backend to satisfy.
 *
 * Screens and stores depend on these interfaces, never on a concrete client, so
 * the in-memory adapter used today can be swapped for Supabase or a REST client
 * by changing the one `configureBackend` call in App.tsx.
 *
 * Each port is narrow on purpose: a screen that only reads spots should not be
 * able to reach auth or settings.
 */
import {
  AppSettings,
  Leaderboard,
  LeaderboardMetric,
  LeaderboardScope,
  Me,
  MeDraft,
  MyRating,
  PublicProfile,
  QuickRateDraft,
  RatingDraft,
  Review,
  Spot,
} from './models';

export interface SpotRepository {
  listSpots(): Promise<Spot[]>;
  getSpot(spotId: string): Promise<Spot | null>;
}

export interface ReviewRepository {
  listForSpot(spotId: string): Promise<Review[]>;
  /** Highest-scored review for a spot, used as the feed's top comment. */
  topForSpot(spotId: string): Promise<Review | null>;
  submitRating(draft: RatingDraft): Promise<void>;
  submitQuickRate(draft: QuickRateDraft): Promise<void>;
}

export interface ProfileRepository {
  getMe(): Promise<Me>;
  updateMe(draft: MeDraft): Promise<Me>;
  listMyRatings(): Promise<MyRating[]>;
  getPublicProfile(userId: string): Promise<PublicProfile | null>;
}

export interface LeaderboardRepository {
  load(metric: LeaderboardMetric, scope: LeaderboardScope): Promise<Leaderboard>;
  /** Description line under the segmented control, e.g. "spots you've rated, all time". */
  describe(metric: LeaderboardMetric, scope: LeaderboardScope): string;
}

export interface AuthGateway {
  /** Rejects with a message safe to show the user. */
  signIn(email: string, password: string): Promise<void>;
  /**
   * Creates the account. Returns whether a verification code was sent — a
   * project with email confirmation turned off signs the user straight in, and
   * the code screen must be skipped rather than stranding them on it.
   */
  signUp(email: string, password: string): Promise<{ needsVerification: boolean }>;
  verifyCode(email: string, code: string): Promise<void>;
  resendCode(email: string): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  signOut(): Promise<void>;
  deleteAccount(): Promise<void>;
}

export interface SettingsRepository {
  load(): Promise<AppSettings>;
  save(settings: AppSettings): Promise<void>;
}

/** Everything the app needs from the outside world, in one injectable object. */
export interface Backend {
  spots: SpotRepository;
  reviews: ReviewRepository;
  profiles: ProfileRepository;
  leaderboard: LeaderboardRepository;
  auth: AuthGateway;
  settings: SettingsRepository;
}
