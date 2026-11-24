import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Filter } from '@/components/ui/Filter';
import { overviewFilters, overviewHeader } from '@/data/overview';
import { CompareFacilitiesPanel } from './CompareFacilitiesPanel';
import { ModulesRow } from './ModulesRow';
import { NeedsPersonTrendPanel } from './NeedsPersonTrendPanel';
import { OverviewKpiStrip } from './OverviewKpiStrip';
import { WaitingLongestPanel } from './WaitingLongestPanel';
import styles from './OverviewPage.module.css';

/**
 * 01 · Management overview (Figma 72:4249) · /overview.
 * All modules today with Gate details for the 3 units. Flow "Management view to one unit" starts here:
 * the Unit 3 row, its "Open" and "Open GateView" go to the Gate dashboard; TV-0412 opens the visit.
 */
export function OverviewPage() {
  return (
    <AppShell active="Overview" breadcrumb={overviewHeader.breadcrumb} topBar={{ plainCurrent: true }}>
      <PageHeader
        className={styles.header}
        title={overviewHeader.title}
        updated={overviewHeader.updated}
        subtitle={overviewHeader.subtitle}
        actions={<Button label="Export" variant="Secondary" icon="download" />}
      />
      <div className={styles.filters}>
        {overviewFilters.map((f) => (
          <Filter key={f.label} label={f.label} value={f.value} icon={f.icon} />
        ))}
      </div>
      <ModulesRow />
      <OverviewKpiStrip />
      <CompareFacilitiesPanel />
      <div className={styles.row}>
        <NeedsPersonTrendPanel />
        <WaitingLongestPanel />
      </div>
    </AppShell>
  );
}
