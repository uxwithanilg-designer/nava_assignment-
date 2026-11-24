import { useState } from 'react';
import { NeedsAttentionList } from '@/components/data/NeedsAttentionList';
import { StateBlock } from '@/components/data/StateBlock';
import { Panel } from '@/components/layout/Panel';
import { Button } from '@/components/ui/Button';
import { Tab } from '@/components/ui/Tab';
import { gateCopy, visitPath, type AttentionTab, type GateDashboardView } from '@/data/gate';
import styles from './NeedsAttentionPanel.module.css';

/**
 * Panel "Needs attention" (02: 57:524, 03: 70:3580): No owner / Assigned / Closed today tabs,
 * the longest-waiting visits with their photo, and a "See all" link button.
 * On the Figma frames (02, 03) the tabs switch their selected state locally (Figma has one list only).
 * Other hours carry a list per tab: the panel opens the first tab that has items and shows the
 * "Nothing needs you" state for an empty tab, so the panel is never empty.
 */
export interface NeedsAttentionPanelProps {
  view: GateDashboardView;
}

const TAB_ORDER: AttentionTab[] = ['noOwner', 'assigned', 'closed'];

export function NeedsAttentionPanel({ view }: NeedsAttentionPanelProps) {
  const { tabs, items, footer, lists, empty } = view.attention;
  const [tab, setTab] = useState<AttentionTab>(
    () => (lists && TAB_ORDER.find((key) => lists[key].length > 0)) ?? 'noOwner',
  );
  const shown = lists ? lists[tab] : items;
  const tabList: { key: AttentionTab; label: string; count: number }[] = [
    { key: 'noOwner', label: 'No owner', count: tabs.noOwner },
    { key: 'assigned', label: 'Assigned', count: tabs.assigned },
    { key: 'closed', label: 'Closed today', count: tabs.closed },
  ];
  return (
    <Panel
      title="Needs attention"
      description={gateCopy.attentionDescription}
      gap={12}
      className={styles.panel}
    >
      <div className={styles.tabs} role="tablist" aria-label="Needs attention">
        {tabList.map((t) => (
          <Tab
            key={t.key}
            label={t.label}
            count={t.count}
            selected={tab === t.key}
            onClick={() => setTab(t.key)}
          />
        ))}
      </div>
      {shown.length === 0 && empty ? (
        <StateBlock
          state="Nothing needs you"
          embedded
          title={empty.title}
          description={empty.description}
          actionLabel={empty.action}
        />
      ) : (
        <NeedsAttentionList
          aria-label="Visits that need attention"
          restingIndex={0}
          items={shown.map((a) => ({
            id: a.id,
            meta: a.meta,
            age: a.age,
            title: a.title,
            status: a.status,
            review: a.review,
            reviewName: a.reviewName,
            reviewInitials: a.reviewInitials,
            image: a.image,
            photoTime: a.photoTime,
            to: a.linked ? visitPath(a.id) : undefined,
          }))}
        />
      )}
      {shown.length > 0 && (
        <div className={styles.footer}>
          <Button variant="Ghost" size="S" label={footer} className={styles.seeAll} />
        </div>
      )}
    </Panel>
  );
}
