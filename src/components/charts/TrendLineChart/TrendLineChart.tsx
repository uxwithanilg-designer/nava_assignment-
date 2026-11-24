import clsx from 'clsx';
import { useLayoutEffect, useRef, useState } from 'react';
import styles from './TrendLineChart.module.css';

/**
 * TrendLineChart: the 3-line, 7-day chart on 01 (Figma "Chart · 7-day trend", 72:4789, 644×240).
 * Geometry copied from Figma: value axis 0 at y=216 and the top tick at y=8; the first point at x=36 and
 * the last 22px from the right edge; grid lines from x=28 to 14px from the right; y labels right-aligned
 * at x=20; x labels centred under each point at y=223. Each line ends in a dot (r 3.5 + 2px white ring)
 * with its value label 9px to the right. Width follows the container so the chart stays fluid;
 * at 1440 it renders at the Figma width.
 */
export interface TrendSeries {
  id: string;
  label: string;
  values: number[];
  /** Line, dot and legend colour (a token). */
  color: string;
  /** End-value label colour (a token). Defaults to `color`. */
  labelColor?: string;
  strokeWidth?: number;
}

export interface TrendLineChartProps {
  series: TrendSeries[];
  /** One label per point, oldest first. The last one ("Today") is drawn in text/primary. */
  xLabels: string[];
  /** Value ticks, lowest first; the last one is the top of the axis. */
  yTicks: number[];
  /** Show the legend row above the plot (Figma: 16px above the chart). */
  showLegend?: boolean;
  height?: number;
  className?: string;
  'aria-label'?: string;
}

/* Figma geometry (px). */
const FIGMA_WIDTH = 644;
const PLOT_TOP = 8;
const BASELINE_FROM_BOTTOM = 24; // 240 - 216
const FIRST_X = 36;
const LAST_X_FROM_RIGHT = 22;
const GRID_LEFT = 28;
const GRID_RIGHT_GAP = 14;
const Y_LABEL_RIGHT = 20;
const X_LABEL_GAP = 7; // 223 - 216
const END_LABEL_GAP = 9;

export function TrendLineChart({
  series,
  xLabels,
  yTicks,
  showLegend = true,
  height = 240,
  className,
  ...rest
}: TrendLineChartProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(FIGMA_WIDTH);

  useLayoutEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const update = () => setWidth(el.getBoundingClientRect().width || FIGMA_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const baseline = height - BASELINE_FROM_BOTTOM;
  const maxValue = yTicks[yTicks.length - 1] || 1;
  const minValue = yTicks[0] ?? 0;
  const y = (v: number) => baseline - ((v - minValue) / (maxValue - minValue)) * (baseline - PLOT_TOP);
  const steps = Math.max(xLabels.length - 1, 1);
  const lastX = width - LAST_X_FROM_RIGHT;
  const x = (i: number) => FIRST_X + (i * (lastX - FIRST_X)) / steps;

  const summary =
    rest['aria-label'] ??
    series.map((s) => `${s.label}: ${s.values.map((v, i) => `${xLabels[i]} ${v}`).join(', ')}`).join('. ');

  return (
    <div className={clsx(styles.chart, className)}>
      {showLegend && (
        <ul className={styles.legend}>
          {series.map((s) => (
            <li key={s.id} className={styles.legendItem}>
              <span className={styles.legendSwatch} style={{ background: s.color }} aria-hidden="true" />
              {s.label}
            </li>
          ))}
        </ul>
      )}
      <div ref={plotRef} className={styles.plot} style={{ height }} role="img" aria-label={summary}>
        <svg className={styles.svg} width={width} height={height} aria-hidden="true">
          {yTicks.map((t, i) => (
            <rect
              key={t}
              x={GRID_LEFT}
              y={y(t)}
              width={width - GRID_RIGHT_GAP - GRID_LEFT}
              height={1}
              className={i === 0 ? styles.axis : styles.grid}
            />
          ))}
          {series.map((s) => (
            <polyline
              key={s.id}
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
              fill="none"
              stroke={s.color}
              strokeWidth={s.strokeWidth ?? 2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {series.map((s) => {
            const last = s.values.length - 1;
            return (
              <circle
                key={s.id}
                cx={x(last)}
                cy={y(s.values[last])}
                r={3.5}
                fill={s.color}
                className={styles.endDot}
              />
            );
          })}
        </svg>
        {yTicks.map((t) => (
          <span key={t} className={styles.yLabel} style={{ top: y(t), right: width - Y_LABEL_RIGHT }}>
            {t}
          </span>
        ))}
        {xLabels.map((label, i) => (
          <span
            key={label}
            className={clsx(styles.xLabel, i === xLabels.length - 1 && styles.xLabelCurrent)}
            style={{ left: x(i), top: baseline + X_LABEL_GAP }}
          >
            {label}
          </span>
        ))}
        {series.map((s) => {
          const last = s.values.length - 1;
          return (
            <span
              key={s.id}
              className={styles.endLabel}
              style={{ left: x(last) + END_LABEL_GAP, top: y(s.values[last]), color: s.labelColor ?? s.color }}
            >
              {s.values[last]}
            </span>
          );
        })}
      </div>
    </div>
  );
}
