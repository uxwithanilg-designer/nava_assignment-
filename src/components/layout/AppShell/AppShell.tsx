import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Sidebar, type SidebarItem } from '@/components/layout/Sidebar';
import { TopBar, type TopBarProps } from '@/components/layout/TopBar';
import styles from './AppShell.module.css';

/**
 * App shell used by every screen except 11 (evidence viewer):
 * sticky 240px sidebar on a full-height navy column + 1200px main column (top bar + content).
 * Content: 32px side padding, 24px gap between sections, 24px top (28px on the gate dashboard), 48px bottom.
 */
export interface AppShellProps {
  active: SidebarItem;
  breadcrumb: string[];
  topBar?: Omit<TopBarProps, 'breadcrumb'>;
  /** Content top padding: Figma uses 24px, the gate dashboard pages use 28px. */
  contentTop?: 24 | 28;
  className?: string;
  children: ReactNode;
}

export function AppShell({ active, breadcrumb, topBar, contentTop = 24, className, children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.navColumn}>
        <Sidebar active={active} />
      </div>
      <div className={styles.mainColumn}>
        <TopBar breadcrumb={breadcrumb} {...topBar} />
        <main className={clsx(styles.content, contentTop === 28 && styles.top28, className)}>{children}</main>
      </div>
    </div>
  );
}
