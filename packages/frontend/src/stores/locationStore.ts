/**
 * Location store — campus locations with their live crowd status.
 *
 * Reads the location_live_status view, which already applies the staleness
 * window server-side. A location with report_count === 0 has no fresh data
 * and renders as "unknown" rather than being hidden.
 */
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Busyness, OpenSeats } from '../lib/crowdUtils';

export interface LocationStatus {
  location_id: string;
  slug: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  building: string | null;
  hours: unknown;
  busyness: number | null;
  wait_minutes: number | null;
  open_seats: OpenSeats | null;
  free_food: boolean;
  report_count: number;
  last_report_at: string | null;
}

export interface Report {
  id: string;
  busyness: Busyness;
  wait_minutes: number | null;
  open_seats: OpenSeats | null;
  free_food: boolean;
  note: string | null;
  created_at: string;
}

export interface NewReport {
  location_id: string;
  busyness: Busyness;
  wait_minutes?: number | null;
  open_seats?: OpenSeats | null;
  free_food?: boolean;
  note?: string | null;
}

interface LocationState {
  locations: LocationStatus[];
  isLoading: boolean;
  error: string | null;

  fetchLocations: () => Promise<void>;
  getRecentReports: (locationId: string) => Promise<Report[]>;
  submitReport: (report: NewReport) => Promise<{ ok: boolean; error?: string }>;
  clearError: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  locations: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  // Campus is small enough to fetch every location at once — no radius query.
  fetchLocations: async () => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from('location_live_status')
      .select('*')
      .order('name');

    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }
    set({ locations: (data ?? []) as LocationStatus[], isLoading: false });
  },

  getRecentReports: async (locationId) => {
    const { data, error } = await supabase
      .from('reports')
      .select('id, busyness, wait_minutes, open_seats, free_food, note, created_at')
      .eq('location_id', locationId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !data) return [];
    return data as Report[];
  },

  submitReport: async (report) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'You need to be signed in to report.' };

    const { error } = await supabase.from('reports').insert({
      location_id: report.location_id,
      user_id: user.id,
      busyness: report.busyness,
      wait_minutes: report.wait_minutes ?? null,
      open_seats: report.open_seats ?? null,
      free_food: report.free_food ?? false,
      note: report.note ?? null,
    });

    if (error) {
      // The cooldown trigger raises check_violation with a user-facing message.
      return { ok: false, error: error.message };
    }

    await get().fetchLocations();
    return { ok: true };
  },
}));
