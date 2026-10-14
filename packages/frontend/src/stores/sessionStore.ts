/**
 * Session, profile and settings state. Delegates every side effect to the
 * AuthGateway / ProfileRepository / SettingsRepository ports.
 */
import { create } from 'zustand';
import { backend } from '../data/backend';
import { AppSettings, DEFAULT_SETTINGS, Me, MeDraft } from '../domain/models';

export type SessionStatus = 'signedOut' | 'awaitingCode' | 'signedIn';

interface SessionState {
  status: SessionStatus;
  me: Me | null;
  settings: AppSettings;
  /** Email that sign-up is waiting on a code for. */
  pendingEmail: string;
  isBusy: boolean;

  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  verifyCode: (code: string) => Promise<string | null>;
  resendCode: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  editEmail: () => void;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
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

export const useSessionStore = create<SessionState>((set, get) => ({
  status: 'signedOut',
  me: null,
  settings: DEFAULT_SETTINGS,
  pendingEmail: '',
  isBusy: false,

  signIn: async (email, password) => {
    set({ isBusy: true });
    const failure = await attempt(() => backend().auth.signIn(email, password));
    if (failure) {
      set({ isBusy: false });
      return failure;
    }
    const [me, settings] = await Promise.all([backend().profiles.getMe(), backend().settings.load()]);
    set({ status: 'signedIn', me, settings, isBusy: false });
    return null;
  },

  signUp: async (email, password) => {
    set({ isBusy: true });
    const failure = await attempt(() => backend().auth.signUp(email, password));
    set({ isBusy: false, ...(failure ? {} : { status: 'awaitingCode', pendingEmail: email }) });
    return failure;
  },

  verifyCode: async (code) => {
    set({ isBusy: true });
    const failure = await attempt(() => backend().auth.verifyCode(get().pendingEmail, code));
    if (failure) {
      set({ isBusy: false });
      return failure;
    }
    const [me, settings] = await Promise.all([backend().profiles.getMe(), backend().settings.load()]);
    set({ status: 'signedIn', me, settings, pendingEmail: '', isBusy: false });
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
    await backend().auth.deleteAccount();
    set({ status: 'signedOut', me: null, pendingEmail: '' });
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
