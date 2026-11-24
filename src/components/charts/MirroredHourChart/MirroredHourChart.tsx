import clsx from 'clsx';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/icons';
import { ChartTooltip, type ChartTooltipRow } from '@/components/charts/ChartTooltip';
import type { OutcomeStack } from '@/types/domain';
import styles from './MirroredHourChart.module.css';

/**
 * MirroredHourChart: Figma "Chart · in and out by hour" (60:306 on 02, 90:7094 on 02b, 70:3527 on 03).
 * Stacked bars per hour: inward above the time line, outward below it. Segments from the time line out:
 * Observed · Late · Not observed · Needs review (violet = could not judge, never counted as not observed).
 * Geometry is the Figma frame: 329px tall, inward base line at 149.5, outward base line at 179.5,
 * 14.55px per visit, 24px bars centred in equal hour columns, 2px between segments.
 * Hovering a bar shows the Chart tooltip; each column links to that hour's view.
 */
export interface HourStacks {
  /** "06" … "14" */
  hour: string;
  inward: OutcomeStack;
  outward?: OutcomeStack;
}

export interface MirroredHourChartProps {
  data: HourStacks[];
  /** Highlight this hour (accent column, brand label) and dim the others (03). */
  selectedHour?: string;
  /** When set, the outward half shows this note instead of bars (02b: disinfection is inward only). */
  outwardNote?: ReactNode;
  /** Prototype link for a column. */
  hrefForHour?: (hour: string) => string;
  /** Pixels per visit. */
  unit?: number;
  /** Grid lines / axis labels, in visits. */
  ticks?: number[];
  className?: string;
  'aria-label'?: string;
}

const HEIGHT = 329;
const IN_BASE = 149.5;
const OUT_BASE = 179.5;
const AXIS_LEFT = 28;
const GAP = 2;

const SERIES: { key: keyof OutcomeStack; series: ChartTooltipRow['series']; cls: string }[] = [
  { key: 'observed', series: 'Observed', cls: styles.observed },
  { key: 'late', series: 'Late', cls: styles.late },
  { key: 'notObserved', series: 'Not observed', cls: styles.missing },
  { key: 'needsReview', series: 'Needs review', cls: styles.review },
];

const total = (s: OutcomeStack) => s.observed + s.late + s.notObserved + s.needsReview;
const hourRange = (hour: string) => `${hour}:00–${String(Number(hour) + 1).padStart(2, '0')}:00`;

/** Segment heights: the base segment is n × unit, every next one gives 2px to the gap before it. */
function segments(stack: OutcomeStack, unit: number) {
  return SERIES.filter((s) => stack[s.key] > 0).map((s, i) => ({
    ...s,
    height: stack[s.key] * unit - (i === 0 ? 0 : GAP),
  }));
}

type Hover = { index: number; dir: 'inward' | 'outward' } | null;

