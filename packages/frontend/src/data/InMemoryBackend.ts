/**
 * In-memory adapter for every port in src/domain/ports.
 *
 * This is the scaffold that stands in for the real backend. Writes mutate local
 * state so the whole app is exercisable end to end; nothing persists across a
 * restart. Replacing it with a Supabase or REST adapter means implementing the
 * same interfaces — no screen or store changes.
 */
import {
  AppSettings,
  DEFAULT_SETTINGS,
  Leaderboard,
  LeaderboardEntry,
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
} from '../domain/models';
import {
  AuthGateway,
  Backend,
  LeaderboardRepository,
  ProfileRepository,
  ReviewRepository,
  SettingsRepository,
  SpotRepository,
} from '../domain/ports';
import {
  LEADERBOARD_META,
  SEED_LEADERBOARD_PEOPLE,
  SEED_LEADERBOARD_VALUES,
  SEED_ME,
  SEED_MY_RATINGS,
  SEED_REVIEWS,
  SEED_SPOTS,
  SEED_USERS,
} from './fixtures';

const CALPOLY_EMAIL = /@calpoly\.edu$/i;
const VERIFICATION_CODE_LENGTH = 6;

interface Store {
  spots: Spot[];
  reviews: Review[];
  me: Me;
  myRatings: MyRating[];
  settings: AppSettings;
}

function seedStore(): Store {
  const reviews: Review[] = [];
  for (const [spotId, list] of Object.entries(SEED_REVIEWS)) {
    list.forEach((seed, index) => {
      const author = SEED_USERS[seed.authorId];
      reviews.push({
        id: `${spotId}-${index}`,
        spotId,
        authorId: seed.authorId,
        authorName: author.name,
        authorHandle: author.handle,
        stars: seed.stars,
        createdAtLabel: seed.when,
        text: seed.text,
      });
    });
  }
  return {
    spots: SEED_SPOTS.map((spot) => ({ ...spot })),
    reviews,
    me: { ...SEED_ME },
    myRatings: SEED_MY_RATINGS.map((rating) => ({ ...rating })),
    settings: { ...DEFAULT_SETTINGS },
  };
}

class InMemorySpotRepository implements SpotRepository {
  constructor(private readonly store: Store) {}

  async listSpots(): Promise<Spot[]> {
    return this.store.spots.map((spot) => ({ ...spot }));
  }

  async getSpot(spotId: string): Promise<Spot | null> {
    const spot = this.store.spots.find((candidate) => candidate.id === spotId);
    return spot ? { ...spot } : null;
  }
}

class InMemoryReviewRepository implements ReviewRepository {
  constructor(private readonly store: Store) {}

  async listForSpot(spotId: string): Promise<Review[]> {
    return this.store.reviews.filter((review) => review.spotId === spotId);
  }

  async topForSpot(spotId: string): Promise<Review | null> {
    const ranked = this.store.reviews
      .filter((review) => review.spotId === spotId)
      .sort((a, b) => b.stars - a.stars);
    return ranked[0] ?? null;
  }

  // One rating per person per spot, so a repeat rating replaces the old one.
  async submitRating(draft: RatingDraft): Promise<void> {
    const note = draft.text.trim() || draft.tags.join(' · ') || 'no notes, just vibes.';
    this.store.myRatings = [
      { spotId: draft.spotId, stars: draft.stars, ratedAtLabel: 'just now', note },
      ...this.store.myRatings.filter((rating) => rating.spotId !== draft.spotId),
    ];
    this.store.reviews = [
      {
        id: `${draft.spotId}-me-${this.store.reviews.length}`,
        spotId: draft.spotId,
        authorId: this.store.me.id,
        authorName: this.store.me.name,
        authorHandle: this.store.me.handle,
        stars: draft.stars,
        createdAtLabel: 'just now',
        text: note,
      },
      ...this.store.reviews.filter(
        (review) => !(review.spotId === draft.spotId && review.authorId === this.store.me.id)
      ),
    ];
    if (draft.busyLevel !== null) this.applyCheckIn(draft.spotId, draft.busyLevel);
  }

  async submitQuickRate(draft: QuickRateDraft): Promise<void> {
    if (draft.busyLevel !== null) this.applyCheckIn(draft.spotId, draft.busyLevel);
  }

  /**
   * A check-in nudges the current hour's occupancy toward the reported level.
   * The real backend aggregates every check-in in the hour; this keeps the map
   * and feed reacting to your own report in the meantime.
   */
  private applyCheckIn(spotId: string, busyLevel: number): void {
    const reported = busyLevel * 20 + 10;
    const nowIndex = Math.min(16, Math.max(0, new Date().getHours() - 7));
    this.store.spots = this.store.spots.map((spot) => {
      if (spot.id !== spotId) return spot;
      const hourlyBusy = [...spot.hourlyBusy];
      hourlyBusy[nowIndex] = Math.round(hourlyBusy[nowIndex] * 0.6 + reported * 0.4);
      return { ...spot, hourlyBusy };
    });
  }
}

class InMemoryProfileRepository implements ProfileRepository {
  constructor(private readonly store: Store) {}

  async getMe(): Promise<Me> {
    return { ...this.store.me };
  }

