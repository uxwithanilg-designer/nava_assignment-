import clsx from 'clsx';
import { Icon, type IconName } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/data/Skeleton';
import styles from './StateBlock.module.css';

/**
 * Figma "State" (86:363): the non-happy states of the Gate dashboard.
 * - Nothing needs you: empty needs-attention list, says why it is empty.
 * - Camera offline: amber banner. Visits in the gap are "not judged", never counted as problems.
 * - Still analysing: blue banner for footage that is still being checked.
 * - Loading: grey shapes in the KPI card layout, so the page does not jump when numbers arrive.
 * Reusable: the Gate dashboard can render these from data flags (copy comes from the caller / src/data).
 */
export type StateBlockState = 'Nothing needs you' | 'Camera offline' | 'Still analysing' | 'Loading';

export interface StateBlockProps {
  state: StateBlockState;
  title?: string;
  description?: string;
  /** Button label ("See all visits", "See camera health"). Not used by Still analysing / Loading. */
  actionLabel?: string;
  onAction?: () => void;
  /**
   * Nothing needs you: render inside a panel (no border, 24/24/12 padding) instead of as a standalone card,
   * as the instance in the Needs-attention panel does.
   */
  embedded?: boolean;
  className?: string;
}

const BANNER_ICON: Partial<Record<StateBlockState, IconName>> = {
  'Camera offline': 'camera-off',
  'Still analysing': 'refresh',
};

/** Bar heights of the mini-bar skeleton (Figma 86:351). */
const SKELETON_BARS = [18, 28, 24, 20, 17, 17, 15, 15, 13];

export function StateBlock({
  state,
  title,
  description,
  actionLabel,
  onAction,
  embedded = false,
  className,
}: StateBlockProps) {
  if (state === 'Loading') {
    return (
      <div className={clsx(styles.loading, className)} aria-busy="true">
        <span className="visually-hidden">Loading</span>
        <div className={styles.loadingTop}>
          <Skeleton width={28} height={28} radius={8} />
          <span className={styles.spacer} />
          <Skeleton width={36} height={18} radius={9} />
        </div>
        <Skeleton height={12} />
        <Skeleton width={90} height={12} />
        <div className={styles.loadingValue}>
          <Skeleton width={70} height={32} radius={8} />
          <Skeleton width={40} height={12} />
        </div>
        <div className={styles.loadingBars}>
          {SKELETON_BARS.map((h, i) => (
            <Skeleton key={i} grow height={h} radius={2} />
          ))}
        </div>
        <Skeleton height={10} />
      </div>
    );
  }

  if (state === 'Nothing needs you') {
    return (
      <div className={clsx(styles.empty, embedded && styles.embedded, className)} role="status">
        <span className={styles.emptyIcon}>
          <Icon name="check-circle" size={26} />
        </span>
        {title && <p className={styles.emptyTitle}>{title}</p>}
        {description && <p className={styles.emptyText}>{description}</p>}
        {actionLabel && <Button label={actionLabel} variant="Secondary" size="S" onClick={onAction} />}
      </div>
    );
  }

  const tone = state === 'Camera offline' ? styles.offline : styles.analysing;
  return (
    <div className={clsx(styles.banner, tone, className)} role="status">
      <span className={styles.iconBox}>
        <Icon name={BANNER_ICON[state] ?? 'info'} size={20} />
      </span>
      <div className={styles.bannerText}>
        {title && <p className={styles.bannerTitle}>{title}</p>}
        {description && <p className={styles.bannerBody}>{description}</p>}
      </div>
      {state === 'Camera offline' && actionLabel && (
        <Button label={actionLabel} variant="Secondary" size="S" onClick={onAction} />
      )}
    </div>
  );
}
