import clsx from 'clsx';
import { Icon } from '@/components/icons';
import { Avatar } from '@/components/ui/Avatar';
import styles from './ReviewTag.module.css';

/**
 * Figma "Review tag" (48:234) — the review-status family.
 * No owner (orange, attention) · Assigned (avatar + name) · Closed · None ("No review needed").
 */
export type ReviewKind = 'No owner' | 'Assigned' | 'Closed' | 'None';

export interface ReviewTagProps {
  review: ReviewKind;
  /** Person name for "Assigned", e.g. "Emily C". */
  name?: string;
  /** Avatar initials for "Assigned", e.g. "EC". */
  initials?: string;
  className?: string;
}

export function ReviewTag({ review, name = 'Emily C', initials = 'EC', className }: ReviewTagProps) {
  if (review === 'None') {
    return <span className={clsx(styles.tag, styles.none, className)}>No review needed</span>;
  }
  if (review === 'Assigned') {
    return (
      <span className={clsx(styles.tag, styles.assigned, className)}>
        <Avatar initials={initials} size="S" />
        <span className={styles.label}>{name}</span>
      </span>
    );
  }
  if (review === 'Closed') {
    return (
      <span className={clsx(styles.tag, styles.closed, className)}>
        <Icon name="check" size={12} color="var(--text-tertiary)" />
        <span className={styles.label}>Closed</span>
      </span>
    );
  }
  return (
    <span className={clsx(styles.tag, styles.noOwner, className)}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>No owner</span>
    </span>
  );
}
