import clsx from 'clsx';
import { Icon } from '@/components/icons';
import { EVIDENCE_IMAGES } from '@/data/evidenceImages';
import type { ViewerFrame } from '@/data/evidenceViewer';
import styles from './VideoFrame.module.css';

/**
 * Big frame of the evidence viewer (Figma 73:4619): the selected still with the camera, date/time and
 * "illustrative image" pills, blue viewfinder corners and a round play button in the middle.
 * There is no real video: play only toggles the icon.
 */
export interface VideoFrameProps {
  frame: ViewerFrame;
  camera: string;
  date: string;
  illustrativeLabel: string;
  playing: boolean;
  onTogglePlay: () => void;
}

export function VideoFrame({
  frame,
  camera,
  date,
  illustrativeLabel,
  playing,
  onTogglePlay,
}: VideoFrameProps) {
  return (
    <figure className={styles.frame}>
      <img className={styles.image} src={EVIDENCE_IMAGES[frame.image]} alt={frame.alt} draggable={false} />
      <span className={clsx(styles.pill, styles.camera)}>
        <span className={styles.dot} aria-hidden="true" />
        {camera}
      </span>
      <span className={clsx(styles.pill, styles.time)}>
        {date} · {frame.time}
      </span>
      <span className={clsx(styles.pill, styles.illustrative)}>{illustrativeLabel}</span>
      <button
        type="button"
        className={styles.play}
        aria-label={playing ? 'Pause' : 'Play'}
        aria-pressed={playing}
        onClick={onTogglePlay}
      >
        <Icon name={playing ? 'pause' : 'play'} size={28} />
      </button>
      <span className={clsx(styles.corner, styles.tl)} aria-hidden="true" />
      <span className={clsx(styles.corner, styles.tr)} aria-hidden="true" />
      <span className={clsx(styles.corner, styles.bl)} aria-hidden="true" />
      <span className={clsx(styles.corner, styles.br)} aria-hidden="true" />
    </figure>
  );
}
