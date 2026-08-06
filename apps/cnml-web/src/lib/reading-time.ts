/**
 * Reading-time estimate helper (TODO.cnml/44).
 *
 * words / 220 = minutes, rounded, floored to 1.
 *
 * The 220 wpm baseline is the median for technical English prose
 * (studies vary from 200 to 250). The number is conservative —
 * technical content is slower to read than general prose.
 */

const WORDS_PER_MINUTE = 220;

export function readingTimeMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export const READING_WORDS_PER_MINUTE = WORDS_PER_MINUTE;
