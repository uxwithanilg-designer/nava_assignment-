import clsx from 'clsx';
import { Icon, type IconName } from '@/components/icons';
import styles from './Toast.module.css';

/**
 * Toast (Figma 68:3208 / 68:3759): inverse navy box, cyan check icon, Body/S Medium message,
 * optional cyan "Undo" action. Rendered in a fixed band at the top centre of the main column
 * (`top` px from the viewport top, right of the sidebar). Fades in over 200 ms (none with reduced motion).
 */
export interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: IconName;
  /** Distance from the top of the viewport (Figma: 84). */
  top?: number;
  className?: string;
}

export function Toast({ message, actionLabel, onAction, icon = 'check-circle', top = 84, className }: ToastProps) {
  return (
    <div className={styles.region} style={{ top }}>
      <div className={clsx(styles.toast, className)} role="status" aria-live="polite">
        <Icon name={icon} size={18} color="var(--cyan-400)" />
        <p className={styles.message}>{message}</p>
        {actionLabel && (
          <button type="button" className={styles.action} onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
