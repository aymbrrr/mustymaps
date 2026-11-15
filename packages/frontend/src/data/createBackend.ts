/**
 * Composes the Backend the app runs against.
 *
 * Auth is live against Supabase; the rest of the data still comes from the
 * in-memory scaffold because the spots/reviews/leaderboard tables that match
 * the design do not exist yet. Ports make this mix-and-match safe — each slot
 * can graduate to a real adapter on its own schedule.
 */
import { Backend } from '../domain/ports';
import { createInMemoryBackend } from './InMemoryBackend';
import { SupabaseAuthGateway } from './SupabaseAuthGateway';

export function createBackend(): Backend {
  return { ...createInMemoryBackend(), auth: new SupabaseAuthGateway() };
}
