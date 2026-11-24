import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/icons';
import styles from './StatusChip.module.css';

/**
 * Figma "Status chip" (48:212) — the step-result family.
 * Violet ("Needs review") always means "could not judge"; it is never counted as "Not observed".
 * Slate (Low visibility / Camera blocked) is a camera problem, never a violation.
 */
export type ChipStatus =
  | 'Observed'
  | 'Not observed'
  | 'Late'
  | 'Needs review'
  | 'Low visibility'
  | 'Camera blocked'
  | 'Not required'
  | 'Phase 2';

const CHIP: Record<ChipStatus, { icon: IconName; tone: string }> = {
  Observed: { icon: 'check-circle', tone: 'observed' },
  'Not observed': { icon: 'x-circle', tone: 'missing' },
  Late: { icon: 'clock', tone: 'late' },
  'Needs review': { icon: 'eye', tone: 'review' },
  'Low visibility': { icon: 'eye-off', tone: 'obstructed' },
  'Camera blocked': { icon: 'camera-off', tone: 'obstructed' },
  'Not required': { icon: 'minus', tone: 'notRequired' },
  'Phase 2': { icon: 'lock', tone: 'phase2' },
};

export interface StatusChipProps {
  status: ChipStatus;
  /** Override the text when Figma shows a longer label, e.g. "Needs review · camera blocked". */
  label?: ReactNode;
  /** Override the icon when a Figma instance swaps it. */
  icon?: IconName;
  className?: string;
}

export function StatusChip({ status, label, icon, className }: StatusChipProps) {
  const chip = CHIP[status];
  return (
    <span className={clsx(styles.chip, styles[chip.tone], className)}>
      <Icon name={icon ?? chip.icon} size={12} className={styles.icon} />
      <span className={styles.label}>{label ?? status}</span>
    </span>
  );
}
