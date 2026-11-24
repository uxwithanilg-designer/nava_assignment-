import clsx from 'clsx';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoverageBar } from '@/components/charts/CoverageBar';
import { Panel } from '@/components/layout/Panel';
import { Button } from '@/components/ui/Button';
import { compareFacilities, coverageInput, facilities, type FacilitySummary, type StepCounts } from '@/data/overview';
import { getCoverageDisplay } from '@/lib/coverage';
import styles from './CompareFacilitiesPanel.module.css';

/**
 * Panel "Compare facilities" (72:4638): Gate data per unit. A row with a Gate dashboard in the
 * prototype (Unit 3) opens it on click; its "Open" is the keyboard-reachable link. The other rows
 * have the hover state and a non-navigating "Open" button.
 */
function CoverageCell({ counts }: { counts: StepCounts }) {
  const display = getCoverageDisplay(coverageInput(counts));
  return (
    <div className={styles.coverage}>
      <CoverageBar
        className={styles.bar}
        height={6}
        observed={counts.observed}
        late={counts.late}
        notObserved={counts.notObserved}
        notJudged={counts.notJudged}
      />
      {display.kind === 'percent' ? (
        <span className={styles.percent}>{display.label}</span>
      ) : (
        <span className={styles.hidden}>% hidden</span>
      )}
    </div>
  );
}

function FacilityRow({ facility: f }: { facility: FacilitySummary }) {
  const navigate = useNavigate();
  const attention = Boolean(f.review.waitingOver24h);
  const onRowClick = (e: MouseEvent<HTMLTableRowElement>) => {
    if (!f.to || (e.target as HTMLElement).closest('a, button')) return;
    navigate(f.to);
  };
  return (
    <tr className={clsx(styles.row, f.to && styles.linked)} onClick={onRowClick}>
      <td className={styles.first}>
        <div className={styles.facility}>
          <span className={styles.unitName}>{f.name}</span>
          <span className={styles.gates}>{f.gates}</span>
        </div>
      </td>
      <td className={styles.visits}>
        {f.inward} · {f.outward}
      </td>
      <td>
        <CoverageCell counts={f.inwardInspection} />
      </td>
      <td>
        <CoverageCell counts={f.entryDisinfection} />
      </td>
      <td>
        <CoverageCell counts={f.outwardInspection} />
      </td>
      <td>
        <div className={styles.review}>
          <span className={styles.open}>{f.review.open} open</span>
          <span className={clsx(styles.note, attention && styles.attention)}>{f.review.noOwner} no owner</span>
          {f.review.waitingOver24h !== undefined && (
            <span className={clsx(styles.note, styles.attention)}>{f.review.waitingOver24h} waiting over 24 h</span>
          )}
        </div>
      </td>
      <td>
        <div className={clsx(styles.cameras, f.cameras.partial && styles.partial)}>
          <span className={styles.dot} aria-hidden="true" />
          {/* No-break spaces keep "5 live" and "1 partial" together when a narrow column wraps. */}
          <span>
            {f.cameras.live}&nbsp;live{f.cameras.partial ? ` · ${f.cameras.partial}\u00a0partial` : ''}
          </span>
        </div>
      </td>
      <td className={styles.last}>
        <Button label="Open" variant="Ghost" size="S" to={f.to} aria-label={`Open ${f.name}`} />
      </td>
    </tr>
  );
}

export function CompareFacilitiesPanel() {
  return (
    <Panel
      title={compareFacilities.title}
      description={compareFacilities.description}
      gap={14}
      className={styles.panel}
      headerClassName={styles.header}
    >
      <table className={styles.table}>
        <colgroup>
          <col className={styles.colFacility} />
          <col className={styles.colVisits} />
          <col className={styles.colCoverage} />
          <col className={styles.colCoverage} />
          <col className={styles.colCoverage} />
          <col className={styles.colReview} />
          <col className={styles.colCameras} />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={styles.first}>
              Facility
            </th>
            <th scope="col">Visits in · out</th>
            <th scope="col">Inward inspection</th>
            <th scope="col">Entry disinfection</th>
            <th scope="col">Outward inspection</th>
            <th scope="col">Needs review</th>
            <th scope="col">Cameras</th>
            <th scope="col" className={styles.last}>
              <span className="visually-hidden">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((f) => (
            <FacilityRow key={f.unitId} facility={f} />
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
