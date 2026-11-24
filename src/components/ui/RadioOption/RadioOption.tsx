import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './RadioOption.module.css';

/**
 * Figma "Radio option" (67:352). Props mirror the variants: Selected, Label, Helper, Show helper.
 * A real radio input (visually hidden) inside a label, so arrow keys move through the group.
 * Selected: accent-subtle fill + 1.5px accent stroke, 5px navy ring; default: 1px subtle stroke.
 */
export interface RadioOptionProps {
  name: string;
  value: string;
  label: ReactNode;
  selected?: boolean;
  helper?: ReactNode;
  showHelper?: boolean;
  onSelect?: (value: string) => void;
  className?: string;
}

export function RadioOption({
  name,
  value,
  label,
  selected = false,
  helper,
  showHelper = Boolean(helper),
  onSelect,
  className,
}: RadioOptionProps) {
  return (
    <label className={clsx(styles.option, selected && styles.selected, className)}>
      <input
        type="radio"
        className={clsx('visually-hidden', styles.input)}
        name={name}
        value={value}
        checked={selected}
        onChange={() => onSelect?.(value)}
      />
      <span className={styles.radioFrame} aria-hidden="true">
        <span className={styles.radio} />
      </span>
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {showHelper && helper && <span className={styles.helper}>{helper}</span>}
      </span>
    </label>
  );
}
