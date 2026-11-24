import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { Person } from '@/types/domain';

/**
 * Demo review state (local only, no backend).
 * TV-0412 moves needs_review (no owner) → assigned (Emily C) → closed (reason, note, 14:52).
 * TV-0438 link moves unclear → confirmed.
 * Persisted to sessionStorage so a refresh keeps the demo state; "Reset demo data" on /screens clears it.
 * Dashboards (01, 02, 02b, 03) never read this: they stay exactly as designed.
 */
export type VisitReviewPhase = 'needs_review' | 'assigned' | 'closed';

export interface VisitOverride {
  phase: VisitReviewPhase;
  ownerId?: Person['id'];
  /** Note given when assigning. */
  assignNote?: string;
  /** Close reason id + note. */
  reasonId?: string;
  closeNote?: string;
}

export interface DemoState {
  visits: Record<string, VisitOverride>;
  /** Visit id → truck the reviewer picked in "Which truck?". */
  links: Record<string, string>;
}

type Action =
  | { type: 'assign'; visitId: string; ownerId: Person['id']; note?: string }
  | { type: 'unassign'; visitId: string }
  | { type: 'close'; visitId: string; reasonId: string; note: string }
  | { type: 'reopen'; visitId: string }
  | { type: 'confirmLink'; visitId: string; truckId: string }
  | { type: 'seed'; visitId: string; override: VisitOverride }
  | { type: 'reset' };

const STORAGE_KEY = 'gateview-demo-state';
const EMPTY: DemoState = { visits: {}, links: {} };

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case 'assign':
      return {
        ...state,
        visits: {
          ...state.visits,
          [action.visitId]: { phase: 'assigned', ownerId: action.ownerId, assignNote: action.note },
        },
      };
    case 'unassign': {
      const visits = { ...state.visits };
      delete visits[action.visitId];
      return { ...state, visits };
    }
    case 'close':
      return {
        ...state,
        visits: {
          ...state.visits,
          [action.visitId]: {
            ...state.visits[action.visitId],
            phase: 'closed',
            reasonId: action.reasonId,
            closeNote: action.note,
          },
        },
      };
    case 'reopen': {
      const prev = state.visits[action.visitId];
      return {
        ...state,
        visits: {
          ...state.visits,
          [action.visitId]: { phase: prev?.ownerId ? 'assigned' : 'needs_review', ownerId: prev?.ownerId },
        },
      };
    }
    case 'confirmLink':
      return { ...state, links: { ...state.links, [action.visitId]: action.truckId } };
    case 'seed':
      return { ...state, visits: { ...state.visits, [action.visitId]: action.override } };
    case 'reset':
      return EMPTY;
    default:
      return state;
  }
}

function load(): DemoState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as DemoState) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

interface ReviewStoreValue {
  state: DemoState;
  assign: (visitId: string, ownerId: Person['id'], note?: string) => void;
  unassign: (visitId: string) => void;
  close: (visitId: string, reasonId: string, note: string) => void;
  reopen: (visitId: string) => void;
  confirmLink: (visitId: string, truckId: string) => void;
  seed: (visitId: string, override: VisitOverride) => void;
  reset: () => void;
}

const ReviewStoreContext = createContext<ReviewStoreValue | null>(null);

export function ReviewStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable (private mode): keep state in memory only */
    }
  }, [state]);

  const assign = useCallback(
    (visitId: string, ownerId: Person['id'], note?: string) => dispatch({ type: 'assign', visitId, ownerId, note }),
    [],
  );
  const unassign = useCallback((visitId: string) => dispatch({ type: 'unassign', visitId }), []);
  const close = useCallback(
    (visitId: string, reasonId: string, note: string) => dispatch({ type: 'close', visitId, reasonId, note }),
    [],
  );
  const reopen = useCallback((visitId: string) => dispatch({ type: 'reopen', visitId }), []);
  const confirmLink = useCallback(
    (visitId: string, truckId: string) => dispatch({ type: 'confirmLink', visitId, truckId }),
    [],
  );
  const seed = useCallback(
    (visitId: string, override: VisitOverride) => dispatch({ type: 'seed', visitId, override }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const value = useMemo(
    () => ({ state, assign, unassign, close, reopen, confirmLink, seed, reset }),
    [state, assign, unassign, close, reopen, confirmLink, seed, reset],
  );
  return <ReviewStoreContext.Provider value={value}>{children}</ReviewStoreContext.Provider>;
}

export function useReviewStore(): ReviewStoreValue {
  const ctx = useContext(ReviewStoreContext);
  if (!ctx) throw new Error('useReviewStore must be used inside <ReviewStoreProvider>');
  return ctx;
}
