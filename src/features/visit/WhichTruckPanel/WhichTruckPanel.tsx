import clsx from 'clsx';
import { Icon, type IconName } from '@/components/icons';
import { Panel } from '@/components/layout/Panel';
import { EvidencePhoto } from '@/components/data/EvidencePhoto';
import { Button } from '@/components/ui/Button';
import { LINK_DESCRIPTION, type LinkPanelData } from '@/data/visits';
import type { LinkStatus } from '@/types/domain';
import styles from './WhichTruckPanel.module.css';

/**
 * Panel "Which truck?" (Figma 68:2583 / 69:3968) — the link-to-vehicle family.
 * Auto-matched (blue) · Unclear (violet, could not judge) · Confirmed by reviewer (green).
 * On 10 the reviewer picks the truck: "It is TV-0438" / "It is TV-0439" confirms the link.
 */
const LINK_CHIP: Record<LinkStatus, { icon: IconName; tone: string }> = {
  'Auto-matched': { icon: 'link', tone: 'auto' },
  Unclear: { icon: 'unlink', tone: 'unclear' },
  'Not matched': { icon: 'unlink', tone: 'notMatched' },
  'Confirmed by reviewer': { icon: 'user-check', tone: 'confirmed' },
  'Marked wrong': { icon: 'flag', tone: 'notMatched' },
};

export interface WhichTruckPanelProps {
  link: LinkPanelData;
  /** Truck the reviewer picked (candidates only). */
  picked?: string;
  onPick?: (visitId: string) => void;
}

export function WhichTruckPanel({ link, picked, onPick }: WhichTruckPanelProps) {
  const status: LinkStatus = link.candidates && picked ? 'Confirmed by reviewer' : link.status;
  const chip = LINK_CHIP[status];
  const selected = picked ?? link.candidates?.[0]?.visitId;

  return (
    <Panel
      title="Which truck?"
      description={LINK_DESCRIPTION}
      className={styles.panel}
    >
      <div className={styles.statusRow}>
        <span className={styles.statusLabel}>Link status</span>
        <span className={clsx(styles.chip, styles[chip.tone])}>
          <Icon name={chip.icon} size={12} />
          <span>{status}</span>
        </span>
      </div>
      <p className={styles.text}>{link.text}</p>
      {link.candidates && (
        <>
          <ul className={styles.candidates}>
            {link.candidates.map((candidate) => (
              <li
                key={candidate.visitId}
                className={clsx(styles.candidate, candidate.visitId === selected && styles.candidateSelected)}
              >
                <EvidencePhoto
                  size="S"
                  width={144}
                  height={81}
                  image={candidate.photo.image}
                  time={candidate.photo.time}
                  alt={candidate.photo.alt}
                  crop={candidate.photo.crop}
                />
                <span className={styles.candidateId}>{candidate.visitId}</span>
                <span className={styles.candidateEntry}>{candidate.entry}</span>
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            {link.candidates.map((candidate) => (
              <Button
                key={candidate.visitId}
                label={`It is ${candidate.visitId}`}
                size="S"
                variant={candidate.visitId === selected ? 'Primary' : 'Secondary'}
                aria-pressed={candidate.visitId === picked}
                className={styles.action}
                onClick={() => onPick?.(candidate.visitId)}
              />
            ))}
          </div>
        </>
      )}
      {link.showConfirmActions && (
        <div className={styles.actions}>
          <Button label="Confirm link" size="S" variant="Secondary" icon="check" className={styles.action} />
          <Button label="Flag wrong link" size="S" variant="Ghost" icon="flag" className={styles.action} />
        </div>
      )}
    </Panel>
  );
}
