/**
 * Auth store — session, user, sign in/out.
 *
 * Tokens are persisted via expo-sqlite localStorage (handled by Supabase client).
 * Never store tokens in AsyncStorage — it is unencrypted plaintext.
 *
 * On app launch, Supabase auto-restores the session from secure storage.
 * Subscribe to onAuthStateChange to keep this store in sync.
 */
import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  exitGuest: () => void;
  setSession: (session: Session | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isGuest: false,
  isLoading: false,
  error: null,

  // Guests hold no Supabase session, so reads run as the `anon` role and RLS
  // is what actually enforces least-privilege access — not this flag.
  continueAsGuest: () => set({ isGuest: true, error: null }),

  exitGuest: () => set({ isGuest: false }),

  setSession: (session) =>
    set((state) => ({
      session,
      user: session?.user ?? null,
      isGuest: session ? false : state.isGuest,
    })),

  clearError: () => set({ error: null }),

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      // Supabase sends a confirmation email by default.
      // Session will be set via onAuthStateChange once confirmed.
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    await supabase.auth.signOut();
    set({ session: null, user: null, isGuest: false, isLoading: false });
  },
}));
