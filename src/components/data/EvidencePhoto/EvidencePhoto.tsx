import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { EVIDENCE_IMAGES, type EvidenceImageKey } from '@/data/evidenceImages';
import styles from './EvidencePhoto.module.css';

/**
 * Figma "Evidence photo" (51:328). Size XS 48×28 · S 128×72 · M 176×99 · L 320×180.
 * Mono timestamp pill (S/M/L), blue viewfinder corners, camera label (L only).
 * `crop` reproduces each Figma instance's image-fill crop with object-position / scale,
 * so every thumbnail shows the same part of the image as Figma.
 * Without an `image` it renders the empty viewfinder placeholder Figma uses in some table rows.
 */
export type EvidencePhotoSize = 'XS' | 'S' | 'M' | 'L';

export interface EvidenceCrop {
  /** CSS object-position, e.g. "30% 40%". Default "50% 50%". */
  position?: string;
  /** Zoom factor applied around `origin` (1 = object-fit cover). */
  scale?: number;
  /** transform-origin for the zoom, e.g. "30% 40%". Defaults to `position`. */
  origin?: string;
}

export interface EvidencePhotoProps {
  size?: EvidencePhotoSize;
  image?: EvidenceImageKey;
  time?: string;
  /** Camera label for size L, e.g. "CAM 02 · SPRAY ARCH". */
  camera?: string;
  alt?: string;
  crop?: EvidenceCrop;
  /** Override width/height when a Figma instance is resized (keeps the size's radius and corners). */
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
}

/* CSS modules use localsConvention "camelCaseOnly", so `.sizeXS` is exported as `sizeXs`. */
const SIZE_CLASS: Record<EvidencePhotoSize, string | undefined> = {
  XS: styles.sizeXs,
  S: styles.sizeS,
  M: styles.sizeM,
  L: styles.sizeL,
};

export function EvidencePhoto({
  size = 'XS',
  image,
  time,
  camera,
  alt = '',
  crop,
  width,
  height,
  className,
  style,
}: EvidencePhotoProps) {
  const position = crop?.position ?? '50% 50%';
  return (
    <span
      className={clsx(styles.photo, SIZE_CLASS[size], !image && styles.empty, className)}
      style={{ width, height, ...style }}
    >
      {image && (
        <img
          className={styles.img}
          src={EVIDENCE_IMAGES[image]}
          alt={alt}
          draggable={false}
          style={{
            objectPosition: position,
            transform: crop?.scale && crop.scale !== 1 ? `scale(${crop.scale})` : undefined,
            transformOrigin: crop?.origin ?? position,
          }}
        />
      )}
      <span className={clsx(styles.corner, styles.tl)} aria-hidden="true" />
      <span className={clsx(styles.corner, styles.tr)} aria-hidden="true" />
      <span className={clsx(styles.corner, styles.bl)} aria-hidden="true" />
      <span className={clsx(styles.corner, styles.br)} aria-hidden="true" />
      {size === 'L' && camera && (
        <span className={styles.camera}>
          <span className={styles.cameraDot} aria-hidden="true" />
          {camera}
        </span>
      )}
      {size !== 'XS' && time && <span className={styles.time}>{time}</span>}
    </span>
  );
}
