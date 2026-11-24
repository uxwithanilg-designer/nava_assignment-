import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './FilterBar.module.css';

/**
 * FilterBar: the "Filters" row (02: 54:459). Filters and segmented controls in a 10px-gap row,
 * a flexible spacer, then trailing actions ("Reset filters").
 * Below 1440 the row stays on one line: tighter spacing, and the filters drop their small grey label
 * (it stays as the accessible name and hover title), see Filter.module.css.
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
    <div
      className={clsx(styles.bar, className)}
      role="toolbar"
      aria-label={rest['aria-label'] ?? 'Filters'}
      data-filter-bar=""
    >
      {children}
      <span className={styles.spacer} />
      {actions}
    </div>
  );
}
