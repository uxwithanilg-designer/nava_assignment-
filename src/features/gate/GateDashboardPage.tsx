import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { FilterBar } from '@/components/layout/FilterBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Filter } from '@/components/ui/Filter';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { gateCopy, getGateDashboard, visitPath } from '@/data/gate';
import { gateHref, type HourChartKind } from './gateLinks';
import { KpiStrip } from './sections/KpiStrip/KpiStrip';
import { NeedsAttentionPanel } from './sections/NeedsAttentionPanel/NeedsAttentionPanel';
import { ResultsByGate } from './sections/ResultsByGate/ResultsByGate';
import { ResultsByHour } from './sections/ResultsByHour/ResultsByHour';
import { VisitsTablePanel } from './sections/VisitsTablePanel/VisitsTablePanel';
import styles from './GateDashboardPage.module.css';

/**
 * GV-01 Gate dashboard for Unit 3.
 *   /gate                     → 02 (54:296), the main screen
 *   /gate?chart=disinfection  → 02b (90:6507), "Results by hour" shows entry disinfection
 *   /gate?hour=07             → 03 (70:3453), drilled down to one hour (any hour 06–14 works)
 */
type DirectionFilter = 'All' | 'Inward' | 'Outward';

const DIRECTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Inward', label: 'Inward' },
  { value: 'Outward', label: 'Outward' },
] as const;

export function GateDashboardPage() {
  const [params] = useSearchParams();
  const view = getGateDashboard(params.get('hour'));
  const chart: HourChartKind = params.get('chart') === 'disinfection' ? 'disinfection' : 'inspection';
  const [direction, setDirection] = useState<DirectionFilter>('All');
  const viewKey = view.hour ?? 'day';

  return (
    <AppShell active="GateView" breadcrumb={[...gateCopy.breadcrumb]} contentTop={28}>
      <PageHeader
        title={gateCopy.title}
        updated={gateCopy.updated}
        subtitle={`${gateCopy.subtitlePrefix}${view.subtitleRange}`}
        height={100}
        actions={
          <>
            <Button variant="Secondary" icon="download" label="Export" />
            <Button variant="Primary" icon="list" label="Open review list" to={visitPath('TV-0412')} />
          </>
        }
      />
      <FilterBar actions={<Button variant="Ghost" size="S" label="Reset filters" />}>
        <Filter label="Facility" value={gateCopy.facility} icon="map-pin" state="Changed" />
        <Filter label="Gate" value={gateCopy.gate} icon="gate" />
        <Filter
          label="Date"
          value={view.filters.date}
          icon="calendar"
          state={view.filters.dateChanged ? 'Changed' : 'Default'}
        />
        <SegmentedControl aria-label="Direction" options={DIRECTIONS} value={direction} onChange={setDirection} />
        <Filter label="Use case" value={view.filters.useCase} icon="filter" />
      </FilterBar>
      <KpiStrip view={view} />
      <div className={styles.hourRow}>
        <ResultsByHour view={view} chart={chart} />
        <NeedsAttentionPanel key={viewKey} view={view} />
      </div>
      <ResultsByGate view={view} />
      <VisitsTablePanel key={viewKey} view={view} clearHourHref={gateHref({ chart })} />
    </AppShell>
  );
}
