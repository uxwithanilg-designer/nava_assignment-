import { getCloseReason } from '@/data/closeReasons';
import { currentUser, people } from '@/data/people';
import {
  ASSIGNED_ACTIONS,
  CLOSED_ACTIONS,
  DEMO_TIMES,
  type ReviewPanelData,
  type VisitDetail,
  type VisitView,
} from '@/data/visits';
import type { VisitOverride, VisitReviewPhase } from '@/store/reviewStore';

/**
 * Turns a visit's Figma data + the demo review state into what the page shows.
 * TV-0412 has the exact Figma states 06 (assigned to Emily C) and 07 (closed, observed on review).
 * Any other visit, owner or reason uses the same pattern, built from the visit's own data
 * (status chip, review panel, history) — no new UI.
 */
export interface ResolvedVisit extends VisitView {
  phase: VisitReviewPhase;
}

export function basePhase(detail: VisitDetail): VisitReviewPhase {
  return detail.review.ownerId ? 'assigned' : 'needs_review';
}

/** Seeds for the `?demo=assigned` / `?demo=closed` deep links (screens 06 and 07). */
export function demoOverride(detail: VisitDetail, demo: string | null): VisitOverride | undefined {
  const states = detail.states;
  if (demo === 'assigned' && states?.assigned) {
    return { phase: 'assigned', ownerId: states.assigned.ownerId, assignNote: detail.assign.note };
  }
  if (demo === 'closed' && states?.closed) {
    return {
      phase: 'closed',
      ownerId: states.closed.ownerId,
      assignNote: detail.assign.note,
      reasonId: states.closed.reasonId,
      closeNote: detail.close.note,
    };
  }
  return undefined;
}

function assignedView(detail: VisitDetail, override: VisitOverride): VisitView {
  const ownerId = override.ownerId ?? detail.review.ownerId;
  if (!ownerId || ownerId === detail.review.ownerId) return detail;
  const explicit = detail.states?.assigned;
  if (explicit && explicit.ownerId === ownerId) return { ...detail, ...explicit.view };
  const note = override.assignNote ? `. Note: “${override.assignNote}”` : '';
  const review: ReviewPanelData = {
    ...detail.review,
    ownerId,
    tip: undefined,
    actions: ASSIGNED_ACTIONS,
    history: [
      { time: DEMO_TIMES.assignedAt, text: `${currentUser.name} assigned it to ${people[ownerId].name}${note}` },
      ...detail.review.history,
    ],
  };
  return { ...detail, review };
}

function closedView(detail: VisitDetail, override: VisitOverride): VisitView {
  const reason = getCloseReason(override.reasonId);
  const note = override.closeNote ?? '';
  const explicit = detail.states?.closed;
  if (explicit && explicit.reasonId === reason.id) {
    return {
      ...detail,
      ...explicit.view,
      review: { ...(explicit.view.review ?? detail.review), closure: { reason: reason.label, note } },
    };
  }
  const before = override.ownerId ? assignedView(detail, { ...override, phase: 'assigned' }) : detail;
  const closerId = override.ownerId ?? detail.review.ownerId ?? currentUser.id;
  return {
    ...before,
    status: { status: 'Observed', label: `Closed · ${reason.short}` },
    review: {
      status: { status: 'Observed', label: 'Closed' },
      ownerId: closerId,
      detail: { label: 'Closed', value: DEMO_TIMES.closedLabel },
      closure: { reason: reason.label, note },
      actions: CLOSED_ACTIONS,
      history: [
        { time: DEMO_TIMES.closedAt, text: `${people[closerId].name} closed it: ${reason.short}` },
        ...before.review.history,
      ],
    },
  };
}

export function resolveVisit(detail: VisitDetail, override: VisitOverride | undefined): ResolvedVisit {
  if (!override) return { ...detail, phase: basePhase(detail) };
  if (override.phase === 'closed') return { ...closedView(detail, override), phase: 'closed' };
  if (override.phase === 'assigned') return { ...assignedView(detail, override), phase: 'assigned' };
  return { ...detail, phase: 'needs_review' };
}
