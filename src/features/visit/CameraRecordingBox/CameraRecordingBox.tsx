import { Icon } from '@/components/icons';
import { EvidencePhoto } from '@/components/data/EvidencePhoto';
import { Button } from '@/components/ui/Button';
import { InfoLine } from '@/components/ui/InfoLine';
import type { CameraRecordingData } from '@/data/visits';
import styles from './CameraRecordingBox.module.css';

/**
 * Camera recording box (Figma "Time window" 68:2436). A step that could not be judged or was
 * missed shows the camera recording for its time window (4 frames), never a made-up photo.
 * "Watch clip" opens the evidence viewer (screen 11) when the visit has one.
 */
export interface CameraRecordingBoxProps {
  recording: CameraRecordingData;
}

export function CameraRecordingBox({ recording }: CameraRecordingBoxProps) {
  return (
    <div className={styles.box}>
      <div className={styles.head}>
        <Icon name="video" size={16} color="var(--text-secondary)" />
        <p className={styles.label}>{recording.label}</p>
        <span className={styles.spacer} />
        <Button label="Watch clip" variant="Secondary" size="S" icon="play" to={recording.clipTo} />
      </div>
      <div className={styles.filmstrip}>
        {recording.frames.map((frame) => (
          <EvidencePhoto
            key={frame.time}
            size="S"
            image={frame.image}
            time={frame.time}
            alt={frame.alt}
            crop={frame.crop}
          />
        ))}
      </div>
      <InfoLine icon="info" tone="secondary" align="start">
        {recording.note}
      </InfoLine>
    </div>
  );
}
