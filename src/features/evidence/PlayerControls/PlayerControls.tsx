import clsx from 'clsx';
import { Icon } from '@/components/icons';
import styles from './PlayerControls.module.css';

/** Figma "Controls" (73:4638): previous frame · play/pause · next frame · time · speed · keyboard hint. */
export interface PlayerControlsProps {
  time: string;
  /** "of 07:36:00 – 07:44:00" */
  range: string;
  playing: boolean;
  speed: string;
  hint: string;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
}

export function PlayerControls({
  time,
  range,
  playing,
  speed,
  hint,
  onPrev,
  onNext,
  onTogglePlay,
}: PlayerControlsProps) {
  return (
    <div className={styles.controls}>
      <button type="button" className={styles.button} aria-label="Previous frame" onClick={onPrev}>
        <Icon name="chevron-left" size={18} />
      </button>
      <button
        type="button"
        className={clsx(styles.button, styles.play)}
        aria-label={playing ? 'Pause' : 'Play'}
        aria-pressed={playing}
        onClick={onTogglePlay}
      >
        <Icon name={playing ? 'pause' : 'play'} size={18} />
      </button>
      <button type="button" className={styles.button} aria-label="Next frame" onClick={onNext}>
        <Icon name="chevron-right" size={18} />
      </button>
      <span className={styles.time} aria-live="polite">
        {time}
      </span>
      <span className={styles.range}>{range}</span>
      <span className={styles.spacer} />
      <button type="button" className={styles.speed} aria-haspopup="listbox">
        {speed}
        <Icon name="chevron-down" size={14} />
      </button>
      <span className={styles.hint}>{hint}</span>
    </div>
  );
}
