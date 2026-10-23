import { supabase } from '../lib/supabase';
import type { LocationStatus, NewReport, Report } from '../stores/locationStore';

export async function fetchLocationStatuses(): Promise<{ data: LocationStatus[]; error?: string }> {
  const { data, error } = await supabase.from('location_live_status').select('*').order('name');
  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as LocationStatus[] };
}

export async function fetchRecentReports(locationId: string): Promise<Report[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('id, busyness, wait_minutes, open_seats, free_food, note, created_at')
    .eq('location_id', locationId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error || !data) return [];
  return data as Report[];
}

export async function createReport(report: NewReport): Promise<{ ok: boolean; error?: string }> {
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

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
