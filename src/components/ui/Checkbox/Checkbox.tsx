import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Icon } from '@/components/icons';
import styles from './Checkbox.module.css';

/**
 * Figma "Checkbox" (67:382). Props mirror the variants: Checked, Label.
 * 18px box, radius 5: checked = navy fill + white check; unchecked = white with a 1.5px grey ring.
 */
export interface CheckboxProps {
  label: ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  className?: string;
}

export function Checkbox({ label, checked = false, onChange, name, className }: CheckboxProps) {
  return (
    <label className={clsx(styles.checkbox, checked && styles.checked, className)}>
      <input
        type="checkbox"
        className={clsx('visually-hidden', styles.input)}
        name={name}
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <span className={styles.box} aria-hidden="true">
        {checked && <Icon name="check" size={12} color="var(--text-inverse)" />}
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
