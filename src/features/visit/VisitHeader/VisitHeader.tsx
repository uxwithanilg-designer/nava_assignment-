import { Link } from 'react-router-dom';
import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { InfoLine } from '@/components/ui/InfoLine';
import { StatusChip } from '@/components/ui/StatusChip';
import { PHASE_2_NOTE, type HeaderChip, type StatusLabel } from '@/data/visits';
import styles from './VisitHeader.module.css';

/**
 * Visit header (Figma 68:2268): direction / gate / time / SOP chips, mono visit ID + status chip +
 * Phase 2 note, heading and explanation, "Share link". The SOP chip links to screen 12.
 */
export interface VisitHeaderProps {
  id: string;
  chips: HeaderChip[];
  status: StatusLabel;
  heading: string;
  body: string;
}

export function VisitHeader({ id, chips, status, heading, body }: VisitHeaderProps) {
  return (
    <header className={styles.header}>
      <ul className={styles.chips}>
        {chips.map((chip) => {
          const content = (
            <>
              <Icon name={chip.icon} size={14} color="var(--text-secondary)" />
              <span>{chip.label}</span>
            </>
          );
          return (
            <li key={chip.label}>
              {chip.to ? (
                <Link to={chip.to} className={`${styles.chip} ${styles.chipLink}`}>
                  {content}
                </Link>
              ) : (
                <span className={styles.chip}>{content}</span>
              )}
            </li>
          );
        })}
      </ul>
      <div className={styles.main}>
        <div className={styles.text}>
          <div className={styles.titleRow}>
            <h1 className={styles.id}>{id}</h1>
            <StatusChip status={status.status} label={status.label} />
            <InfoLine icon="info" tone="tertiary" gap={5}>
              {PHASE_2_NOTE}
            </InfoLine>
          </div>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.body}>{body}</p>
        </div>
        <Button label="Share link" variant="Secondary" icon="link" />
      </div>
    </header>
  );
}
