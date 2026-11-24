import { useEffect, useRef, useState, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Shared dialog behaviour for Modal and Drawer:
 * - focus moves into the dialog (the container itself, so no focus ring shows on open),
 * - Tab / Shift+Tab are trapped inside,
 * - Esc calls `onClose`,
 * - page scroll is locked while open,
 * - on close, focus returns to the element that opened it (the trigger).
 */
export function useDialog(ref: RefObject<HTMLElement>, onClose: () => void) {
  // The trigger is whatever had focus when the dialog first rendered.
  const [returnTo] = useState<Element | null>(() => document.activeElement);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.focus({ preventScroll: true });

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      );
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === node)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !node.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    node.addEventListener('keydown', onKeyDown);

    return () => {
      node.removeEventListener('keydown', onKeyDown);
      root.style.overflow = previousOverflow;
      if (returnTo instanceof HTMLElement && returnTo.isConnected && returnTo !== document.body) {
        returnTo.focus({ preventScroll: true });
      }
    };
  }, [ref, returnTo]);
}
