import clsx from 'clsx';
import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '@/components/ui/IconButton';
import { useDialog } from '@/components/ui/Modal';
import styles from './Drawer.module.css';

/**
 * Drawer (Figma "Assign drawer" 68:3973 on dim 68:3972): full-height panel on the right,
 * 460px wide, Shadow/Float, over a full-viewport dim (navy/950 @ 45%). Slides in over 200 ms
 * (no motion with prefers-reduced-motion). Header: Title/Panel + ×, subtitle, bottom border.
 * Focus is trapped, Esc / × / a click on the dim call `onClose`, focus returns to the trigger.
 */
export interface DrawerProps {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
  width?: number;
  closeLabel?: string;
  className?: string;
}

export function Drawer({
  title,
  subtitle,
  onClose,
  footer,
  children,
  width = 460,
  closeLabel = 'Close',
  className,
}: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialog(ref, onClose);

  return createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={clsx(styles.drawer, className)}
        style={{ width }}
      >
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <IconButton icon="x" aria-label={closeLabel} onClick={onClose} />
          </div>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
