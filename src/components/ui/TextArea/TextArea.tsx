import clsx from 'clsx';
import { forwardRef, useId } from 'react';
import styles from './TextArea.module.css';

/**
 * Figma "Text area" (67:387): Body/S Medium label, 88px field (radius 10, 1px border/default,
 * 10/12 padding, Body/S text). `required` marks the field for assistive tech; Figma puts
 * "(required)" in the label text itself.
 */
export interface TextAreaProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  required?: boolean;
  invalid?: boolean;
  height?: number;
  className?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, value, onChange, required = false, invalid = false, height = 88, className },
  ref,
) {
  const id = useId();
  return (
    <div className={clsx(styles.textArea, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        ref={ref}
        id={id}
        className={clsx(styles.field, invalid && styles.invalid)}
        style={{ height }}
        value={value}
        required={required}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </div>
  );
});
