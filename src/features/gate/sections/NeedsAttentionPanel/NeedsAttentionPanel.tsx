import { useState } from 'react';
import { NeedsAttentionList } from '@/components/data/NeedsAttentionList';
import { Panel } from '@/components/layout/Panel';
import { Button } from '@/components/ui/Button';
import { Tab } from '@/components/ui/Tab';
import { gateCopy, visitPath, type GateDashboardView } from '@/data/gate';
import styles from './NeedsAttentionPanel.module.css';

/**
 * Panel "Needs attention" (02: 57:524, 03: 70:3580): No owner / Assigned / Closed today tabs,
 * the longest-waiting visits with their photo, and a "See all" link button.
 * Tabs switch their selected state locally (Figma has no other list for them).
 */
export interface NeedsAttentionPanelProps {
  view: GateDashboardView;
}

type AttentionTab = 'noOwner' | 'assigned' | 'closed';

export function NeedsAttentionPanel({ view }: NeedsAttentionPanelProps) {
  const [tab, setTab] = useState<AttentionTab>('noOwner');
  const { tabs, items, footer } = view.attention;
  const tabList: { key: AttentionTab; label: string; count: number }[] = [
    { key: 'noOwner', label: 'No owner', count: tabs.noOwner },
    { key: 'assigned', label: 'Assigned', count: tabs.assigned },
    { key: 'closed', label: 'Closed today', count: tabs.closed },
  ];
  return (
    <Panel title="Needs attention" description={gateCopy.attentionDescription} gap={12} className={styles.panel}>
      <div className={styles.tabs} role="tablist" aria-label="Needs attention">
        {tabList.map((t) => (
          <Tab key={t.key} label={t.label} count={t.count} selected={tab === t.key} onClick={() => setTab(t.key)} />
        ))}
      </div>
      <NeedsAttentionList
        aria-label="Visits that need attention"
        restingIndex={0}
        items={items.map((a) => ({
          id: a.id,
          meta: a.meta,
          age: a.age,
          title: a.title,
          status: a.status,
          review: a.review,
          image: a.image,
          photoTime: a.photoTime,
          to: a.linked ? visitPath(a.id) : undefined,
        }))}
      />
      <div className={styles.footer}>
        <Button variant="Ghost" size="S" label={footer} className={styles.seeAll} />
      </div>
    </Panel>
  );
}
