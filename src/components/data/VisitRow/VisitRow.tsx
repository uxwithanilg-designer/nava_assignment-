import clsx from 'clsx';
import type { FocusEventHandler, MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/icons';
import { EvidencePhoto, type EvidenceCrop } from '@/components/data/EvidencePhoto';
import { Button } from '@/components/ui/Button';
import { EvidenceQuality, type Quality } from '@/components/ui/EvidenceQuality';
import { ReviewTag, type ReviewKind } from '@/components/ui/ReviewTag';
import { StatusChip, type ChipStatus } from '@/components/ui/StatusChip';
import type { EvidenceImageKey } from '@/data/evidenceImages';
import type { Direction } from '@/types/domain';
import styles from './VisitRow.module.css';

/**
 * Figma "Visit row" (53:369). State Default / Hover. One <tr> of the vehicle visits table:
 * Visit ID (XS photo + mono ID) · Gate · Direction · Entry / exit time · Inspection time · result ·
 * Disinfection time · result · Evidence quality · Review status · Action.
 * A row without an evidence image shows the empty viewfinder placeholder.
 */
export type VisitRowState = 'Default' | 'Hover';

export interface VisitStepCell {
  /** "07:38"; "—" when the step was not seen; empty when not required. */
  time?: string;
  result: ChipStatus;
}

export interface VisitRowData {
  id: string;
  image?: EvidenceImageKey;
  crop?: EvidenceCrop;
  gate: string;
  direction: Direction;
  /** Entry (inward) or exit (outward) time. */
  time: string;
  inspection: VisitStepCell;
  disinfection: VisitStepCell;
  quality: Quality;
  review: ReviewKind;
  reviewName?: string;
  reviewInitials?: string;
  /** "Review" (brand) for visits a person should look at, "View" (secondary) otherwise. */
  action: 'Review' | 'View';
}

export interface VisitRowProps {
  visit: VisitRowData;
  state?: VisitRowState;
  /** Prototype link: row click and the action button open this visit page. */
  to?: string;
  className?: string;
  onMouseEnter?: MouseEventHandler<HTMLTableRowElement>;
  onMouseLeave?: MouseEventHandler<HTMLTableRowElement>;
  onFocus?: FocusEventHandler<HTMLTableRowElement>;
  onBlur?: FocusEventHandler<HTMLTableRowElement>;
}

export function VisitRow({ visit, state = 'Default', to, className, ...handlers }: VisitRowProps) {
  const navigate = useNavigate();
  const v = visit;
  return (
    <tr
      className={clsx(styles.row, state === 'Hover' && styles.hover, to && styles.clickable, className)}
      onClick={to ? () => navigate(to) : undefined}
      {...handlers}
    >
      <td className={styles.td}>
        <span className={styles.cell}>
          <EvidencePhoto size="XS" image={v.image} crop={v.crop} alt={v.image ? `${v.id} camera frame` : ''} />
          <span className={styles.id}>{v.id}</span>
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.cell}>
          <span className={styles.text}>{v.gate}</span>
        </span>
      </td>
      <td className={styles.td}>
        <span className={clsx(styles.cell, styles.gap6)}>
          <Icon
            name={v.direction === 'Inward' ? 'arrow-down-left' : 'arrow-up-right'}
            size={14}
            color="var(--text-secondary)"
          />
          <span className={styles.text}>{v.direction}</span>
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.cell}>
          <span className={styles.text}>{v.time}</span>
        </span>
      </td>
      <td className={styles.td}>
        <span className={clsx(styles.cell, styles.gap8)}>
          <span className={clsx(styles.stepTime, styles.inspectionTime)}>{v.inspection.time}</span>
          <StatusChip status={v.inspection.result} />
        </span>
      </td>
      <td className={styles.td}>
        <span className={clsx(styles.cell, styles.gap8)}>
          <span className={clsx(styles.stepTime, styles.disinfectionTime)}>{v.disinfection.time}</span>
          <StatusChip status={v.disinfection.result} />
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.cell}>
          <EvidenceQuality quality={v.quality} />
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.cell}>
          <ReviewTag review={v.review} name={v.reviewName} initials={v.reviewInitials} />
        </span>
      </td>
      <td className={clsx(styles.td, styles.actionTd)}>
        <span className={clsx(styles.cell, styles.actionCell)}>
          <Button
            label={v.action}
            variant="Ghost"
            size="S"
            to={to}
            className={clsx(styles.action, v.action === 'View' && styles.view)}
            aria-label={`${v.action} ${v.id}`}
            onClick={(e) => e.stopPropagation()}
          />
        </span>
      </td>
    </tr>
  );
}
