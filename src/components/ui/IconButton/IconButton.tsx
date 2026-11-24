import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/icons';
import styles from './IconButton.module.css';

/** Figma "Icon button" (48:159). Type Ghost / Outline, 36×36, 18px icon. */
export type IconButtonVariant = 'Ghost' | 'Outline';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  /** Required: icon buttons always carry an accessible name. */
  'aria-label': string;
  variant?: IconButtonVariant;
  iconSize?: number;
}

export function IconButton({
  icon,
  variant = 'Ghost',
  iconSize = 18,
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button type={type} className={clsx(styles.iconButton, styles[variant.toLowerCase()], className)} {...rest}>
      <Icon name={icon} size={iconSize} />
    </button>
  );
}
