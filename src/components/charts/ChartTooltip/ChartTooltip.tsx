import clsx from 'clsx';
import type { CSSProperties } from 'react';
import type { LegendSeries } from '@/components/ui/LegendItem';
import styles from './ChartTooltip.module.css';

/**
 * Figma "Chart tooltip" (51:418): dark floating card shown when a chart bar is hovered.
 * Title (Label/M) · one row per series (8px swatch, Body/XS label, Label/S count) · divider · cyan footer.
 */
export interface ChartTooltipRow {
  series: LegendSeries;
  value: number;
  /** Label override; defaults to the series name. */
  label?: string;
}

export interface ChartTooltipProps {
  title: string;
  rows: ChartTooltipRow[];
  /** Cyan call to action under the divider ("Click to see these 9 visits"). */
  footer?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

const SWATCH: Record<LegendSeries, string> = {
  Observed: styles.observed,
  Late: styles.late,
  'Not observed': styles.missing,
  'Needs review': styles.review,
};

export function ChartTooltip({ title, rows, footer, className, style, id }: ChartTooltipProps) {
  return (
    <div className={clsx(styles.tooltip, className)} style={style} role="tooltip" id={id}>
      <p className={styles.title}>{title}</p>
      {rows.map((r) => (
        <div key={r.series} className={styles.row}>
          <span className={clsx(styles.swatch, SWATCH[r.series])} aria-hidden="true" />
          <span className={styles.label}>{r.label ?? r.series}</span>
          <span className={styles.spacer} />
          <span className={styles.value}>{r.value}</span>
        </div>
      ))}
      {footer && (
        <>
          <span className={styles.divider} aria-hidden="true" />
          <p className={styles.footer}>{footer}</p>
        </>
      )}
    </div>
  );
}
