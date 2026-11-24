import clsx from 'clsx';
import styles from './TableHeader.module.css';

/**
 * Figma "Table header" (53:270): subtle fill, 1px bottom border, 20px side padding, 10px vertical padding,
 * Label/S tertiary column names. Renders a real <thead>; the column widths fix the table layout.
 */
export interface TableColumn {
  key: string;
  /** Column name; empty for the action column. */
  label?: string;
  /** Content width in px (Figma column frame width). Leave undefined for the column that takes the rest. */
  width?: number;
  align?: 'start' | 'end';
}

/** Side padding of the first and last cell (Figma px-20; the action column ends 2px later, see VisitRow). */
const TABLE_EDGE_START = 20;

export interface TableHeaderProps {
  columns: TableColumn[];
  className?: string;
}

export function TableHeader({ columns, className }: TableHeaderProps) {
  return (
    <thead className={clsx(styles.head, className)}>
      <tr>
        {columns.map((c, i) => (
          <th
            key={c.key}
            scope="col"
            className={clsx(styles.th, c.align === 'end' && styles.end)}
            style={{ width: c.width !== undefined ? c.width + (i === 0 ? TABLE_EDGE_START : 0) : undefined }}
          >
            <span className={styles.cell}>{c.label}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
}
