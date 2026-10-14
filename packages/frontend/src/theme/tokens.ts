/**
 * Design tokens, transcribed from design/design_handoff_mustys_map.
 *
 * These are the only place raw hex values and type scales belong. Screens and
 * components read from here so a token change lands everywhere at once.
 */

export const colors = {
  polyGreen: '#154734',
  sealGrey: '#54585A',
  serenity: '#D5E4F4',
  serenityDeep: '#9DB8D6',
  /** Second stripe in photo placeholders. */
  serenityStripe: '#CADBEE',
  offWhite: '#FAF9F6',
  ink: '#17231D',
  card: '#FFFFFF',
  track: '#EEF0EC',
  starEmpty: '#DCDFDA',
  toggleOff: '#E2E4E0',
  quoteBg: '#F1F5FA',
  danger: '#B3261E',

  /** Hourly busyness bars: hours already past, and the current hour on a chart. */
  barPast: '#B9CCE2',
  barNow: '#7FA08F',

  /** Blank map canvas behind the tiles. */
  mapCanvas: '#EEF1EC',

  hairline: 'rgba(23,35,29,0.07)',
  cardBorder: 'rgba(23,35,29,0.05)',
  inputBorder: 'rgba(23,35,29,0.1)',
  outlineButton: 'rgba(23,35,29,0.16)',
  dividerStrong: 'rgba(23,35,29,0.08)',
  grabHandle: 'rgba(23,35,29,0.14)',
  closeButtonBg: 'rgba(23,35,29,0.06)',
  segmentTrack: 'rgba(23,35,29,0.06)',
  checkboxBorder: 'rgba(23,35,29,0.25)',
  dialogOutline: 'rgba(23,35,29,0.14)',

  scrim: 'rgba(23,35,29,0.38)',
  scrimStrong: 'rgba(23,35,29,0.45)',

  /** Translucent surfaces. */
  tabBar: 'rgba(250,249,246,0.96)',
  mapHeader: 'rgba(250,249,246,0.97)',
  mapChip: 'rgba(250,249,246,0.94)',
  onGreenFill: 'rgba(250,249,246,0.14)',
} as const;

/** Leaderboard avatars cycle through these tints so adjacent rows differ. */
export const avatarTints = ['#E6ECE4', '#D5E4F4', '#EAE6DD'] as const;

export const fonts = {
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semibold: 'Geist_600SemiBold',
  bold: 'Geist_700Bold',
} as const;

/**
 * Type roles from the handoff. Letter spacing is given there in em; React Native
 * wants points, so each value is already multiplied out against its font size.
 */
export const type = {
  heroWordmark: { fontFamily: fonts.semibold, fontSize: 64, letterSpacing: -3.84, lineHeight: 58 },
  screenTitle: { fontFamily: fonts.semibold, fontSize: 40, letterSpacing: -1.8 },
  authTitle: { fontFamily: fonts.semibold, fontSize: 46, letterSpacing: -2.3, lineHeight: 46 },
  signUpTitle: { fontFamily: fonts.semibold, fontSize: 42, letterSpacing: -2.1, lineHeight: 43 },
  locationName: { fontFamily: fonts.semibold, fontSize: 34, letterSpacing: -1.36, lineHeight: 34 },
  rateQuestion: { fontFamily: fonts.semibold, fontSize: 34, letterSpacing: -1.36, lineHeight: 36 },
  bigRating: { fontFamily: fonts.semibold, fontSize: 40, letterSpacing: -2, lineHeight: 36 },
  mapBarRating: { fontFamily: fonts.semibold, fontSize: 30, letterSpacing: -1.2, lineHeight: 30 },
  sheetTitle: { fontFamily: fonts.semibold, fontSize: 28, letterSpacing: -0.98 },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 17, letterSpacing: -0.17 },
  cardTitleSm: { fontFamily: fonts.semibold, fontSize: 16, letterSpacing: -0.16 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 21 },
  sub: { fontFamily: fonts.regular, fontSize: 14 },
  caption: { fontFamily: fonts.regular, fontSize: 13 },
  sectionLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1.68,
    textTransform: 'uppercase' as const,
    color: colors.sealGrey,
  },
  tabLabel: { fontFamily: fonts.semibold, fontSize: 11 },
  button: { fontFamily: fonts.semibold, fontSize: 17 },
  buttonSm: { fontFamily: fonts.semibold, fontSize: 16 },
} as const;

export const radius = {
  pill: 999,
  card: 24,
  list: 22,
  input: 18,
  inputSm: 16,
  sheet: 34,
  sheetSm: 30,
  tile: 15,
  tileSm: 14,
  heroOverlap: 28,
  busyTile: 16,
  segment: 9,
} as const;

export const spacing = {
  screen: 20,
  screenAuth: 28,
  section: 26,
  card: 16,
  /** Minimum tappable row height; also Apple's minimum tap target. */
  row: 54,
  /** Content below the status bar starts here. */
  safeTop: 58,
  tabBar: 88,
} as const;

export const shadows = {
  floatingCard: {
    shadowColor: '#17231D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 10,
  },
  mapPill: {
    shadowColor: '#17231D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 5,
  },
  headerCard: {
    shadowColor: '#17231D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 9,
    elevation: 3,
  },
  fab: {
    shadowColor: '#154734',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  toast: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  circleButton: {
    shadowColor: '#17231D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
} as const;

/** Disabled primary buttons stay rendered rather than dimming out entirely. */
export const DISABLED_OPACITY = 0.35;

/** Tappable cards compress slightly on press. */
export const PRESS_SCALE_CARD = 0.985;
export const PRESS_SCALE_CONTROL = 0.94;

export const TOAST_DURATION_MS = 2200;
