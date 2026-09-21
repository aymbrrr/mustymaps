/**
 * Crowd status helpers.
 *
 * STATUS_WINDOW_MINUTES must match status_window() in
 * supabase/migrations/001_initial_schema.sql. The server decides what counts
 * as fresh; this constant only drives client-side labels like "12m ago".
 */

export const STATUS_WINDOW_MINUTES = 90;

export type Busyness = 1 | 2 | 3;
export type OpenSeats = 'none' | 'few' | 'many';

export interface BusynessLevel {
  value: Busyness;
  label: string;
  hint: string;
  color: string;
}

export const BUSYNESS_LEVELS: BusynessLevel[] = [
  { value: 1, label: 'Not busy', hint: 'Walk right up',        color: '#2E7D32' },
  { value: 2, label: 'Moderate', hint: 'Short line',           color: '#C69214' },
  { value: 3, label: 'Packed',   hint: 'Long wait, no seats',   color: '#C0392B' },
];

const UNKNOWN_COLOR = '#9E9E9E';

export function busynessLevel(busyness: number | null): BusynessLevel | null {
  if (busyness == null) return null;
  return BUSYNESS_LEVELS[Math.min(3, Math.max(1, Math.round(busyness))) - 1];
}

export interface PinStyle {
  color: string;
  /** Shape carries the same signal as color, for colorblind readability. */
  shape: 'circle' | 'square' | 'triangle' | 'hollow';
  label: string;
}

/**
 * Pin appearance for a location's live status.
 * Shape is redundant with color so the map stays readable without color vision.
 */
export function statusToPinStyle(busyness: number | null, reportCount: number): PinStyle {
  if (reportCount === 0 || busyness == null) {
    return { color: UNKNOWN_COLOR, shape: 'hollow', label: 'No recent reports' };
  }
  const level = busynessLevel(busyness)!;
  const shape = level.value === 1 ? 'circle' : level.value === 2 ? 'square' : 'triangle';
  return { color: level.color, shape, label: level.label };
}

export const OPEN_SEATS_LABELS: Record<OpenSeats, string> = {
  none: 'No seats',
  few: 'A few seats',
  many: 'Lots of seats',
};

/** "just now" / "12m ago" / "1h 5m ago" */
export function timeAgo(isoTimestamp: string | null): string {
  if (!isoTimestamp) return 'never';
  const minutes = Math.floor((Date.now() - new Date(isoTimestamp).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ago`;
}

export function waitLabel(waitMinutes: number | null): string {
  if (waitMinutes == null) return 'No wait reported';
  if (waitMinutes === 0) return 'No wait';
  return `~${waitMinutes} min wait`;
}

export const CATEGORY_LABELS: Record<string, string> = {
  dining: 'Dining',
  study: 'Study',
  recreation: 'Recreation',
  other: 'Other',
};
