import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Icon } from '@/components/icons';
import styles from './PageHeader.module.css';

/**
 * Page header (02: node 54:437): Title/Page + "Updated …" refresh note, Body/M subtitle, actions on the right.
 * `height` reproduces the Figma frame height (02/03 use a 100px tall header with centred content).
 */
export interface PageHeaderProps {
  title: ReactNode;
  updated?: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  height?: number;
  className?: string;
}

export function PageHeader({ title, updated, subtitle, actions, height, className }: PageHeaderProps) {
  return (
    <div className={clsx(styles.header, className)} style={{ height }}>
      <div className={styles.text}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
          {updated && (
            <span className={styles.updated}>
              <Icon name="refresh" size={14} color="var(--text-tertiary)" />
              {updated}
            </span>
          )}
        </div>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <span className={styles.spacer} />
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
