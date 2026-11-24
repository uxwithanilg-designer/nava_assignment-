import clsx from 'clsx';
import { Segment } from '@/components/ui/Segment';
import styles from './SegmentedControl.module.css';

/** Figma "Segmented · 3" (49:343): muted track, 3px padding, 2px gap. */
export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange?: (value: T) => void;
  'aria-label': string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  ...rest
}: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={rest['aria-label']} className={clsx(styles.track, className)}>
      {options.map((o) => (
        <Segment
          key={o.value}
          label={o.label}
          selected={o.value === value}
          onClick={() => o.value !== value && onChange?.(o.value)}
        />
      ))}
    </div>
  );
}
