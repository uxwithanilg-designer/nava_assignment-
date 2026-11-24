import clsx from 'clsx';
import styles from './MiniBars.module.css';

/**
 * MiniBars: the small bar sparkline inside "Count" KPI cards (Figma "Spark", 164×30, gap 3).
 * `values` are visit counts per hour; bars scale to the tallest one.
 */
export interface MiniBarsProps {
  values: number[];
  width?: number;
  height?: number;
  /** Index of a highlighted bar (others dim), used when one hour is selected. */
  highlight?: number;
  /** Bar colour (a token). Defaults to chart/1; outward cards use chart/2. */
  color?: string;
  className?: string;
  'aria-label'?: string;
}

export function MiniBars({ values, width = 164, height = 30, highlight, color, className, ...rest }: MiniBarsProps) {
  const max = Math.max(...values, 1);
  return (
    <div
      className={clsx(styles.bars, className)}
      style={{ width, height }}
      role="img"
      aria-label={rest['aria-label'] ?? `Visits by hour: ${values.join(', ')}`}
    >
      {values.map((v, i) => (
        <span
          key={i}
          className={clsx(styles.bar, highlight !== undefined && i !== highlight && styles.dim)}
          style={{ height: (v / max) * height, background: color }}
        />
      ))}
    </div>
  );
}
