import { Panel } from '@/components/layout/Panel';
import { waitingLongest } from '@/data/overview';
import { WaitingItem } from '../WaitingItem';
import styles from './WaitingLongestPanel.module.css';

/** Panel "Waiting the longest" (72:4818): oldest problems with no owner, across all units. */
export function WaitingLongestPanel() {
  const w = waitingLongest;
  return (
    <Panel title={w.title} description={w.description} className={styles.panel}>
      <ul className={styles.list}>
        {w.visits.map((v) => (
          <li key={v.id}>
            <WaitingItem visit={v} />
          </li>
        ))}
      </ul>
      <button type="button" className={styles.footerLink}>
        Open review list · {w.openCount} open
      </button>
    </Panel>
  );
}
