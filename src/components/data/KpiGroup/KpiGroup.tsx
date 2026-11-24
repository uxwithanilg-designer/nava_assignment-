import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import styles from './KpiGroup.module.css';

/**
 * KpiGroup: a Label/S group name followed by a 1px rule, above a row of KPI cards
 * (Figma "Group · Vehicle movement": label row 14px high, rule fills the rest).
 */
export interface KpiGroupProps {
  label: string;
  children: ReactNode;
  /** Gap between the label row and the cards. */
  gap?: number;
  /** Gap between cards. */
  cardGap?: number;
  className?: string;
  style?: CSSProperties;
}

export function KpiGroup({ label, children, gap = 12, cardGap = 12, className, style }: KpiGroupProps) {
  return (
    <section className={clsx(styles.group, className)} style={{ gap, ...style }} aria-label={label}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.rule} aria-hidden="true" />
      </div>
      <div className={styles.cards} style={{ gap: cardGap }}>
        {children}
      </div>
    </section>
  );
}
