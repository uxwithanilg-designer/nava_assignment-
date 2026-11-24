import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/icons';
import styles from './InfoLine.module.css';

/**
 * InfoLine: a 14px icon + one Body/XS line, used for notes and meta lines
 * ("Temporary visit ID · …", "CAM 01 · Outside gate", "Mist covers the spray arch …").
 * Tone sets the text colour; the icon is tertiary unless `iconColor` says otherwise.
 */
export type InfoLineTone = 'tertiary' | 'secondary' | 'observed';

export interface InfoLineProps {
  icon: IconName;
  children: ReactNode;
  tone?: InfoLineTone;
  /** Icon colour token, e.g. `var(--status-observed)`. */
  iconColor?: string;
  /** Gap between icon and text: Figma uses 5 (Phase 2 note) or 6. */
  gap?: 5 | 6;
  /** `start` for notes that can wrap to two lines. */
  align?: 'center' | 'start';
  className?: string;
}

export function InfoLine({
  icon,
  children,
  tone = 'secondary',
  iconColor = 'var(--text-tertiary)',
  gap = 6,
  align = 'center',
  className,
}: InfoLineProps) {
  return (
    <p className={clsx(styles.line, styles[tone], align === 'start' && styles.start, className)} style={{ gap }}>
      <Icon name={icon} size={14} color={iconColor} />
      <span className={styles.text}>{children}</span>
    </p>
  );
}
