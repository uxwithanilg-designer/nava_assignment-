import clsx from 'clsx';
import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '@/components/ui/IconButton';
import { useDialog } from './useDialog';
import styles from './Modal.module.css';

/**
 * Modal (Figma "Close modal" 68:4059): 560px white card centred on a full-viewport dim
 * (navy/950 @ 50%), radius 16, Shadow/Float. Header: Title/Panel + close ×, description below.
 * The body and the footer (top border) come from the caller.
 * Focus is trapped, Esc / × / a click on the dim call `onClose`, focus returns to the trigger.
 * Fades in over 150–200 ms (no motion with prefers-reduced-motion).
 */
export interface ModalProps {
  title: ReactNode;
  description?: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
  width?: number;
  closeLabel?: string;
  className?: string;
}

export function Modal({
  title,
  description,
  onClose,
  footer,
  children,
  width = 560,
  closeLabel = 'Close',
  className,
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
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
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={clsx(styles.modal, className)}
        style={{ width }}
      >
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <IconButton icon="x" aria-label={closeLabel} onClick={onClose} />
          </div>
          {description && (
            <p id={descriptionId} className={styles.description}>
              {description}
            </p>
          )}
        </header>
        {children}
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
