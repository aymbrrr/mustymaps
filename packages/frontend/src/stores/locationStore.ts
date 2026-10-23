import { create } from 'zustand';
import { Busyness, OpenSeats } from '../lib/crowdUtils';
import { createReport, fetchLocationStatuses, fetchRecentReports } from '../services/locationService';

export interface LocationStatus {
  location_id: string; slug: string; name: string; category: string; lat: number; lng: number;
  building: string | null; hours: unknown; busyness: number | null; wait_minutes: number | null;
  open_seats: OpenSeats | null; free_food: boolean; report_count: number; last_report_at: string | null;
}

export interface Report {
  id: string; busyness: Busyness; wait_minutes: number | null; open_seats: OpenSeats | null;
  free_food: boolean; note: string | null; created_at: string;
}

export interface NewReport {
  location_id: string; busyness: Busyness; wait_minutes?: number | null; open_seats?: OpenSeats | null;
  free_food?: boolean; note?: string | null;
}

interface LocationState {
  locations: LocationStatus[]; isLoading: boolean; error: string | null;
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

  fetchLocations: async () => {
    set({ isLoading: true, error: null });
    const result = await fetchLocationStatuses();
    if (result.error) {
      set({ isLoading: false, error: result.error });
      return;
    }
    set({ locations: result.data, isLoading: false });
  },

  getRecentReports: (locationId) => fetchRecentReports(locationId),

  submitReport: async (report) => {
    const result = await createReport(report);
    if (!result.ok) return result;
    await get().fetchLocations();
    return { ok: true };
  },
}));
