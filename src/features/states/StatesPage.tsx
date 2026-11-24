import { AppShell } from '@/components/layout/AppShell';
import { StateBlock } from '@/components/data/StateBlock';
import {
  analysingExample,
  cameraOfflineExample,
  loadingExample,
  nothingNeedsYouExample,
  quietDayTabs,
  statesPage,
} from '@/data/states';
import { QuietAttentionPanel } from './QuietAttentionPanel';
import { StateExample } from './StateExample';
import styles from './StatesPage.module.css';

/**
 * 13 · States — empty, offline, analysing, loading (Figma 86:5032) · route /states.
 * A demo page in the app shell: every example is the reusable `StateBlock` (Figma "State", 86:363),
 * so the Gate dashboard can render the same blocks from data flags.
 */
export function StatesPage() {
  const loadingCards = Array.from({ length: loadingExample.cards }, (_, i) => i);
  return (
    <AppShell active="GateView" breadcrumb={statesPage.breadcrumb}>
      <header className={styles.header}>
        <h1 className={styles.title}>{statesPage.title}</h1>
        <p className={styles.subtitle}>{statesPage.subtitle}</p>
      </header>

      <StateExample label={analysingExample.label} caption={analysingExample.caption}>
        <StateBlock
          state={analysingExample.state}
          title={analysingExample.title}
          description={analysingExample.description}
        />
      </StateExample>

      <StateExample label={cameraOfflineExample.label} caption={cameraOfflineExample.caption}>
        <StateBlock
          state={cameraOfflineExample.state}
          title={cameraOfflineExample.title}
          description={cameraOfflineExample.description}
          actionLabel={cameraOfflineExample.actionLabel}
        />
      </StateExample>

      <div className={styles.row}>
        <StateExample label={nothingNeedsYouExample.label} caption={nothingNeedsYouExample.caption}>
          <QuietAttentionPanel tabs={quietDayTabs} empty={nothingNeedsYouExample} />
        </StateExample>

        <StateExample label={loadingExample.label} caption={loadingExample.caption}>
          <div className={styles.skeletonCards}>
            {loadingCards.map((i) => (
              <StateBlock key={i} state="Loading" className={styles.skeletonCard} />
            ))}
          </div>
        </StateExample>
      </div>
    </AppShell>
  );
}
