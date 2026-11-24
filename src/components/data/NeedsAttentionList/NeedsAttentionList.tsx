import clsx from 'clsx';
import { useState } from 'react';
import { NeedsAttentionItem, type NeedsAttentionItemProps } from '@/components/data/NeedsAttentionItem';
import styles from './NeedsAttentionList.module.css';

/**
 * List of Needs-attention items (2px gap), as in the "Needs attention" panel (57:548).
 * The item under the pointer (or keyboard focus) shows the Figma Hover variant.
 * `restingIndex` is the item shown in Hover when nothing is hovered: the Figma frames show the
 * first (longest-waiting) item in that state, so the dashboards pass 0.
 */
export type NeedsAttentionListItem = Omit<
  NeedsAttentionItemProps,
  'state' | 'chevron' | 'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur' | 'className'
>;

export interface NeedsAttentionListProps {
  items: NeedsAttentionListItem[];
  restingIndex?: number;
  className?: string;
  'aria-label'?: string;
}

export function NeedsAttentionList({ items, restingIndex, className, ...rest }: NeedsAttentionListProps) {
  const [active, setActive] = useState<number | null>(null);
  const highlighted = active ?? restingIndex;
  return (
    <ul className={clsx(styles.list, className)} aria-label={rest['aria-label']}>
      {items.map((item, i) => (
        <li key={item.id} className={styles.entry}>
          <NeedsAttentionItem
            {...item}
            state={highlighted === i ? 'Hover' : 'Default'}
            chevron={active !== null}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          />
        </li>
      ))}
    </ul>
  );
}
