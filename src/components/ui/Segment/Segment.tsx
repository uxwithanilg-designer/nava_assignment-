import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import styles from './Segment.module.css';

/** Figma "Segment" (49:335): one option inside a segmented control. */
export interface SegmentProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  selected?: boolean;
}

export function Segment({ label, selected = false, className, type = 'button', ...rest }: SegmentProps) {
  return (
    <button
      type={type}
      role="radio"
      aria-checked={selected}
      className={clsx(styles.segment, selected && styles.selected, className)}
      {...rest}
    >
      {label}
    </button>
  );
}
