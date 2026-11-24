/**
 * Close reasons offered in the OV "Close with reason" modal (Figma 68:4059), in Figma order.
 * The ids are a contract with the evidence viewer (screen 11): it opens the modal with
 * `navigate('/gate/visits/TV-0412/close', { state: { reasonId: 'observed-on-review' } })`.
 */
export type CloseReasonId =
  | 'observed-on-review'
  | 'not-done-action-taken'
  | 'not-evaluable'
  | 'incorrect-association'
  | 'duplicate-false'
  | 'other';

export interface CloseReason {
  id: CloseReasonId;
  /** Radio label, exactly as in Figma. */
  label: string;
  /** Short form used in the "Closed · …" chip and in the history line. */
  short: string;
  /** Helper under the label (Figma shows it on reason 1 only). `step` is the step under review. */
  helper?: (step: string) => string;
}

export const CLOSE_REASONS: CloseReason[] = [
  {
    id: 'observed-on-review',
    label: 'Confirmed: activity observed on review',
    short: 'observed on review',
    helper: (step) => `${step} will show as “Observed · confirmed by reviewer”.`,
  },
  { id: 'not-done-action-taken', label: 'Confirmed: activity not done — action taken', short: 'not done, action taken' },
  { id: 'not-evaluable', label: 'Not evaluable: camera or visibility issue', short: 'not evaluable' },
  { id: 'incorrect-association', label: 'Incorrect association — re-linked', short: 're-linked' },
  { id: 'duplicate-false', label: 'Duplicate or false detection', short: 'duplicate or false detection' },
  { id: 'other', label: 'Other — note required', short: 'other' },
];

/** Modal description (OV). */
export const CLOSE_MODAL_DESCRIPTION =
  'Pick the reason that matches what you saw. It is saved in the visit history and shows in reports.';

export const DEFAULT_CLOSE_REASON: CloseReasonId = 'observed-on-review';

export function isCloseReasonId(value: unknown): value is CloseReasonId {
  return typeof value === 'string' && CLOSE_REASONS.some((r) => r.id === value);
}

export function getCloseReason(id: string | undefined): CloseReason {
  return CLOSE_REASONS.find((r) => r.id === id) ?? CLOSE_REASONS[0];
}
