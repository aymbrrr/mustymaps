/**
 * Seed content, transcribed from the design prototype (LOCS / REV / USERS /
 * MINE / LBP / LBV in CampusApp.dc.html).
 *
 * This is sample content, not product data. It exists so every screen renders
 * fully before the backend is wired; the real adapter will replace it wholesale.
 */
import { Me, Spot } from '../domain/models';

export const SEED_SPOTS: Spot[] = [
  {
    id: 'klib',
    name: 'kennedy library',
    shortName: 'kennedy lib',
    type: 'study',
    area: 'floor 4 · quiet zone',
    lat: 35.30175,
    lng: -120.66395,
    rating: 4.6,
    ratingCount: 312,
    hoursLabel: 'open till 12a',
    walkTime: '3 min',
    tags: ['outlets everywhere', 'dead silent', 'fast wifi', 'ac is freezing'],
    subScores: [4.8, 4.5, 4.2, 3.1],
    hourlyBusy: [8, 12, 25, 48, 66, 78, 84, 90, 92, 86, 74, 68, 64, 58, 46, 30, 18],
    photos: [],
  },
  {
    id: '1901',
    name: '1901 marketplace',
    shortName: '1901',
    type: 'food',
    area: 'university union · 2nd floor',
    lat: 35.2999,
    lng: -120.6585,
    rating: 4.1,
    ratingCount: 540,
    hoursLabel: 'open till 9p',
    walkTime: '5 min',
    tags: ['poke bowls', 'fast line before 11:30', 'pricey'],
    subScores: [4.2, 3.6, 3.4, 4.0],
    hourlyBusy: [20, 45, 40, 30, 55, 92, 88, 60, 42, 38, 52, 80, 76, 50, 30, 12, 5],
    photos: [],
  },
  {
    id: 'vg',
    name: 'vista grande',
    shortName: 'vista grande',
    type: 'food',
    area: 'dining hall · all you can eat',
    lat: 35.2988,
    lng: -120.6556,
    rating: 3.8,
    ratingCount: 421,
    hoursLabel: 'open till 10p',
    walkTime: '9 min',
    tags: ['dessert bar', 'late night', 'taco tuesday'],
    subScores: [3.7, 4.4, 3.9, 4.8],
    hourlyBusy: [30, 62, 40, 25, 40, 85, 70, 35, 25, 30, 75, 90, 70, 45, 30, 20, 10],
    photos: [],
  },
  {
    id: 'uu',
    name: 'UU plaza',
    shortName: 'UU plaza',
    type: 'study',
    area: 'outdoor · shaded tables',
    lat: 35.30045,
    lng: -120.65935,
    rating: 4.0,
    ratingCount: 188,
    hoursLabel: 'always open',
    walkTime: '6 min',
    tags: ['outdoor', 'people watching', 'spotty wifi'],
    subScores: [2.6, 1.8, 3.0, 4.2],
    hourlyBusy: [5, 10, 20, 35, 55, 75, 80, 72, 60, 45, 30, 20, 12, 8, 5, 3, 2],
    photos: [],
  },
  {
    id: 'bsa',
    name: 'baker science atrium',
    shortName: 'baker atrium',
    type: 'study',
    area: 'bldg 180 · ground floor',
    lat: 35.3014,
    lng: -120.6605,
    rating: 4.4,
    ratingCount: 156,
    hoursLabel: 'open till 11p',
    walkTime: '4 min',
    tags: ['whiteboards', 'group friendly', 'sunny'],
    subScores: [3.4, 4.6, 4.5, 3.9],
    hourlyBusy: [5, 15, 35, 55, 62, 58, 70, 74, 68, 60, 45, 35, 30, 26, 18, 10, 5],
    photos: [],
  },
  {
    id: 'cm',
    name: 'campus market',
    shortName: 'campus market',
    type: 'food',
    area: 'grab & go · snacks',
    lat: 35.3031,
    lng: -120.662,
    rating: 3.9,
    ratingCount: 207,
    hoursLabel: 'open till 11p',
    walkTime: '7 min',
    tags: ['energy drinks', 'snacks', 'open late'],
    subScores: [3.5, 3.0, 4.6, 3.2],
    hourlyBusy: [15, 30, 35, 30, 40, 60, 55, 45, 40, 45, 50, 55, 50, 48, 52, 40, 25],
    photos: [],
  },
  {
    id: 'pcv',
    name: 'poly canyon lounge',
    shortName: 'pcv lounge',
    type: 'study',
    area: 'poly canyon village',
    lat: 35.3046,
    lng: -120.657,
    rating: 4.2,
    ratingCount: 98,
    hoursLabel: 'open 24h',
    walkTime: '12 min',
    tags: ['comfy couches', 'dead after 10p', 'resident vibes'],
    subScores: [3.9, 3.7, 4.1, 4.4],
    hourlyBusy: [5, 8, 10, 12, 15, 18, 22, 25, 30, 35, 45, 55, 62, 66, 60, 48, 30],
    photos: [],
  },
];

