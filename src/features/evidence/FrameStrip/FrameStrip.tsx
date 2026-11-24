import clsx from 'clsx';
import { EvidencePhoto } from '@/components/data/EvidencePhoto';
import type { ViewerFrame } from '@/data/evidenceViewer';
import styles from './FrameStrip.module.css';

/**
 * Figma "Frames" (73:4682): 160×90 Evidence photos of the recording. The selected frame has a 3px accent
 * outline; the others are dimmed to 75%. Clicking a frame selects it.
 */
export interface FrameStripProps {
  frames: ViewerFrame[];
  selected: number;
  onSelect: (index: number) => void;
}

export function FrameStrip({ frames, selected, onSelect }: FrameStripProps) {
  return (
    <ul className={styles.strip} aria-label="Frames from the recording">
      {frames.map((frame, i) => (
        <li key={frame.time}>
          <button
            type="button"
            className={clsx(styles.frame, i === selected && styles.selected)}
            aria-pressed={i === selected}
            aria-label={`Frame ${frame.time}`}
            onClick={() => onSelect(i)}
          >
            <EvidencePhoto
              size="S"
              image={frame.image}
              time={frame.time}
              alt=""
              width={160}
              height={90}
              className={styles.photo}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
