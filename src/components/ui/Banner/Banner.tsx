import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/icons';
import styles from './Banner.module.css';

/**
 * Banner: tinted note box with an icon.
 * Size M (12/14 padding, radius 12, 18px icon, Body/S): "Not a violation", "Two trucks at the gate".
 * Size S (10/12 padding, radius 10, 16px icon, Body/XS): review tips, AI check notes, modal info.
 * Tones use status colours only: violet = could not judge, slate = camera problem (never a violation).
 */
export type BannerTone = 'info' | 'attention' | 'subtle' | 'review' | 'obstructed';
export type BannerSize = 'M' | 'S';

export interface BannerProps {
  tone: BannerTone;
  icon: IconName;
  size?: BannerSize;
  /** Body/S Medium first line (size M). */
  title?: ReactNode;
  children: ReactNode;
  /** Override the icon colour (e.g. the green shield on a subtle AI note). */
  iconColor?: string;
  /** Override the icon size (Figma uses 16 on the size-M footnote). */
  iconSize?: number;
  align?: 'start' | 'center';
  className?: string;
}

export function Banner({
  tone,
  icon,
  size = 'S',
  title,
  children,
  iconColor,
  iconSize,
  align = 'start',
  className,
}: BannerProps) {
  return (
    <div className={clsx(styles.banner, styles[`size${size}`], styles[tone], align === 'center' && styles.center, className)}>
      <Icon name={icon} size={iconSize ?? (size === 'M' ? 18 : 16)} color={iconColor} className={styles.icon} />
      <div className={styles.text}>
        {title && <p className={styles.title}>{title}</p>}
        <p>{children}</p>
      </div>
    </div>
  );
}
