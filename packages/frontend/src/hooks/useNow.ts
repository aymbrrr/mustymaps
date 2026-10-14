import { useEffect, useState } from 'react';
import { clockLabel, hourIndexFor } from '../domain/busyness';

const TICK_MS = 30_000;

/**
 * Wall-clock time for the "rn is 2:14 pm" labels and the current-hour bar on
 * every busyness chart. Ticks on a timer rather than per render so the whole app
 * agrees on what "now" means.
 */
export function useNow(): { now: Date; nowIndex: number; nowLabel: string } {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return { now, nowIndex: hourIndexFor(now), nowLabel: clockLabel(now) };
}