  async updateMe(draft: MeDraft): Promise<Me> {
    this.store.me = { ...this.store.me, ...draft };
    return { ...this.store.me };
  }

  async listMyRatings(): Promise<MyRating[]> {
    return this.store.myRatings.map((rating) => ({ ...rating }));
  }

  async getPublicProfile(userId: string): Promise<PublicProfile | null> {
    const user = SEED_USERS[userId];
    if (!user) return null;
    const nameOf = (spotId: string) =>
      this.store.spots.find((spot) => spot.id === spotId)?.name ?? spotId;
    return {
      id: userId,
      name: user.name,
      handle: user.handle,
      majorYear: user.majorYear,
      ratingCount: user.ratingCount,
      avgGiven: user.avgGiven,
      followers: user.followers,
      ratingDistribution: user.dist,
      foodPct: user.foodPct,
      labels: user.labels,
      goToSpots: user.top.map(([spotId, stars]) => ({ spotId, spotName: nameOf(spotId), stars })),
      recentRatings: this.store.reviews
        .filter((review) => review.authorId === userId)
        .map((review) => ({
          spotId: review.spotId,
          spotName: nameOf(review.spotId),
          createdAtLabel: review.createdAtLabel,
          stars: review.stars,
          text: review.text,
        })),
    };
  }
}

class InMemoryLeaderboardRepository implements LeaderboardRepository {
  constructor(private readonly store: Store) {}

  describe(metric: LeaderboardMetric, scope: LeaderboardScope): string {
    return LEADERBOARD_META[metric].description + (scope === 'week' ? ' · this week' : '');
  }

  async load(metric: LeaderboardMetric, scope: LeaderboardScope): Promise<Leaderboard> {
    const me = this.store.me;
    const ranked = SEED_LEADERBOARD_PEOPLE.map((person, index) => ({
      ...person,
      name: person.isMe ? me.name : person.name,
      handle: person.isMe ? me.handle : person.handle,
      value: scopeValue(SEED_LEADERBOARD_VALUES[metric][index], index, scope),
    }))
      .sort((a, b) => b.value - a.value)
      .map((person, index) => ({ ...person, rank: index + 1 }));

    const entries: LeaderboardEntry[] = ranked.map((person, index) => ({
      userId: person.userId,
      name: person.name,
      handle: person.handle,
      value: person.value,
      rank: person.rank,
      isMe: person.isMe,
      sub: subFor(person.isMe, index),
    }));

    const mine = entries.find((entry) => entry.isMe)!;
    const above = entries[mine.rank - 2];
    return {
      metric,
      scope,
      unit: LEADERBOARD_META[metric].unit,
      entries,
      me: {
        rank: mine.rank,
        value: mine.value,
        gapToNext: above
          ? `${above.value - mine.value + 1} more to pass @${above.handle}`
          : 'you’re #1. stay humble.',
      },
    };
  }
}

/** Weekly scope is a slice of the all-time number, jittered per person. */
function scopeValue(allTime: number, index: number, scope: LeaderboardScope): number {
  if (scope === 'all') return allTime;
  return Math.max(1, Math.round(allTime / 8) + ((index * 7) % 5));
}

function subFor(isMe: boolean, rowIndex: number): string {
  if (isMe) return 'that’s you';
  // Rows 4+ alternate between a weekly delta and the plain affiliation line.
  const positionInList = rowIndex - 3;
  return positionInList >= 0 && positionInList % 3 === 0 ? `+${3 + positionInList} this week` : 'cal poly';
}

class InMemoryAuthGateway implements AuthGateway {
  async signIn(email: string, password: string): Promise<void> {
    requireCalPolyEmail(email);
    if (!password) throw new Error('enter your password.');
  }

  async signUp(email: string, password: string): Promise<void> {
    requireCalPolyEmail(email);
    if (password.length < 8) throw new Error('password needs 8+ characters');
  }

  async verifyCode(_email: string, code: string): Promise<void> {
    if (code.length !== VERIFICATION_CODE_LENGTH) throw new Error('enter all 6 digits.');
  }

  async resendCode(email: string): Promise<void> {
    requireCalPolyEmail(email);
  }

  async requestPasswordReset(email: string): Promise<void> {
    requireCalPolyEmail(email);
  }

  async signOut(): Promise<void> {}

  async deleteAccount(): Promise<void> {}
}

function requireCalPolyEmail(email: string): void {
  if (!CALPOLY_EMAIL.test(email.trim())) throw new Error('needs to be a @calpoly.edu email.');
}

class InMemorySettingsRepository implements SettingsRepository {
  constructor(private readonly store: Store) {}

  async load(): Promise<AppSettings> {
    return { ...this.store.settings };
  }

  async save(settings: AppSettings): Promise<void> {
    this.store.settings = { ...settings };
  }
}

export function createInMemoryBackend(): Backend {
  const store = seedStore();
  return {
    spots: new InMemorySpotRepository(store),
    reviews: new InMemoryReviewRepository(store),
    profiles: new InMemoryProfileRepository(store),
    leaderboard: new InMemoryLeaderboardRepository(store),
    auth: new InMemoryAuthGateway(),
    settings: new InMemorySettingsRepository(store),
  };
}
