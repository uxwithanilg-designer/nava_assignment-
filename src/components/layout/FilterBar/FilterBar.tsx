import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './FilterBar.module.css';

/**
 * FilterBar: the "Filters" row (02: 54:459). Filters and segmented controls in a 10px-gap row,
 * a flexible spacer, then trailing actions ("Reset filters").
 */
export interface FilterBarProps {
  children: ReactNode;
  /** Right-aligned actions after the spacer. */
  actions?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function FilterBar({ children, actions, className, ...rest }: FilterBarProps) {
  return (
    <div className={clsx(styles.bar, className)} role="toolbar" aria-label={rest['aria-label'] ?? 'Filters'}>
      {children}
      <span className={styles.spacer} />
      {actions}
    </div>
  );
}
