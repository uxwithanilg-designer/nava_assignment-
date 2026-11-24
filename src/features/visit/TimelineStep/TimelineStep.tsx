import clsx from 'clsx';
import { Icon } from '@/components/icons';
import { EvidencePhoto } from '@/components/data/EvidencePhoto';
import { EvidenceQuality } from '@/components/ui/EvidenceQuality';
import { InfoLine } from '@/components/ui/InfoLine';
import { StatusChip } from '@/components/ui/StatusChip';
import { cameras } from '@/data/cameras';
import type { TimelineStepData } from '@/data/visits';
import { CameraRecordingBox } from '../CameraRecordingBox';
import styles from './TimelineStep.module.css';

/**
 * One SOP step in the timeline (Figma "Step · …" 68:2316): status-coloured icon on a rail with a
 * connector, then title + result chip + mono time, description, camera / quality line and the
 * proof (photos, or the camera recording for a step that was not seen).
 */
export interface TimelineStepProps {
  step: TimelineStepData;
  /** The last step has no connector and no bottom padding. */
  last?: boolean;
}

export function cameraLabel(cameraId: string): string {
  const camera = cameras[cameraId];
  return camera ? `${camera.code} · ${camera.name}` : cameraId;
}

export function TimelineStep({ step, last = false }: TimelineStepProps) {
  return (
    <li className={clsx(styles.step, last && styles.last)}>
      <div className={styles.rail} aria-hidden="true">
        <span className={clsx(styles.icon, styles[step.tone])}>
          <Icon name={step.icon} size={18} />
        </span>
        {!last && <span className={styles.connector} />}
      </div>
      <div className={styles.content}>
        <div className={styles.head}>
          <h3 className={styles.title}>{step.title}</h3>
          <StatusChip status={step.result.status} label={step.result.label} />
          <span className={styles.spacer} />
          <p className={styles.time}>{step.time}</p>
        </div>
        <p className={styles.description}>{step.description}</p>
        <div className={styles.meta}>
          <InfoLine icon="cctv">{cameraLabel(step.cameraId)}</InfoLine>
          {step.quality && <EvidenceQuality quality={step.quality} />}
          {step.confirmedBy && (
            <InfoLine icon="user-check" tone="observed" iconColor="var(--status-observed)">
              {step.confirmedBy}
            </InfoLine>
          )}
        </div>
        {step.photos && (
          <div className={styles.photos}>
            {step.photos.map((photo) => (
              <EvidencePhoto
                key={photo.time}
                size="M"
                image={photo.image}
                time={photo.time}
                alt={photo.alt}
                crop={photo.crop}
              />
            ))}
          </div>
        )}
        {step.recording && <CameraRecordingBox recording={step.recording} />}
      </div>
    </li>
  );
}
