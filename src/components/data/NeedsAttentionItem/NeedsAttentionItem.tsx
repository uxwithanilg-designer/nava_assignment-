import clsx from 'clsx';
import type { FocusEventHandler, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/icons';
import { EvidencePhoto, type EvidenceCrop } from '@/components/data/EvidencePhoto';
import { StatusChip, type ChipStatus } from '@/components/ui/StatusChip';
import { ReviewTag, type ReviewKind } from '@/components/ui/ReviewTag';
import type { EvidenceImageKey } from '@/data/evidenceImages';
import styles from './NeedsAttentionItem.module.css';

/**
 * Figma "Needs-attention item" (51:394). State Default / Hover.
 * Evidence photo S (128×72, mono time pill) · ID (Mono/S) + meta + age · title (Body/S Medium) · status chip + review tag.
 * Hover: subtle fill and a chevron at the end of the tag row.
 */
export type NeedsAttentionItemState = 'Default' | 'Hover';

export interface NeedsAttentionItemProps {
  /** Temporary visit ID, "TV-0412". */
  id: string;
  /** "Inward · Main gate" */
  meta: string;
  /** Waiting time, "6 h". */
  age: string;
  title: string;
  status: ChipStatus;
  statusLabel?: string;
  review: ReviewKind;
  reviewName?: string;
  reviewInitials?: string;
  image?: EvidenceImageKey;
  /** Mono time on the photo, "07:41:56". */
  photoTime?: string;
  photoAlt?: string;
  crop?: EvidenceCrop;
  state?: NeedsAttentionItemState;
  /**
   * Show the Hover variant's chevron (default true). The dashboard frames show their first item in the
   * Hover fill with the chevron hidden, so lists pass false for that resting highlight.
   */
  chevron?: boolean;
  /** Prototype link (the visit page). Without it the item is not a link. */
  to?: string;
  className?: string;
  onMouseEnter?: MouseEventHandler<HTMLElement>;
  onMouseLeave?: MouseEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
}

export function NeedsAttentionItem({
  id,
  meta,
  age,
  title,
  status,
  statusLabel,
  review,
  reviewName,
  reviewInitials,
  image,
  photoTime,
  photoAlt,
  crop,
  state = 'Default',
  chevron = true,
  to,
  className,
  ...handlers
}: NeedsAttentionItemProps) {
  const hover = state === 'Hover';
  const cls = clsx(styles.item, hover && styles.hover, to && styles.link, className);
  const body = (
    <>
      <EvidencePhoto size="S" image={image} time={photoTime} alt={photoAlt ?? `${id} camera frame at ${photoTime}`} crop={crop} />
      <span className={styles.content}>
        <span className={styles.head}>
          <span className={styles.id}>{id}</span>
          <span className={styles.meta}>{meta}</span>
          <span className={styles.spacer} />
          <span className={styles.meta}>{age}</span>
        </span>
        <span className={styles.title}>{title}</span>
        <span className={styles.tags}>
          <StatusChip status={status} label={statusLabel} />
          <ReviewTag review={review} name={reviewName} initials={reviewInitials} />
          {hover && chevron && (
            <>
              <span className={styles.spacer} />
              <Icon name="chevron-right" size={16} color="var(--text-secondary)" />
            </>
          )}
        </span>
      </span>
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} {...handlers}>
        {body}
      </Link>
    );
  }
  return (
    <div className={cls} {...handlers}>
      {body}
    </div>
  );
}
