import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/icons';
import { VisitTable } from '@/components/data/VisitTable';
import { Panel } from '@/components/layout/Panel';
import { Filter } from '@/components/ui/Filter';
import { Tab } from '@/components/ui/Tab';
import { gateCopy, visitPath, type GateDashboardView } from '@/data/gate';
import styles from './VisitsTablePanel.module.css';

/**
 * Panel "Vehicle visits" (02: 58:432, 03: 70:3702): sort filter, quick-filter tabs, an optional hour filter chip
 * (03, links back to the whole day), the visits table and pagination. Tabs, sort and pagination do not navigate.
 */
export interface VisitsTablePanelProps {
  view: GateDashboardView;
  /** Where the hour chip × goes (the dashboard without the hour). */
  clearHourHref: string;
}

type VisitTab = 'all' | 'needsPerson' | 'closed' | 'noProblems';

export function VisitsTablePanel({ view, clearHourHref }: VisitsTablePanelProps) {
  const [tab, setTab] = useState<VisitTab>('all');
  const { tabs, rows, footer, pages, hourChip } = view.visits;
  const tabList: { key: VisitTab; label: string; count: number }[] = [
    { key: 'all', label: 'All visits', count: tabs.all },
    { key: 'needsPerson', label: 'Needs a person', count: tabs.needsPerson },
    { key: 'closed', label: 'Closed today', count: tabs.closed },
    { key: 'noProblems', label: 'No problems', count: tabs.noProblems },
  ];
  return (
    <Panel
      title="Vehicle visits"
      description={gateCopy.visitsDescription}
      actions={<Filter label="Sort" value={gateCopy.sort} icon="sliders" />}
      className={styles.panel}
      headerClassName={styles.header}
      gap={0}
    >
      <div className={styles.tabs} role="tablist" aria-label="Vehicle visits">
        {tabList.map((t) => (
          <Tab
            key={t.key}
            label={t.label}
            count={t.count}
            selected={tab === t.key}
            countTone={tab === t.key ? 'brand' : 'neutral'}
            onClick={() => setTab(t.key)}
          />
        ))}
      </div>
      {hourChip && (
        <div className={styles.activeFilters}>
          <span className={styles.filteredBy}>Filtered by</span>
          <Link to={clearHourHref} className={styles.chip} aria-label={`Remove filter ${hourChip}`}>
            <Icon name="clock" size={12} color="var(--text-brand)" />
            {hourChip}
            <Icon name="x" size={12} color="var(--text-brand)" />
          </Link>
        </div>
      )}
      <VisitTable
        caption="Vehicle visits"
        restingIndex={0}
        rows={rows.map((r) => ({
          visit: {
            id: r.id,
            image: r.image,
            gate: r.gate,
            direction: r.direction,
            time: r.time,
            inspection: r.inspection,
            disinfection: r.disinfection,
            quality: r.quality,
            review: r.review,
            reviewName: r.reviewName,
            reviewInitials: r.reviewInitials,
            action: r.action,
          },
          to: r.linked ? visitPath(r.id) : undefined,
        }))}
      />
      <div className={styles.footer}>
        <span className={styles.showing}>{footer}</span>
        <span className={styles.spacer} />
        <nav className={styles.pagination} aria-label="Pages">
          <button type="button" className={clsx(styles.pageButton, styles.pageArrow)} aria-label="Previous page">
            <Icon name="chevron-left" size={18} />
          </button>
          {pages.map((p, i) =>
            p === '…' ? (
              <span key={`gap-${i}`} className={styles.page} aria-hidden="true">
                {p}
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={clsx(styles.page, styles.pageButton, i === 0 && styles.current)}
                aria-current={i === 0 ? 'page' : undefined}
              >
                {p}
              </button>
            ),
          )}
          <button type="button" className={clsx(styles.pageButton, styles.pageArrow)} aria-label="Next page">
            <Icon name="chevron-right" size={18} />
          </button>
        </nav>
      </div>
    </Panel>
  );
}
