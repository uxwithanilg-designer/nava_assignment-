import clsx from 'clsx';
import styles from './LegendItem.module.css';

/** Figma "Legend item" (48:283): 10px swatch (radius 3) + Body/XS label. */
export type LegendSeries = 'Observed' | 'Late' | 'Not observed' | 'Needs review';

const SWATCH: Record<LegendSeries, string> = {
  Observed: 'var(--chart-observed)',
  Late: 'var(--chart-late)',
  'Not observed': 'var(--chart-missing)',
  'Needs review': 'var(--chart-review)',
};

export interface LegendItemProps {
  series: LegendSeries;
  /** Optional label override (Figma uses the series name). */
  label?: string;
  className?: string;
}

export function LegendItem({ series, label, className }: LegendItemProps) {
  return (
    <span className={clsx(styles.item, className)}>
      <span className={styles.swatch} style={{ background: SWATCH[series] }} aria-hidden="true" />
      <span>{label ?? series}</span>
    </span>
  );
}
