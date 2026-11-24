import { useState } from 'react';
import { StateBlock } from '@/components/data/StateBlock';
import { Tab } from '@/components/ui/Tab';
import type { StateExample } from '@/data/states';
import styles from './QuietAttentionPanel.module.css';

/** The Needs-attention panel on a quiet day (13, node 86:5202): tabs 0 / 0 / 6 and State=Nothing needs you. */
export interface QuietAttentionPanelProps {
  tabs: ReadonlyArray<{ id: string; label: string; count: number }>;
  empty: StateExample;
}

export function QuietAttentionPanel({ tabs, empty }: QuietAttentionPanelProps) {
  const [selected, setSelected] = useState(tabs[0]?.id);
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Needs attention</h3>
      <div className={styles.tabs} role="tablist" aria-label="Needs attention">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            count={tab.count}
            selected={tab.id === selected}
            onClick={() => setSelected(tab.id)}
          />
        ))}
      </div>
      <StateBlock
        state="Nothing needs you"
        embedded
        title={empty.title}
        description={empty.description}
        actionLabel={empty.actionLabel}
      />
    </div>
  );
}
