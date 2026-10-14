/**
 * Copy and option sets for the rating flows. A spot's type decides which four
 * sub-scores and which extra tags it offers.
 */
import { SpotType } from './models';

export const SUB_SCORE_LABELS: Record<SpotType, [string, string, string, string]> = {
  study: ['noise', 'outlets', 'wifi', 'seats'],
  food: ['taste', 'value', 'wait', 'portions'],
};

export const EXTRA_TAGS: Record<SpotType, string[]> = {
  study: ['lock-in spot', 'hidden gem', 'group friendly', 'go early'],
  food: ['worth it', 'overpriced', 'hidden gem', 'go early'],
};

/** Caption beside the star row; index 0 is "no stars picked yet". */
export const STAR_CAPTIONS = ['', 'nah', 'meh', 'solid', 'really good', 'elite'] as const;

export const DAY_LABELS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

/**
 * Per-weekday multiplier applied to a spot's baseline hourly curve. Weekends run
 * much quieter on campus, so the historical view scales rather than storing a
 * separate curve per day.
 */
export const DAY_FACTORS = [1, 1.05, 1, 0.95, 0.8, 0.45, 0.6] as const;

export function curveForDay(hourlyBusy: number[], dayIndex: number): number[] {
  return hourlyBusy.map((v) => Math.min(100, Math.round(v * DAY_FACTORS[dayIndex])));
}

export function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Sub-line under the busyness headline on the location detail card. */
export function busynessDetailSub(type: SpotType, occupancy: number, isNow: boolean): string {
  const lead =
    type === 'food'
      ? `~${Math.max(1, Math.round(occupancy * 0.16))} min wait`
      : `~${Math.max(5, 100 - occupancy)}% of seats open`;
  return lead + (isNow ? ' · from 38 check-ins this hour' : ' · tap a bar to peek');
}
