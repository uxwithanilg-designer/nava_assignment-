import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { Icon } from '@/components/icons';
import { toSeconds, type ViewerMarker } from '@/data/evidenceViewer';
import styles from './Scrubber.module.css';

/**
 * Figma "Scrubber" (73:4657): the recording window as a track, the shaded window where spraying
 * should happen (violet = could not judge), the played part up to the selected frame, and the
 * inspection / entry markers. Every position is a % of the window, so it stays fluid.
 */
export interface ScrubberProps {
  window: { start: string; end: string };
  ticks: string[];
  expected: { start: string; end: string; label: string; labelAt: string };
  markers: ViewerMarker[];
  /** Selected frame time. */
  current: string;
}

export function Scrubber({ window, ticks, expected, markers, current }: ScrubberProps) {
  const start = toSeconds(window.start);
  const span = toSeconds(window.end) - start;
  const pct = (time: string) => ((toSeconds(time) - start) / span) * 100;
  const at = (time: string, offset = 0): CSSProperties => ({ left: `calc(${pct(time)}% + ${offset}px)` });

  return (
    <div
      className={styles.scrubber}
      role="img"
      aria-label={`Recording ${window.start} – ${window.end}, showing ${current}. ${expected.label}: ${expected.start} – ${expected.end}.`}
    >
      <span className={styles.track} />
      <span
        className={styles.expected}
        style={{ left: `${pct(expected.start)}%`, width: `${pct(expected.end) - pct(expected.start)}%` }}
      />
      <span className={styles.played} style={{ width: `${pct(current)}%` }} />
      {markers.map((marker) => (
        <span key={marker.at} className={clsx(styles.marker, styles[marker.tone])}>
          <span className={styles.markerLine} style={at(marker.at, -1)} />
          <span className={styles.markerLabel} style={at(marker.at, 4)}>
            <Icon name={marker.tone === 'observed' ? 'check' : 'gate'} size={12} />
            {marker.label}
          </span>
        </span>
      ))}
      <span className={styles.expectedLabel} style={at(expected.labelAt)}>
        {expected.label}
      </span>
      <span className={styles.thumb} style={at(current, -7)} />
      {ticks.map((tick, i) => (
        <span
          key={tick}
          className={clsx(styles.tick, i === 0 && styles.first, i === ticks.length - 1 && styles.last)}
          style={at(tick)}
        >
          {tick}
        </span>
      ))}
    </div>
  );
}
