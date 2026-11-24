import clsx from 'clsx';
import styles from './Avatar.module.css';

/** Figma "Avatar" (48:110). Size S 20px · M 28px · L 36px. */
export type AvatarSize = 'S' | 'M' | 'L';

export interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ initials, size = 'S', className }: AvatarProps) {
  return (
    <span className={clsx(styles.avatar, styles[`size${size}`], className)} aria-hidden="true">
      {initials}
    </span>
  );
}
