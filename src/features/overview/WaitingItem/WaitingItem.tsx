import { Link } from 'react-router-dom';
import { EvidencePhoto } from '@/components/data/EvidencePhoto';
import { Icon } from '@/components/icons';
import { ReviewTag } from '@/components/ui/ReviewTag';
import { StatusChip } from '@/components/ui/StatusChip';
import type { WaitingVisit } from '@/data/overview';
import styles from './WaitingItem.module.css';

/**
 * One "Waiting the longest" item (Figma "Needs-attention item" instance, State Default / Hover):
 * S evidence photo · mono visit ID, meta, age · title · step-result chip + "No owner" tag.
 * Hover shows bg/subtle and a chevron. A visit with a prototype link is a router link; the others are
 * buttons that do not navigate.
 */
export function WaitingItem({ visit: v }: { visit: WaitingVisit }) {
  const content = (
    <>
      <EvidencePhoto size="S" image={v.image} time={v.time} alt={v.alt} />
      <span className={styles.content}>
        <span className={styles.top}>
          <span className={styles.id}>{v.id}</span>
          <span className={`${styles.meta} ${styles.metaText}`}>{v.meta}</span>
          <span className={styles.spacer} />
          <span className={styles.meta}>{v.age}</span>
        </span>
        <span className={styles.title}>{v.title}</span>
        <span className={styles.tags}>
          <StatusChip status={v.status} />
          <ReviewTag review="No owner" />
        </span>
        <Icon name="chevron-right" size={16} className={styles.chevron} />
      </span>
    </>
  );
  return v.to ? (
    <Link to={v.to} className={styles.item}>
      {content}
    </Link>
  ) : (
    <button type="button" className={styles.item}>
      {content}
    </button>
  );
}
