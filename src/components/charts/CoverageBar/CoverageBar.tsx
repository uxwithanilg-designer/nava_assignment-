import clsx from 'clsx';
import styles from './CoverageBar.module.css';

/**
 * CoverageBar: thin segmented fraction bar (Figma "Fraction bar": 8px high, radius 4, 2px gap, chart/track).
 * Segments share the width left after the 2px gaps in proportion to their counts (as Figma sizes them);
 * a `total` larger than the sum leaves the rest of the track empty.
 * Violet ("not judged") is its own segment: never folded into "not observed".
 */
export interface CoverageSegments {
  observed: number;
  late?: number;
  notObserved?: number;
  notJudged?: number;
}

export interface CoverageBarProps extends CoverageSegments {
  /** Base for the proportions. Defaults to the sum of the segments. */
  total?: number;
  height?: number;
  className?: string;
}

export function CoverageBar({
  observed,
  late = 0,
  notObserved = 0,
  notJudged = 0,
  total,
  height = 8,
  className,
}: CoverageBarProps) {
  const sum = observed + late + notObserved + notJudged;
  const rest = total !== undefined ? Math.max(total - sum, 0) : 0;
  const parts = [
    { key: 'observed', n: observed, cls: styles.observed },
    { key: 'late', n: late, cls: styles.late },
    { key: 'notObserved', n: notObserved, cls: styles.missing },
    { key: 'notJudged', n: notJudged, cls: styles.review },
  ].filter((p) => p.n > 0);
  return (
    <div
      className={clsx(styles.track, className)}
      style={{ height, borderRadius: height / 2 }}
      role="img"
      aria-label={`${observed} observed, ${late} late, ${notObserved} not observed, ${notJudged} not judged`}
    >
      {parts.map((p) => (
        <span key={p.key} className={p.cls} style={{ flexGrow: p.n }} />
      ))}
      {rest > 0 && <span style={{ flexGrow: rest }} />}
    </div>
  );
}
