/**
 * The rating draft and the list of ratings you've posted.
 *
 * Quick Rate and the full Rate a Spot screen share one draft so "write a full
 * review" can carry the stars and busyness level already chosen.
 */
import { create } from 'zustand';
import { backend } from '../data/backend';
import { BusyLevel } from '../domain/busyness';
import { MyRating, QuickRateDraft, RatingDraft } from '../domain/models';

function emptyDraft(spotId: string): RatingDraft {
  return { spotId, stars: 0, subScores: {}, busyLevel: null, tags: [], text: '' };
}

interface RatingState {
  myRatings: MyRating[];
  draft: RatingDraft;

  loadMyRatings: () => Promise<void>;
  startDraft: (spotId: string, seed?: Partial<RatingDraft>) => void;
  setStars: (stars: number) => void;
  setSubScore: (index: number, value: number) => void;
  setBusyLevel: (level: BusyLevel) => void;
  toggleTag: (tag: string) => void;
  setText: (text: string) => void;
  submitDraft: () => Promise<void>;
  submitQuickRate: (draft: QuickRateDraft) => Promise<void>;
}

export const useRatingStore = create<RatingState>((set, get) => ({
  myRatings: [],
  draft: emptyDraft(''),

  loadMyRatings: async () => {
    set({ myRatings: await backend().profiles.listMyRatings() });
  },

  startDraft: (spotId, seed) => set({ draft: { ...emptyDraft(spotId), ...seed, spotId } }),

  setStars: (stars) => set((state) => ({ draft: { ...state.draft, stars } })),

  setSubScore: (index, value) =>
    set((state) => ({ draft: { ...state.draft, subScores: { ...state.draft.subScores, [index]: value } } })),

  setBusyLevel: (busyLevel) => set((state) => ({ draft: { ...state.draft, busyLevel } })),

  toggleTag: (tag) =>
    set((state) => {
      const tags = state.draft.tags.includes(tag)
        ? state.draft.tags.filter((candidate) => candidate !== tag)
        : [...state.draft.tags, tag];
      return { draft: { ...state.draft, tags } };
    }),

  setText: (text) => set((state) => ({ draft: { ...state.draft, text } })),

  submitDraft: async () => {
    const { draft } = get();
    await backend().reviews.submitRating(draft);
    set({ draft: emptyDraft(draft.spotId) });
    await get().loadMyRatings();
  },

  submitQuickRate: async (draft) => {
    await backend().reviews.submitQuickRate(draft);
  },
}));