export interface SeedReview {
  authorId: string;
  stars: number;
  when: string;
  text: string;
}

export const SEED_REVIEWS: Record<string, SeedReview[]> = {
  klib: [
    {
      authorId: 'jordan',
      stars: 5,
      when: '2h ago',
      text: 'floor 4 before 9am is a religious experience. bring a hoodie, the ac does not play.',
    },
    {
      authorId: 'priya',
      stars: 4,
      when: 'yesterday',
      text: 'outlets at every table on the north side. south side is a gamble.',
    },
    { authorId: 'sam', stars: 4, when: '3d ago', text: 'got a seat at 2p on a tuesday which felt illegal.' },
  ],
  '1901': [
    {
      authorId: 'priya',
      stars: 5,
      when: '40m ago',
      text: 'poke line moves fast if you go before 11:30. after that, good luck.',
    },
    { authorId: 'jordan', stars: 3, when: '1d ago', text: 'solid, but $14 for a bowl is crazy work.' },
    { authorId: 'sam', stars: 4, when: '4d ago', text: 'the chicken tenders are carrying this rating.' },
  ],
  vg: [
    { authorId: 'sam', stars: 4, when: '5h ago', text: 'all you can eat + dessert bar = i am not leaving.' },
    { authorId: 'jordan', stars: 3, when: '2d ago', text: 'hit or miss. taco tuesday is a hit.' },
  ],
  uu: [
    {
      authorId: 'priya',
      stars: 4,
      when: '1d ago',
      text: 'best people watching on campus. do not try to take a zoom call here.',
    },
    { authorId: 'jordan', stars: 4, when: '6d ago', text: 'shade tables go fast after 11.' },
  ],
  bsa: [
    {
      authorId: 'jordan',
      stars: 5,
      when: '3h ago',
      text: 'whiteboards on every wall. our group project lives here now.',
    },
    { authorId: 'priya', stars: 4, when: '2d ago', text: 'sunny, loud-ish, great outlets.' },
  ],
  cm: [
    { authorId: 'sam', stars: 4, when: '8h ago', text: 'celsius always stocked. that is the review.' },
    { authorId: 'priya', stars: 3, when: '3d ago', text: 'fine for snacks, sad for meals.' },
  ],
  pcv: [
    { authorId: 'sam', stars: 5, when: '1d ago', text: 'couches are elite and it is dead after 10p.' },
    { authorId: 'jordan', stars: 4, when: '4d ago', text: 'solid late-night option if you live up here.' },
  ],
};

export interface SeedUser {
  name: string;
  handle: string;
  majorYear: string;
  ratingCount: number;
  avgGiven: number;
  followers: number;
  /** 5★ down to 1★. */
  dist: [number, number, number, number, number];
  foodPct: number;
  labels: string[];
  top: [string, number][];
}

