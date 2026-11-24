import { KpiCard } from '@/components/data/KpiCard';
import { KpiGroup } from '@/components/data/KpiGroup';
import type { IconName } from '@/components/icons';
import { getCoverageDisplay } from '@/lib/coverage';
import {
  HOURS,
  kpiSparks,
  stackCoverage,
  sumStacks,
  visitPath,
  type GateCheckKey,
  type GateDashboardView,
} from '@/data/gate';
import type { OutcomeStack } from '@/types/domain';
import styles from './KpiStrip.module.css';

/**
 * KPI strip (02: 81:5218, 03: 81:5356): Vehicle movement · Check coverage · Review.
 * Coverage cards switch between % and "% hidden" through getCoverageDisplay(): 02 shows 93% / 95% / hidden
 * (34 of 48 judged), 03 shows counts because the hour has fewer than 10 visits.
 */
export interface KpiStripProps {
  view: GateDashboardView;
}

export function KpiStrip({ view }: KpiStripProps) {
  const check = (key: GateCheckKey) => sumStacks(view.gates.map((g) => g.checks[key]));
  const inward = view.gates.reduce((n, g) => n + g.inward, 0);
  const outward = view.gates.reduce((n, g) => n + g.outward, 0);
  const hourIndex = view.hour ? HOURS.indexOf(view.hour as (typeof HOURS)[number]) : undefined;
  const { open, noOwner, owned } = view.review;

  return (
    <div className={styles.strip}>
      <KpiGroup label="Vehicle movement" gap={10}>
        <KpiCard
          type="Count"
          icon="arrow-down-left"
          label="Observed inward visits"
          value={String(inward)}
          unit="visits"
          badge={view.inward.badge ? { text: view.inward.badge } : undefined}
          spark={kpiSparks.inward}
          sparkHighlight={hourIndex}
          footnote={view.inward.footnote}
        />
        <KpiCard
          type="Count"
          icon="arrow-up-right"
          label="Observed outward visits"
          value={String(outward)}
          unit="visits"
          badge={view.outward.badge ? { text: view.outward.badge } : undefined}
          spark={kpiSparks.outward}
          sparkHighlight={hourIndex}
          sparkColor="var(--chart-2)"
          footnote={view.outward.footnote}
        />
      </KpiGroup>
      <KpiGroup label="Check coverage" gap={10}>
        <CoverageKpi
          label="Inward inspection coverage"
          icon="vest"
          stack={check('inwardInspection')}
          barWidths={view.kpiBarWidths?.inwardInspection}
          countUnit="inspected before entry"
        />
        <CoverageKpi
          label="Outward inspection coverage"
          icon="vest"
          stack={check('outwardInspection')}
          barWidths={view.kpiBarWidths?.outwardInspection}
          countUnit="inspected before exit"
        />
        <CoverageKpi
          label="Entry-disinfection coverage"
          icon="droplets"
          stack={check('entryDisinfection')}
          barWidths={view.kpiBarWidths?.entryDisinfection}
          countUnit="sprayed before entry"
        />
      </KpiGroup>
      <KpiGroup label="Review" gap={10}>
        <KpiCard
          type="Review"
          icon="eye"
          label="Visits needing review"
          value={String(open)}
          unit="open"
          badge={{ text: `${noOwner} no owner` }}
          caption={`${owned} already ${owned === 1 ? 'has an owner' : 'have an owner'}`}
          link={{ label: 'Open review list', to: visitPath('TV-0412') }}
        />
      </KpiGroup>
    </div>
  );
}

interface CoverageKpiProps {
  label: string;
  icon: IconName;
  stack: OutcomeStack;
  /** Unit after the count when the % is hidden. */
  countUnit: string;
  /** Figma's pinned bar widths (03). With them the bar also draws the not-judged segment, as Figma does. */
  barWidths?: readonly number[];
}

/** One coverage card. The bar shows the judged visits: observed · late · not observed. */
function CoverageKpi({ label, icon, stack, countUnit, barWidths }: CoverageKpiProps) {
  const display = getCoverageDisplay(stackCoverage(stack));
  const bar = barWidths
    ? {
        observed: stack.observed,
        late: stack.late,
        notObserved: stack.notObserved,
        notJudged: stack.needsReview,
        widths: barWidths,
      }
    : { observed: stack.observed, late: stack.late, notObserved: stack.notObserved };
  if (display.kind === 'hidden') {
    return (
      <KpiCard
        type="Coverage hidden"
        icon={icon}
        label={label}
        value={String(display.count)}
        unit={countUnit}
        badge={{ text: '% hidden' }}
        bar={bar}
        footnote={display.reasonText}
      />
    );
  }
  return (
    <KpiCard
      type="Coverage"
      icon={icon}
      label={label}
      value={display.label}
      caption={`${stack.observed} of ${display.judged} judged`}
      bar={bar}
      footnote={
        <>
          <span className={styles.notSeen}>{stack.notObserved + stack.late}</span> not seen ·{' '}
          <span className={styles.notJudged}>{stack.needsReview}</span> not judged
        </>
      }
    />
  );
}
