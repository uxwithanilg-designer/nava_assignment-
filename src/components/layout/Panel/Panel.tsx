import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import styles from './Panel.module.css';

/**
 * Panel: white card with a header (Title/Panel + Body/S description) and an optional right slot.
 * Figma panels: surface fill, 1px border/subtle, radius 16, padding 20px top/bottom and 24px sides.
 */
export interface PanelProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Right side of the header (segmented control, sort filter, link…). */
  actions?: ReactNode;
  /** Gap between header and body. */
  gap?: number;
  as?: 'section' | 'div' | 'aside';
  className?: string;
  headerClassName?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Panel({
  title,
  description,
  actions,
  gap,
  as: Tag = 'section',
  className,
  headerClassName,
  style,
  children,
}: PanelProps) {
  const hasHeader = Boolean(title || description || actions);
  return (
    <Tag className={clsx(styles.panel, className)} style={{ gap, ...style }}>
      {hasHeader && (
        <header className={clsx(styles.header, headerClassName)}>
          <div className={styles.headText}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      {children}
    </Tag>
  );
}
