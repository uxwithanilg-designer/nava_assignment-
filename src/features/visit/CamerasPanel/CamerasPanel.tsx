import clsx from 'clsx';
import { Icon } from '@/components/icons';
import { Panel } from '@/components/layout/Panel';
import { Banner } from '@/components/ui/Banner';
import type { CamerasPanelData } from '@/data/visits';
import { cameraLabel } from '../TimelineStep';
import styles from './CamerasPanel.module.css';

/**
 * Panel "Cameras for this visit" (Figma 68:2607): one row per camera with its health
 * (cyan dot = live, amber dot = partial view / blocked) and the AI check status note.
 */
export interface CamerasPanelProps {
  cameras: CamerasPanelData;
}

export function CamerasPanel({ cameras }: CamerasPanelProps) {
  return (
    <Panel title="Cameras for this visit" className={styles.panel}>
      <ul className={styles.rows}>
        {cameras.rows.map((row) => (
          <li key={row.cameraId} className={styles.row}>
            <Icon name="cctv" size={16} color="var(--text-secondary)" />
            <span className={styles.name}>{cameraLabel(row.cameraId)}</span>
            <span className={clsx(styles.health, styles[row.tone])}>
              <span className={styles.dot} aria-hidden="true" />
              {row.status}
            </span>
          </li>
        ))}
      </ul>
      <Banner
        tone={cameras.note.tone}
        icon="shield-check"
        iconColor={cameras.note.tone === 'subtle' ? 'var(--status-observed)' : undefined}
      >
        {cameras.note.text}
      </Banner>
    </Panel>
  );
}
