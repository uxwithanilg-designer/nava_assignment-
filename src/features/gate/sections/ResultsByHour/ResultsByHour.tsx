import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/icons';
import { MirroredHourChart } from '@/components/charts/MirroredHourChart';
import { Panel } from '@/components/layout/Panel';
import { LegendItem } from '@/components/ui/LegendItem';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
  disinfectionByHour,
  gateCopy,
  hourChartFooters,
  hourRange,
  inspectionByHour,
  stackTotal,
  type GateDashboardView,
} from '@/data/gate';
import { gateHref, type HourChartKind } from '../../gateLinks';
import styles from './ResultsByHour.module.css';

/**
 * Panel "Results by hour" (02: 57:433, 02b: 90:6555, 03: 70:3503).
 * Inspection: mirrored inward/outward bars. Disinfection: inward bars only, outward side explains why.
 * On an hour view the selected column is highlighted and a "Showing …" pill returns to the whole day.
 */
export interface ResultsByHourProps {
  view: GateDashboardView;
  chart: HourChartKind;
}

const CHART_OPTIONS = [
  { value: 'inspection', label: 'Inspection' },
  { value: 'disinfection', label: 'Disinfection' },
] as const;

export function ResultsByHour({ view, chart }: ResultsByHourProps) {
  const navigate = useNavigate();
  const disinfection = chart === 'disinfection';
  const bucket = view.hour ? inspectionByHour.find((b) => b.hour === view.hour) : undefined;
  const footer = disinfection ? hourChartFooters.mostUnclearSpray : hourChartFooters.busiest;

  return (
    <Panel
      title="Results by hour"
      description={disinfection ? gateCopy.hourChart.disinfection : gateCopy.hourChart.inspection}
      actions={
        <SegmentedControl
          aria-label="Check shown in the chart"
          options={CHART_OPTIONS}
          value={chart}
          onChange={(c) => navigate(gateHref({ hour: view.hour, chart: c }))}
        />
      }
    >
      <div className={styles.legendRow}>
        <div className={styles.legend}>
          <LegendItem series="Observed" />
          <LegendItem series="Late" />
          <LegendItem series="Not observed" />
          <LegendItem series="Needs review" />
        </div>
        <span className={styles.spacer} />
        {bucket ? (
          <Link to={gateHref({ chart })} className={styles.hourPill} aria-label="Show the whole day">
            Showing {hourRange(bucket.hour)} · {stackTotal(bucket.inward) + stackTotal(bucket.outward)} visits
            <Icon name="x" size={12} color="var(--text-brand)" />
          </Link>
        ) : (
          <span className={styles.unit}>Visits per hour</span>
        )}
      </div>
      <MirroredHourChart
        data={disinfection ? disinfectionByHour : inspectionByHour}
        selectedHour={view.hour}
        hrefForHour={(hour) => gateHref({ hour, chart })}
        outwardNote={
          disinfection ? (
            <span className={styles.outwardNote}>
              <Icon name="droplets" size={16} color="var(--text-tertiary)" />
              {gateCopy.hourChart.outwardNote}
            </span>
          ) : undefined
        }
      />
      <div className={styles.footer}>
        <Icon name="clock" size={14} color="var(--text-tertiary)" />
        <p className={styles.footerText}>
          {disinfection ? 'Most unclear spray checks: ' : 'Busiest hour: '}
          <strong className={styles.strong}>{footer.range}</strong>
          {disinfection ? `, ${footer.visits} visits` : `, with ${footer.visits} visits`}
        </p>
        <span className={styles.spacer} />
        <span className={styles.violet}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.violetNote}>
            {disinfection ? gateCopy.hourChart.violetDisinfection : gateCopy.hourChart.violetInspection}
          </span>
        </span>
      </div>
    </Panel>
  );
}
