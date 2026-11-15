/**
 * Spot catalogue plus the selection and filter state the map and feed share.
 *
 * The map's selected pin is also what the center FAB preselects when it opens
 * Rate a Spot, which is why selection lives here rather than in the map screen.
 */
import { create } from 'zustand';
import { backend } from '../data/backend';
import { busyLevelFor } from '../domain/busyness';
import { Review, Spot } from '../domain/models';

/** Map filter chips: all / eat / study / quiet rn / 4.2+. */
export type SpotFilter = 'all' | 'food' | 'study' | 'quiet' | 'top';
/** Feed and profile chips only split by type. */
export type TypeFilter = 'all' | 'food' | 'study';

interface SpotState {
  spots: Spot[];
  /** Highest-rated review per spot, shown as the feed's top comment. */
  topComments: Record<string, Review | null>;
  isLoading: boolean;
  selectedSpotId: string | null;
  /** Last spot opened or selected — the FAB's default target. */
  lastSpotId: string | null;
  mapFilter: SpotFilter;
  feedFilter: TypeFilter;

  load: () => Promise<void>;
  select: (spotId: string) => void;
  clearSelection: () => void;
  remember: (spotId: string) => void;
  setMapFilter: (filter: SpotFilter) => void;
  setFeedFilter: (filter: TypeFilter) => void;
}

export const useSpotStore = create<SpotState>((set) => ({
  spots: [],
  topComments: {},
  isLoading: false,
  selectedSpotId: null,
  lastSpotId: null,
  mapFilter: 'all',
  feedFilter: 'all',

  load: async () => {
    set({ isLoading: true });
    const spots = await backend().spots.listSpots();
    const comments = await Promise.all(spots.map((spot) => backend().reviews.topForSpot(spot.id)));
    const topComments: Record<string, Review | null> = {};
    spots.forEach((spot, index) => {
      topComments[spot.id] = comments[index];
    });
    set((state) => ({
      spots,
      topComments,
      isLoading: false,
      lastSpotId: state.lastSpotId ?? spots[0]?.id ?? null,
    }));
  },

  select: (spotId) => set({ selectedSpotId: spotId, lastSpotId: spotId }),
  clearSelection: () => set({ selectedSpotId: null }),
  remember: (spotId) => set({ lastSpotId: spotId }),
  // Changing the filter can hide the selected pin, so drop the selection.
  setMapFilter: (mapFilter) => set({ mapFilter, selectedSpotId: null }),
  setFeedFilter: (feedFilter) => set({ feedFilter }),
}));

export function matchesFilter(spot: Spot, filter: SpotFilter, nowIndex: number): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'quiet':
      return busyLevelFor(spot.hourlyBusy[nowIndex]) <= 1;
    case 'top':
      return spot.rating >= 4.2;
    default:
      return spot.type === filter;
  }
}
