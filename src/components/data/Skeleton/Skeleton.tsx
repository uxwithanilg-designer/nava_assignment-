import clsx from 'clsx';
import type { CSSProperties } from 'react';
import styles from './Skeleton.module.css';

/**
 * Grey placeholder shape (Figma "Skeleton" layers inside State=Loading, 86:362): bg/muted fill.
 * A subtle shimmer runs over it; it is switched off under prefers-reduced-motion.
 * `width` / `height` take a number (px) or any CSS length; `grow` makes it flex: 1 (Figma "fill").
 */
export interface SkeletonProps {
  width?: number | string;
  height: number | string;
  radius?: number;
  grow?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({
  width = '100%',
  height,
  radius = 6,
  grow = false,
  className,
  style,
}: SkeletonProps) {
  return (
    <span
      className={clsx(styles.skeleton, grow && styles.grow, className)}
      style={{ width: grow ? undefined : width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}
