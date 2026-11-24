import clsx from 'clsx';
import { CoverageBar } from '@/components/charts/CoverageBar';
import { Icon, type IconName } from '@/components/icons';
import { Panel } from '@/components/layout/Panel';
import { Button } from '@/components/ui/Button';
import { LegendItem } from '@/components/ui/LegendItem';
import { getCoverageDisplay } from '@/lib/coverage';
import { stackCoverage, type GateCheckKey, type GateDashboardView, type GateResult } from '@/data/gate';
import type { OutcomeStack } from '@/types/domain';
import styles from './ResultsByGate.module.css';

/**
 * Panel "Results by gate" (02: 57:652, 03: 70:3595). One card per gate: camera health, the three checks
 * (inward inspection, entry disinfection, outward inspection) with a fraction bar, the AI-check status and a
 * camera note. Values follow getCoverageDisplay(): "93% 26 of 28", "% hidden 17 of 30", or "4 of 5 judged"
 * when a gate has fewer than 10 visits.
 */
export interface ResultsByGateProps {
  view: GateDashboardView;
}

const CHECKS: { key: GateCheckKey; label: string; icon: IconName }[] = [
  { key: 'inwardInspection', label: 'Inward inspection', icon: 'arrow-down-left' },
  { key: 'entryDisinfection', label: 'Entry disinfection', icon: 'droplets' },
  { key: 'outwardInspection', label: 'Outward inspection', icon: 'arrow-up-right' },
];

export function ResultsByGate({ view }: ResultsByGateProps) {
  return (
    <Panel
      title="Results by gate"
      description={view.gatesDescription}
      headerClassName={styles.header}
      actions={
        <div className={styles.legend}>
          <LegendItem series="Observed" />
          <LegendItem series="Late" />
          <LegendItem series="Not observed" />
          <LegendItem series="Needs review" />
        </div>
      }
    >
      <div className={styles.gates}>
        {view.gates.map((g) => (
          <GateCard key={g.id} gate={g} />
        ))}
      </div>
    </Panel>
  );
}

function GateCard({ gate }: { gate: GateResult }) {
  const partial = gate.health.tone === 'partial';
  return (
    <article className={styles.gate} aria-label={gate.name}>
      <div className={styles.gateHead}>
        <span className={styles.iconBox}>
          <Icon name="gate" size={18} color="var(--text-brand)" />
        </span>
        <span className={styles.gateText}>
          <h3 className={styles.gateName}>{gate.name}</h3>
          <span className={styles.gateMeta}>
            {gate.inward} in · {gate.outward} out · {gate.cameras} cameras
          </span>
        </span>
        <span className={styles.spacer} />
        <span className={clsx(styles.health, partial ? styles.healthPartial : styles.healthClear)}>
          <span className={styles.healthDot} aria-hidden="true" />
          {gate.health.label}
        </span>
      </div>
      {CHECKS.map((c) => (
        <CheckRow key={c.key} label={c.label} icon={c.icon} stack={gate.checks[c.key]} />
      ))}
      <p className={styles.ai}>
        <Icon
          name="shield-check"
          size={16}
          color={gate.aiStatus.tone === 'validated' ? 'var(--status-observed)' : 'var(--status-late)'}
        />
        <span className={styles.aiText}>
          <strong className={styles.strong}>AI checks:</strong> {gate.aiStatus.text}
        </span>
      </p>
      <div className={clsx(styles.note, gate.note.tone === 'warning' ? styles.noteWarning : styles.noteClear)}>
        <Icon
          name={gate.note.tone === 'warning' ? 'camera-off' : 'check-circle'}
          size={16}
          color={gate.note.tone === 'warning' ? 'var(--status-late-text)' : 'var(--status-observed)'}
        />
        <p className={styles.noteText}>{gate.note.text}</p>
        {gate.note.action && <Button variant="Ghost" size="S" label={gate.note.action} />}
      </div>
    </article>
  );
}

function CheckRow({ label, icon, stack }: { label: string; icon: IconName; stack: OutcomeStack }) {
  const coverage = stackCoverage(stack);
  const display = getCoverageDisplay(coverage);
  return (
    <div className={styles.check}>
      <span className={styles.checkLabel}>
        <Icon name={icon} size={16} color="var(--text-secondary)" />
        {label}
      </span>
      <CoverageBar
        className={styles.bar}
        height={10}
        observed={stack.observed}
        late={stack.late}
        notObserved={stack.notObserved}
        notJudged={stack.needsReview}
      />
      <span className={styles.value}>
        {display.kind === 'percent' && (
          <>
            <span className={styles.number}>{display.label}</span>
            <span className={styles.of}>
              {stack.observed} of {display.judged}
            </span>
          </>
        )}
        {display.kind === 'hidden' && display.reason === 'low-judged' && (
          <>
            <span className={styles.hidden}>% hidden</span>
            <span className={styles.of}>
              {coverage.judged} of {coverage.total}
            </span>
          </>
        )}
        {display.kind === 'hidden' && display.reason === 'few-visits' && (
          <>
            <span className={styles.number}>
              {stack.observed} of {coverage.judged}
            </span>
            <span className={styles.of}>judged</span>
          </>
        )}
      </span>
    </div>
  );
}