export function MirroredHourChart({
  data,
  selectedHour,
  outwardNote,
  hrefForHour,
  unit = 14.55,
  ticks = [5, 10],
  className,
  ...rest
}: MirroredHourChartProps) {
  const [hover, setHover] = useState<Hover>(null);
  const n = data.length;
  const showOutward = !outwardNote;

  const tooltip = (() => {
    if (!hover) return null;
    const bucket = data[hover.index];
    const stack = hover.dir === 'inward' ? bucket.inward : bucket.outward;
    if (!stack || total(stack) === 0) return null;
    const rows = SERIES.filter((s) => stack[s.key] > 0).map((s) => ({ series: s.series, value: stack[s.key] }));
    const flip = hover.index >= n - 3;
    const center = `calc(${AXIS_LEFT}px + (100% - ${AXIS_LEFT}px) * ${(hover.index + 0.5) / n})`;
    const top = hover.dir === 'inward' ? Math.max(IN_BASE - total(stack) * unit, 0) : OUT_BASE;
    const style: CSSProperties = {
      top,
      left: flip ? `calc(${center} - 20px)` : `calc(${center} + 20px)`,
      transform: flip ? 'translateX(-100%)' : undefined,
    };
    return (
      <ChartTooltip
        className={styles.tooltip}
        style={style}
        title={`${hourRange(bucket.hour)} · ${hover.dir === 'inward' ? 'Inward' : 'Outward'}`}
        rows={rows}
        footer={`Click to see these ${total(stack)} visits`}
      />
    );
  })();

  return (
    <div className={clsx(styles.body, className)}>
      <div className={styles.side} aria-hidden="true">
        <span className={styles.sideLabel}>
          <Icon name="arrow-down-left" size={14} color="var(--text-secondary)" />
          Inward
        </span>
        <span className={styles.sideLabel}>
          <Icon name="arrow-up-right" size={14} color="var(--text-secondary)" />
          Outward
        </span>
      </div>
      <div
        className={styles.chart}
        style={{ height: HEIGHT }}
        role="group"
        aria-label={rest['aria-label'] ?? 'Visits per hour, inward above the time line and outward below'}
      >
        {ticks.map((t) => (
          <Grid key={`in-${t}`} y={IN_BASE - t * unit} label={t} />
        ))}
        {showOutward && ticks.map((t) => <Grid key={`out-${t}`} y={OUT_BASE + t * unit} label={t} />)}

        {outwardNote && (
          <div className={styles.outwardNote} style={{ top: OUT_BASE + 6, left: AXIS_LEFT }}>
            {outwardNote}
          </div>
        )}

        <div className={styles.columns} style={{ left: AXIS_LEFT, gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {data.map((b, i) => {
            const selected = selectedHour === b.hour;
            const dim = selectedHour !== undefined && !selected;
            const inSegs = segments(b.inward, unit);
            const outSegs = showOutward && b.outward ? segments(b.outward, unit) : [];
            const label = `${hourRange(b.hour)}: ${total(b.inward)} inward${
              showOutward && b.outward ? `, ${total(b.outward)} outward` : ''
            }`;
            const zones = (
              <>
                <span
                  className={styles.zone}
                  style={{ top: 0, height: (IN_BASE + OUT_BASE) / 2 }}
                  onMouseEnter={() => setHover({ index: i, dir: 'inward' })}
                />
                {showOutward && (
                  <span
                    className={styles.zone}
                    style={{ top: (IN_BASE + OUT_BASE) / 2, bottom: 0 }}
                    onMouseEnter={() => setHover({ index: i, dir: 'outward' })}
                  />
                )}
              </>
            );
            return (
              <div key={b.hour} className={clsx(styles.column, dim && styles.dim)}>
                {selected && <span className={styles.selectedBg} aria-hidden="true" />}
                <span className={styles.stackIn} style={{ bottom: HEIGHT - IN_BASE }} aria-hidden="true">
                  {inSegs.map((s) => (
                    <span key={s.key} className={clsx(styles.seg, s.cls)} style={{ height: s.height }} />
                  ))}
                </span>
                <span className={clsx(styles.hourLabel, selected && styles.hourSelected)} aria-hidden="true">
                  {b.hour}:00
                </span>
                {outSegs.length > 0 && (
                  <span className={styles.stackOut} style={{ top: OUT_BASE }} aria-hidden="true">
                    {outSegs.map((s) => (
                      <span key={s.key} className={clsx(styles.seg, s.cls)} style={{ height: s.height }} />
                    ))}
                  </span>
                )}
                {hrefForHour ? (
                  <Link
                    to={hrefForHour(b.hour)}
                    className={styles.hit}
                    aria-label={label}
                    aria-current={selected ? 'true' : undefined}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover({ index: i, dir: 'inward' })}
                    onBlur={() => setHover(null)}
                  >
                    {zones}
                  </Link>
                ) : (
                  <span className={styles.hit} aria-label={label} role="img" onMouseLeave={() => setHover(null)}>
                    {zones}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {tooltip}
      </div>
    </div>
  );
}

function Grid({ y, label }: { y: number; label: number }) {
  return (
    <>
      <span className={styles.grid} style={{ top: y, left: AXIS_LEFT }} aria-hidden="true" />
      <span className={styles.yLabel} style={{ top: y - 8.5 }} aria-hidden="true">
        {label}
      </span>
    </>
  );
}
