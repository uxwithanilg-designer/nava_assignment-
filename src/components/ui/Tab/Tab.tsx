import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import styles from './Tab.module.css';

/**
 * Figma "Tab" (49:358): label + count pill + 2px underline when selected.
 * Selected count uses the orange attention style; unselected uses the muted pill.
 */
export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  count?: string | number;
  selected?: boolean;
  /** Override the count pill style when a Figma instance does ("brand": selected "All visits" tab, 58:448). */
  countTone?: 'attention' | 'neutral' | 'brand';
}

export function Tab({ label, count, selected = false, countTone, className, type = 'button', ...rest }: TabProps) {
  const tone = countTone ?? (selected ? 'attention' : 'neutral');
  return (
    <button
      type={type}
      role="tab"
      aria-selected={selected}
      className={clsx(styles.tab, selected && styles.selected, className)}
      {...rest}
    >
      <span className={styles.row}>
        <span className={styles.label}>{label}</span>
        {count !== undefined && <span className={clsx(styles.count, styles[tone])}>{count}</span>}
      </span>
      <span className={styles.underline} aria-hidden="true" />
    </button>
  );
}
