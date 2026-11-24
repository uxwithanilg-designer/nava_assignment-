import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** One-shot toast passed to the visit page through router state after assign / close. */
export interface VisitToast {
  message: string;
  /** Show "Undo" (assign only, as in 06). */
  undo?: boolean;
}

export interface VisitLocationState {
  toast?: VisitToast;
}

/** Toasts hide after about 6 s (they stay on the ?demo= deep links). */
export const TOAST_DURATION_MS = 6000;

export function visitPath(visitId: string): string {
  return `/gate/visits/${visitId}`;
}

/**
 * Close a drawer / modal route: go back in history (to the visit page, or to the evidence viewer
 * that opened the modal); on a deep link with no history, replace with the visit page.
 */
export function useCloseOverlay(visitId: string): () => void {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(() => {
    if (location.key !== 'default') navigate(-1);
    else navigate(visitPath(visitId), { replace: true });
  }, [location.key, navigate, visitId]);
}
