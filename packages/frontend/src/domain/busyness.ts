/**
 * Busyness is the app's one shared vocabulary: a 0-100 occupancy reading maps to
 * one of five named levels, and every surface (pins, pills, bars, chips) renders
 * from that single mapping.
 */
import { colors } from '../theme/tokens';

export const BUSY_LEVELS = ['dead', 'chill', 'lively', 'busy', 'packed'] as const;

export type BusyLevel = 0 | 1 | 2 | 3 | 4;

export const BUSY_LEVEL_COLORS: readonly string[] = [
  '#9AA3A0',
  '#3E8E63',
  '#C9A227',
  '#D9822B',
  '#C2412D',
];

/** First and last hour covered by an hourly curve: 7am through 11pm. */
export const CHART_FIRST_HOUR = 7;
export const CHART_HOURS = 17;

export function busyLevelFor(occupancy: number): BusyLevel {
  if (occupancy < 20) return 0;
  if (occupancy < 40) return 1;
  if (occupancy < 60) return 2;
  if (occupancy < 80) return 3;
  return 4;
}

export function busyLevelName(occupancy: number): string {
  return BUSY_LEVELS[busyLevelFor(occupancy)];
}

/** The copy used on live pills everywhere: "lively rn". */
export function busyLiveLabel(occupancy: number): string {
  return `${busyLevelName(occupancy)} rn`;
}

export function busyColor(occupancy: number): string {
  return BUSY_LEVEL_COLORS[busyLevelFor(occupancy)];
}

/** "7a" · "12p" · "11p" — the axis labels under every hourly chart. */
export function hourLabel(hour24: number): string {
  if (hour24 === 12) return '12p';
  return hour24 < 12 ? `${hour24}a` : `${hour24 - 12}p`;
}

/**
 * Index into a 17-slot hourly curve for a wall-clock time, clamped so the chart
 * still has a "now" bar outside 7am-11pm.
 */
export function hourIndexFor(date: Date): number {
  return Math.min(CHART_HOURS - 1, Math.max(0, date.getHours() - CHART_FIRST_HOUR));
}

/** "2:14 pm" — lowercase meridiem, matching the brand voice. */
export function clockLabel(date: Date): string {
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes} ${date.getHours() < 12 ? 'am' : 'pm'}`;
}

/** Bar fill for the mini chart on the map's expanded spot bar. */
export function miniBarColor(hourIndex: number, nowIndex: number): string {
  if (hourIndex === nowIndex) return colors.polyGreen;
  return hourIndex < nowIndex ? colors.barPast : colors.serenity;
}
