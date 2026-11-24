import clsx from 'clsx';
import { Avatar } from '@/components/ui/Avatar';
import styles from './PersonOption.module.css';

/**
 * Figma "Person option" (67:371). Props mirror the variants: Selected, Name, Role, Open.
 * Radio + avatar (M) + name / role + open count. A real radio input inside a label.
 */
export interface PersonOptionProps {
  name: string;
  value: string;
  /** Person name, e.g. "Emily C" or "Ryan M (you)". */
  label: string;
  initials: string;
  /** "QA reviewer · Unit 3" */
  role: string;
  /** "3 open" */
  open: string;
  selected?: boolean;
  onSelect?: (value: string) => void;
  className?: string;
}

export function PersonOption({
  name,
  value,
  label,
  initials,
  role,
  open,
  selected = false,
  onSelect,
  className,
}: PersonOptionProps) {
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
      <span className={styles.radio} aria-hidden="true" />
      <Avatar initials={initials} size="M" />
      <span className={styles.text}>
        <span className={styles.name}>{label}</span>
        <span className={styles.role}>{role}</span>
      </span>
      <span className={styles.open}>{open}</span>
    </label>
  );
}
