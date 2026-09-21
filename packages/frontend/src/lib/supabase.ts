/**
 * Supabase client for Expo SDK 54 / React Native 0.81.
 *
 * Uses expo-sqlite/localStorage/install as the URL + storage polyfill.
 * This is the official Expo-recommended approach (docs.expo.dev/guides/using-supabase).
 * Do NOT use react-native-url-polyfill — it is incompatible with Hermes in RN 0.81.
 *
 * The import MUST be the first line so the polyfill is applied before
 * any Supabase code runs.
 */
import 'expo-sqlite/localStorage/install';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Fail loudly here rather than letting every query return an opaque network
// error. Placeholder values from .env.example count as unset.
if (!supabaseUrl || supabaseUrl.includes('your-project-ref')) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_URL is not set. Copy packages/frontend/.env.example to .env, ' +
      'fill in the real values, then restart with: npx expo start --clear'
  );
}
if (!supabaseAnonKey || supabaseAnonKey.includes('your-anon-key')) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_ANON_KEY is not set. Copy packages/frontend/.env.example to .env, ' +
      'fill in the real values, then restart with: npx expo start --clear'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // localStorage is provided by expo-sqlite/localStorage/install
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
