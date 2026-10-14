/**
 * Session, profile and settings state. Delegates every side effect to the
 * AuthGateway / ProfileRepository / SettingsRepository ports.
 */
import { create } from 'zustand';
import { backend } from '../data/backend';
import { supabase } from '../lib/supabase';
import { AppSettings, DEFAULT_SETTINGS, Me, MeDraft } from '../domain/models';

export type SessionStatus = 'signedOut' | 'awaitingCode' | 'signedIn';

interface SessionState {
  status: SessionStatus;
  me: Me | null;
  settings: AppSettings;
  /** Email that sign-up is waiting on a code for. */
  pendingEmail: string;
  isBusy: boolean;
  /** False until the stored session has been checked, so we don't flash the intro. */
  isReady: boolean;

  initialize: () => () => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  verifyCode: (code: string) => Promise<string | null>;
  resendCode: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  editEmail: () => void;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<string | null>;
  saveProfile: (draft: MeDraft) => Promise<void>;
  toggleSetting: (key: keyof AppSettings) => Promise<void>;
}

/** Ports reject with user-safe messages; surface them rather than throwing. */
async function attempt(run: () => Promise<void>): Promise<string | null> {
  try {
    await run();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : 'something went wrong.';
  }
}

type SetState = (partial: Partial<SessionState>) => void;

async function hydrateSignedIn(set: SetState): Promise<void> {
  const [me, settings] = await Promise.all([
    backend().profiles.getMe(),
    backend().settings.load(),
  ]);
  set({ status: 'signedIn', me, settings, pendingEmail: '' });
}

export const useSessionStore = create<SessionState>((set, get) => ({
  status: 'signedOut',
  me: null,
  settings: DEFAULT_SETTINGS,
  pendingEmail: '',
  isBusy: false,
  isReady: false,

  /**
   * Restores a stored session on launch and follows it afterwards, so a cold
   * start lands you back in the app and confirming by email link (rather than
   * by typing the code) also signs you in. Returns an unsubscribe function.
   */
  initialize: () => {
    void supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) await hydrateSignedIn(set);
      set({ isReady: true });
    });

    // Only an explicit sign-out clears state — a null session during sign-up
    // is normal while the email is still unconfirmed, and must not knock the
    // user off the code screen.
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) await hydrateSignedIn(set);
      else if (event === 'SIGNED_OUT') set({ status: 'signedOut', me: null });
    });

    return () => data.subscription.unsubscribe();
  },

  signIn: async (email, password) => {
    set({ isBusy: true });
    const failure = await attempt(() => backend().auth.signIn(email, password));
    if (failure) {
      set({ isBusy: false });
      return failure;
    }
    await hydrateSignedIn(set);
    set({ isBusy: false });
    return null;
  },

  signUp: async (email, password) => {
    set({ isBusy: true });
    try {
      const { needsVerification } = await backend().auth.signUp(email, password);
      if (needsVerification) set({ status: 'awaitingCode', pendingEmail: email });
      else await hydrateSignedIn(set);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'something went wrong.';
    } finally {
      set({ isBusy: false });
    }
  },

  verifyCode: async (code) => {
    set({ isBusy: true });
    const failure = await attempt(() => backend().auth.verifyCode(get().pendingEmail, code));
    if (failure) {
      set({ isBusy: false });
      return failure;
    }
    await hydrateSignedIn(set);
    set({ isBusy: false });
    return null;
  },

  resendCode: async () => {
    await backend().auth.resendCode(get().pendingEmail);
  },

  requestPasswordReset: (email) => attempt(() => backend().auth.requestPasswordReset(email)),

  editEmail: () => set({ status: 'signedOut' }),

  signOut: async () => {
    await backend().auth.signOut();
    set({ status: 'signedOut', me: null, pendingEmail: '' });
  },

  deleteAccount: async () => {
    const failure = await attempt(() => backend().auth.deleteAccount());
    if (failure) return failure;
    set({ status: 'signedOut', me: null, pendingEmail: '' });
    return null;
  },

  saveProfile: async (draft) => {
    const me = await backend().profiles.updateMe(draft);
    set({ me });
  },

  toggleSetting: async (key) => {
    const settings = { ...get().settings, [key]: !get().settings[key] };
    set({ settings });
    await backend().settings.save(settings);
  },
}));
