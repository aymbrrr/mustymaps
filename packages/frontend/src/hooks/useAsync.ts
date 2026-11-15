import { DependencyList, useEffect, useState } from 'react';

/** One-shot async read for screens that don't need shared state (leaderboard, a public profile). */
export function useAsync<T>(load: () => Promise<T>, deps: DependencyList): T | null {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    let active = true;
    load().then((result) => {
      if (active) setValue(result);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return value;
}
