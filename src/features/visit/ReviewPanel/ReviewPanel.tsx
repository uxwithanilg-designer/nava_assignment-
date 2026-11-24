import { Panel } from '@/components/layout/Panel';
import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { ReviewTag } from '@/components/ui/ReviewTag';
import { StatusChip } from '@/components/ui/StatusChip';
import { people } from '@/data/people';
import type { ReviewActionData, ReviewPanelData } from '@/data/visits';
import styles from './ReviewPanel.module.css';

/**
 * Panel "Review" (Figma 68:2535): status, owner, due / closed time, tip or closure reason,
 * actions and the history. "Assign" opens the drawer (05), "Close visit" the close modal (OV),
 * "Reopen" puts the visit back to its previous state. Other actions have no prototype link.
 */
export interface ReviewPanelProps {
  visitId: string;
  review: ReviewPanelData;
  onReopen?: () => void;
}

export function ReviewPanel({ visitId, review, onReopen }: ReviewPanelProps) {
  const owner = review.ownerId ? people[review.ownerId] : undefined;
  const actionProps = (action: ReviewActionData) => {
    switch (action.kind) {
      case 'assign':
        return { to: `/gate/visits/${visitId}/assign` };
      case 'close':
        return { to: `/gate/visits/${visitId}/close` };
      case 'reopen':
        return { onClick: onReopen };
      default:
        return {};
    }
  };

  return (
    <Panel title="Review" className={styles.panel}>
      <dl className={styles.facts}>
        <div className={styles.row}>
          <dt className={styles.term}>Status</dt>
          <dd>
            <StatusChip status={review.status.status} label={review.status.label} />
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.term}>Owner</dt>
          <dd>
            {owner ? (
              <ReviewTag review="Assigned" name={owner.name} initials={owner.initials} />
            ) : (
              <ReviewTag review="No owner" />
            )}
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.term}>{review.detail.label}</dt>
          <dd className={styles.value}>{review.detail.value}</dd>
        </div>
      </dl>
      {review.tip && (
        <Banner tone="info" icon="lightbulb">
          {review.tip}
        </Banner>
      )}
      {review.closure && (
        <div className={styles.closure}>
          <p className={styles.reason}>Reason: {review.closure.reason}</p>
          {review.closure.note && <p className={styles.note}>“{review.closure.note}”</p>}
        </div>
      )}
      <div className={styles.actions}>
        {review.actions.map((action) => (
          <Button
            key={action.kind}
            label={action.label}
            icon={action.icon}
            variant={action.variant}
            className={styles.action}
            {...actionProps(action)}
          />
        ))}
      </div>
      <hr className={styles.divider} />
      <h3 className={styles.historyLabel}>History</h3>
      <ol className={styles.history}>
        {review.history.map((entry) => (
          <li key={`${entry.time}-${entry.text}`} className={styles.entry}>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.time}>{entry.time}</span>
            <span className={styles.entryText}>{entry.text}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
