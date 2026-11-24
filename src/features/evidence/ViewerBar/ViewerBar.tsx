import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from '@/components/icons';
import type { EvidenceQualityValue } from '@/types/domain';
import styles from './ViewerBar.module.css';

/** Figma "Viewer bar" (73:4595): back link · step and camera · quality pill · zoom / download / full screen. */
export interface ViewerBarProps {
  visitId: string;
  /** Visit page, used when there is no history to go back to. */
  backTo: string;
  onBack: (event: MouseEvent<HTMLAnchorElement>) => void;
  context: string;
  quality: EvidenceQualityValue;
}

/** Same icons as the Figma "Evidence quality" family. */
const QUALITY_ICON: Record<EvidenceQualityValue, IconName> = {
  Good: 'check',
  Partial: 'eye',
  'Low visibility': 'eye-off',
  'Camera blocked': 'camera-off',
};

const TOOLS: { icon: IconName; label: string }[] = [
  { icon: 'zoom-in', label: 'Zoom in' },
  { icon: 'download', label: 'Download clip' },
  { icon: 'maximize', label: 'Full screen' },
];

export function ViewerBar({ visitId, backTo, onBack, context, quality }: ViewerBarProps) {
  return (
    <header className={styles.bar}>
      <Link to={backTo} className={styles.back} onClick={onBack}>
        <Icon name="chevron-left" size={16} />
        <span>Back to visit {visitId}</span>
      </Link>
      <span className={styles.divider} aria-hidden="true" />
      <p className={styles.context}>{context}</p>
      <span className={styles.spacer} />
      <span className={styles.quality}>
        <Icon name={QUALITY_ICON[quality]} size={14} />
        {quality}
      </span>
      {TOOLS.map((tool) => (
        <button key={tool.icon} type="button" className={styles.tool} aria-label={tool.label}>
          <Icon name={tool.icon} size={18} />
        </button>
      ))}
    </header>
  );
}
