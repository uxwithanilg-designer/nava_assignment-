import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/icons';
import styles from './Filter.module.css';

/**
 * Figma "Filter" (49:328): 40px tall select-like button.
 * State "Changed" (brand outline + brand-subtle fill) marks a filter that differs from the default.
 */
export type FilterState = 'Default' | 'Changed';

export interface FilterProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'> {
  label: string;
  value: string;
  icon?: IconName;
  state?: FilterState;
  /** Hide the trailing chevron (Figma never does on screens, kept for completeness). */
  hideChevron?: boolean;
}

export function Filter({
  label,
  value,
  icon = 'map-pin',
  state = 'Default',
  hideChevron = false,
  className,
  type = 'button',
  ...rest
}: FilterProps) {
  return (
    <button
      type={type}
      aria-haspopup="listbox"
      className={clsx(styles.filter, state === 'Changed' && styles.changed, className)}
      {...rest}
    >
      <Icon name={icon} size={16} className={styles.icon} />
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {!hideChevron && <Icon name="chevron-down" size={16} className={styles.chevron} />}
    </button>
  );
}
