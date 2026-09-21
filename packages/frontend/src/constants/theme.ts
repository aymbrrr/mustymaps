/**
 * Design tokens.
 *
 * Busyness colours are paired with a distinct pin shape (see
 * crowdUtils.statusToPinStyle) so the map stays readable for the ~6% of men
 * with deuteranopia.
 */

export const colors = {
  background: '#F7FAF8',
  backgroundMuted: '#EDF2EE',
  surface: 'rgba(255,255,255,0.9)',
  surfaceMuted: '#EAF1EC',

  textPrimary: '#12331F',
  textSecondary: '#3C5A47',
  textMuted: '#6B8375',
  textInverse: '#FFFFFF',

  // Cal Poly green / gold
  primary: '#154734',
  primaryMuted: '#E3EDE6',
  accent: '#C69214',

  // Busyness levels — must match BUSYNESS_LEVELS in lib/crowdUtils.ts
  notBusy: '#2E7D32',
  moderate: '#C69214',
  packed: '#C0392B',
  unknown: '#9E9E9E',

  success: '#2E7D32',
  warning: '#C69214',
  error: '#C0392B',
  info: '#1565C0',

  border: 'rgba(21,71,52,0.18)',
  borderMuted: 'rgba(21,71,52,0.1)',
  overlay: 'rgba(18,51,31,0.5)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
} as const;

export const typography = {
  bodyLg: { fontSize: 18, lineHeight: 27 },
  body: { fontSize: 16, lineHeight: 24 },
  bodySm: { fontSize: 14, lineHeight: 21 },
  label: { fontSize: 14, lineHeight: 21, fontWeight: '600' as const },
  caption: { fontSize: 12, lineHeight: 18 },
  heading1: { fontSize: 28, lineHeight: 36, fontWeight: '700' as const },
  heading2: { fontSize: 22, lineHeight: 30, fontWeight: '700' as const },
  heading3: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const },
} as const;

/** WCAG 2.5.5 minimum tap target */
export const tapTarget = { min: 44 } as const;

export const frostedCard = {
  backgroundColor: 'rgba(255,255,255,0.75)',
  borderWidth: 1.5,
  borderColor: 'rgba(21,71,52,0.2)',
  borderRadius: 20,
  shadowColor: '#154734',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 3,
} as const;
