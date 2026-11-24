import { KpiCard } from '@/components/data/KpiCard';
import { KpiGroup } from '@/components/data/KpiGroup';
import type { CoverageSegments } from '@/components/charts/CoverageBar';
import type { IconName } from '@/components/icons';
import { coverageInput, judgedOf, overviewKpis, type StepCounts } from '@/data/overview';
import { getCoverageDisplay } from '@/lib/coverage';
import styles from './OverviewKpiStrip.module.css';

/**
 * KPI strip (81:5506): "Vehicle movement" · "Check coverage" · "Review" groups, all 3 units.
 * Coverage cards use getCoverageDisplay(); with this data all three show a % (95 / 96 / 92).
 */
function Breakdown({ counts, showLate }: { counts: StepCounts; showLate?: boolean }) {
  return (
    <>
      {showLate && (
        <>
          <b className={styles.late}>{counts.late}</b> late ·{' '}
        </>
      )}
      <b className={styles.missing}>{counts.notObserved}</b> not seen ·{' '}
      <b className={styles.review}>{counts.notJudged}</b> not judged
    </>
  );
}

interface CoverageKpiProps {
  label: string;
  icon: IconName;
  counts: StepCounts;
  bar: CoverageSegments;
  /** Count shown instead of the % when the base is not reliable. */
  hiddenUnit: string;
  showLate?: boolean;
}

function CoverageKpi({ label, icon, counts, bar, hiddenUnit, showLate }: CoverageKpiProps) {
  const display = getCoverageDisplay(coverageInput(counts));
  if (display.kind === 'hidden') {
    return (
      <KpiCard
        type="Coverage hidden"
        icon={icon}
        label={label}
        badge={{ text: '% hidden' }}
        value={String(display.count)}
        unit={hiddenUnit}
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
      caption={`${counts.observed} of ${judgedOf(counts)} judged`}
      bar={bar}
      footnote={<Breakdown counts={counts} showLate={showLate} />}
    />
  );
}

export function OverviewKpiStrip() {
  const k = overviewKpis;
  return (
    <div className={styles.strip}>
      <KpiGroup label="Vehicle movement" gap={10} className={`${styles.group} ${styles.span2}`}>
        <KpiCard
          type="Count"
          icon="arrow-down-left"
          label="Observed inward visits"
          badge={{ text: k.inward.delta }}
          value={String(k.inward.value)}
          unit="visits"
          spark={k.inward.spark}
          footnote={k.inward.footnote}
        />
        <KpiCard
          type="Count"
          icon="arrow-up-right"
          label="Observed outward visits"
          badge={{ text: k.outward.delta }}
          value={String(k.outward.value)}
          unit="visits"
          spark={k.outward.spark}
          sparkColor="var(--chart-2)"
          footnote={k.outward.footnote}
        />
      </KpiGroup>
      <KpiGroup label="Check coverage" gap={10} className={`${styles.group} ${styles.span3}`}>
        <CoverageKpi
          label="Inward inspection coverage"
          icon="vest"
          counts={k.inwardInspection}
          bar={k.bars.inwardInspection}
          hiddenUnit="inspected before entry"
        />
        <CoverageKpi
          label="Outward inspection coverage"
          icon="vest"
          counts={k.outwardInspection}
          bar={k.bars.outwardInspection}
          hiddenUnit="inspected before exit"
        />
        <CoverageKpi
          label="Entry-disinfection coverage"
          icon="droplets"
          counts={k.entryDisinfection}
          bar={k.bars.entryDisinfection}
          hiddenUnit="sprayed before entry"
          showLate
        />
      </KpiGroup>
      <KpiGroup label="Review" gap={10} className={`${styles.group} ${styles.span1}`}>
        <KpiCard
          type="Review"
          icon="eye"
          label="Visits needing review"
          badge={{ text: `${k.review.noOwner} no owner` }}
          value={String(k.review.open)}
          unit="open"
          caption={`${k.review.owned} already have an owner`}
          link={{ label: 'Open review list' }}
        />
      </KpiGroup>
    </div>
  );
}