export const SEED_USERS: Record<string, SeedUser> = {
  jordan: {
    name: 'jordan kim',
    handle: 'jkim.eats',
    majorYear: 'mech e · 4th yr',
    ratingCount: 128,
    avgGiven: 3.9,
    followers: 214,
    dist: [38, 46, 28, 11, 5],
    foodPct: 58,
    labels: ['early bird', 'library regular', 'tough on prices'],
    top: [
      ['klib', 5],
      ['bsa', 5],
      ['1901', 3],
    ],
  },
  priya: {
    name: 'priya shah',
    handle: 'priyastudies',
    majorYear: 'bio · 2nd yr',
    ratingCount: 74,
    avgGiven: 4.2,
    followers: 131,
    dist: [30, 28, 10, 4, 2],
    foodPct: 46,
    labels: ['poke loyalist', 'outlet hunter', 'generous rater'],
    top: [
      ['1901', 5],
      ['klib', 4],
      ['uu', 4],
    ],
  },
  sam: {
    name: 'sam ortega',
    handle: 'samuel.o',
    majorYear: 'business · 3rd yr',
    ratingCount: 91,
    avgGiven: 4.1,
    followers: 97,
    dist: [29, 37, 18, 5, 2],
    foodPct: 71,
    labels: ['snack scout', 'night owl', 'dessert first'],
    top: [
      ['pcv', 5],
      ['vg', 4],
      ['cm', 4],
    ],
  },
};

export const SEED_ME: Me = {
  id: 'me',
  name: 'maya reyes',
  handle: 'mayaeats',
  majorYear: 'comm studies · 3rd yr',
  bio: 'rating every iced latte on campus so you don’t have to.',
  email: 'mreyes@calpoly.edu',
  followers: 86,
  isTopRater: true,
};

export const SEED_MY_RATINGS = [
  { spotId: 'klib', stars: 5, ratedAtLabel: 'sep 26', note: 'floor 4 before 9am is the move. north side for outlets.' },
  {
    spotId: '1901',
    stars: 4,
    ratedAtLabel: 'sep 24',
    note: 'poke line was 6 min at 11:15. by noon it was out the door.',
  },
  { spotId: 'bsa', stars: 5, ratedAtLabel: 'sep 22', note: 'whiteboards + outlets. group project heaven.' },
  { spotId: 'vg', stars: 3, ratedAtLabel: 'sep 19', note: 'dessert bar carried. entrée was mid.' },
  { spotId: 'uu', stars: 4, ratedAtLabel: 'sep 15', note: 'good for a sunny hour, not a real study sesh.' },
  { spotId: 'cm', stars: 3, ratedAtLabel: 'sep 12', note: 'celsius stocked, chips not.' },
];

/** Leaderboard population. `userId: null` means there is no profile to open yet. */
export const SEED_LEADERBOARD_PEOPLE: { userId: string | null; name: string; handle: string; isMe: boolean }[] = [
  { userId: 'jordan', name: 'jordan kim', handle: 'jkim.eats', isMe: false },
  { userId: 'sam', name: 'sam ortega', handle: 'samuel.o', isMe: false },
  { userId: 'priya', name: 'priya shah', handle: 'priyastudies', isMe: false },
  { userId: null, name: 'lena park', handle: 'lena.lockin', isMe: false },
  { userId: null, name: 'dev patel', handle: 'devdoesdining', isMe: false },
  { userId: null, name: 'kai nguyen', handle: 'kaistudies', isMe: false },
  { userId: 'me', name: '', handle: '', isMe: true },
  { userId: null, name: 'noah lee', handle: 'noahsnacks', isMe: false },
  { userId: null, name: 'ella brooks', handle: 'ella.slo', isMe: false },
  { userId: null, name: 'max ruiz', handle: 'maxatkennedy', isMe: false },
];

/** Values align by index with SEED_LEADERBOARD_PEOPLE. */
export const SEED_LEADERBOARD_VALUES = {
  ratings: [128, 91, 74, 66, 58, 51, 47, 44, 39, 33],
  reviews: [61, 40, 52, 22, 35, 18, 19, 27, 12, 15],
  spots: [34, 29, 31, 24, 27, 22, 21, 19, 18, 16],
  streak: [42, 17, 23, 9, 12, 30, 14, 6, 11, 8],
} as const;

export const LEADERBOARD_META = {
  ratings: { label: 'ratings', description: 'spots you’ve rated, all time', unit: 'ratings' },
  reviews: { label: 'reviews', description: 'ratings with a written review', unit: 'reviews' },
  spots: { label: 'spots', description: 'different places you’ve rated', unit: 'spots' },
  streak: { label: 'streak', description: 'days in a row with a rating', unit: 'days' },
} as const;
