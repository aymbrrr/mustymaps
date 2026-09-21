/**
 * Input validation.
 *
 * Supabase JS uses parameterized queries, so this is not SQL-injection defence —
 * it keeps malformed values from reaching the database and tripping a CHECK
 * constraint, which would surface as an opaque error to the user.
 */

export const NOTE_MAX_LENGTH = 280;

export const validate = {
  /** Trim and truncate a report note to the column limit. */
  note: (input: string): string => input.trim().slice(0, NOTE_MAX_LENGTH),

  /** Busyness must be 1, 2, or 3. */
  busyness: (value: number): 1 | 2 | 3 => {
    const n = Math.round(value);
    if (n !== 1 && n !== 2 && n !== 3) {
      throw new Error('Busyness must be 1, 2, or 3');
    }
    return n;
  },

  /** Wait time in minutes, clamped to the range the column accepts. */
  waitMinutes: (value: number): number => Math.round(Math.max(0, Math.min(120, value))),

  email: (input: string): string => input.trim().toLowerCase(),
};
