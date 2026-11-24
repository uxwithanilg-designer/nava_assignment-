import type { CoverageInput } from '@/types/domain';

/**
 * Coverage % is shown only when the base is reliable:
 *   - at least 80% of visits could be judged, AND
 *   - at least 10 visits in the view.
 * Otherwise the card shows a count plus "% hidden" and the reason.
 * Camera problems ("could not judge") are excluded from the % base — they are not violations.
 */
export const MIN_JUDGED_SHARE = 0.8;
export const MIN_VISITS = 10;

export type CoverageDisplay =
  | { kind: 'percent'; percent: number; label: string; judged: number; total: number }
  | { kind: 'hidden'; count: number; reason: 'few-visits' | 'low-judged'; reasonText: string };

export function getCoverageDisplay({ judged, total, observed }: CoverageInput): CoverageDisplay {
  if (total < MIN_VISITS) {
    return { kind: 'hidden', count: observed, reason: 'few-visits', reasonText: 'Fewer than 10 visits in this view' };
  }
  if (total === 0 || judged / total < MIN_JUDGED_SHARE) {
    return {
      kind: 'hidden',
      count: observed,
      reason: 'low-judged',
      reasonText: `Only ${judged} of ${total} visits could be judged`,
    };
  }
  const percent = Math.round((observed / judged) * 100);
  return { kind: 'percent', percent, label: `${percent}%`, judged, total };
}
