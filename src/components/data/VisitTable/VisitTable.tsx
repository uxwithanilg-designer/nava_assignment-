import clsx from 'clsx';
import { useState } from 'react';
import { TableHeader, type TableColumn } from '@/components/data/TableHeader';
import { VisitRow, type VisitRowData } from '@/components/data/VisitRow';
import styles from './VisitTable.module.css';

/**
 * Vehicle visits table: Figma "Table header" (53:270) + "Visit row" (53:369) instances.
 * Column widths are the Figma column frames. The row under the pointer (or focus) shows the Hover variant;
 * `restingIndex` is the row shown in Hover when nothing is hovered (the Figma frames show the first row so).
 */
const COLUMNS: TableColumn[] = [
  { key: 'id', label: 'Visit ID', width: 136 },
  { key: 'gate', label: 'Gate', width: 92 },
  { key: 'direction', label: 'Direction', width: 100 },
  { key: 'time', label: 'Entry / exit time', width: 96 },
  { key: 'inspection', label: 'Inspection time · result', width: 168 },
  { key: 'disinfection', label: 'Disinfection time · result', width: 168 },
  { key: 'quality', label: 'Evidence quality', width: 132 },
  { key: 'review', label: 'Review status', width: 136 },
  { key: 'action', label: '', align: 'end' },
];

export interface VisitTableRow {
  visit: VisitRowData;
  /** Visit page link (prototype); rows without one are not links. */
  to?: string;
}

export interface VisitTableProps {
  rows: VisitTableRow[];
  restingIndex?: number;
  caption?: string;
  className?: string;
}

export function VisitTable({ rows, restingIndex, caption, className }: VisitTableProps) {
  const [active, setActive] = useState<number | null>(null);
  const highlighted = active ?? restingIndex;
  return (
    <div className={clsx(styles.scroll, className)}>
      <table className={styles.table}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <TableHeader columns={COLUMNS} />
        <tbody onMouseLeave={() => setActive(null)}>
          {rows.map((r, i) => (
            <VisitRow
              key={r.visit.id}
              visit={r.visit}
              to={r.to}
              state={highlighted === i ? 'Hover' : 'Default'}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
