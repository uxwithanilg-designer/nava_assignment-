import clsx from 'clsx';
import { Icon, type IconName } from '@/components/icons';
import styles from './EvidenceQuality.module.css';

/**
 * Figma "Evidence quality" (48:263) — the evidence-quality family.
 * A camera problem (Low visibility, Camera blocked) is never a violation.
 */
export type Quality = 'Good' | 'Partial' | 'Low visibility' | 'Camera blocked';

const Q: Record<Quality, { icon: IconName; tone: string }> = {
  Good: { icon: 'check', tone: 'good' },
  Partial: { icon: 'eye', tone: 'partial' },
  'Low visibility': { icon: 'eye-off', tone: 'obstructed' },
  'Camera blocked': { icon: 'camera-off', tone: 'obstructed' },
};

export interface EvidenceQualityProps {
  quality: Quality;
  className?: string;
}

export function EvidenceQuality({ quality, className }: EvidenceQualityProps) {
  const q = Q[quality];
  return (
    <span className={clsx(styles.quality, styles[q.tone], className)}>
      <Icon name={q.icon} size={14} className={styles.icon} />
      <span>{quality}</span>
    </span>
  );
}
