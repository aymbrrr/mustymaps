/**
 * The single seam between the app and whatever serves its data.
 *
 * App.tsx calls `configureBackend` once at startup. To move off the scaffold,
 * write an adapter that implements `Backend` (see src/domain/ports.ts) and pass
 * it here instead — nothing else in the app refers to a concrete backend.
 */
import { Backend } from '../domain/ports';

let active: Backend | null = null;

export function configureBackend(backend: Backend): void {
  active = backend;
}

export function backend(): Backend {
  if (!active) {
    throw new Error('Backend not configured. Call configureBackend() before rendering the app.');
  }
  return active;
}
