import clsx from 'clsx';
import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import type { SopListEntry } from '@/data/sops';
import styles from './SopList.module.css';

/** Figma "SOP list" (75:4854): "SOPs by unit", one row per SOP (selected row outlined), "New SOP". */
export interface SopListProps {
  items: SopListEntry[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function SopList({ items, selectedId, onSelect }: SopListProps) {
  return (
    <aside className={styles.list} aria-labelledby="sop-list-label">
      <h2 id="sop-list-label" className={styles.label}>
        SOPs by unit
      </h2>
      {items.map((sop) => {
        const selected = sop.id === selectedId;
        return (
          <button
            key={sop.id}
            type="button"
            className={clsx(styles.item, selected && styles.selected)}
            aria-pressed={selected}
            onClick={() => onSelect(sop.id)}
          >
            <Icon name="workflow" size={16} className={styles.icon} />
            <span className={styles.text}>
              <span className={styles.name}>{sop.name}</span>
              <span className={styles.meta}>{sop.meta}</span>
            </span>
            {sop.active && (
              <span className={styles.status}>
                <span className={styles.dot} aria-hidden="true" />
                Active
              </span>
            )}
          </button>
        );
      })}
      <Button label="New SOP" variant="Ghost" size="S" icon="plus" className={styles.newSop} />
    </aside>
  );
}
