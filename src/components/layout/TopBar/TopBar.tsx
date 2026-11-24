import { Fragment } from 'react';
import { Icon } from '@/components/icons';
import { Avatar } from '@/components/ui/Avatar';
import { IconButton } from '@/components/ui/IconButton';
import { currentUser } from '@/data/people';
import { topBarStatus } from '@/data/workspace';
import styles from './TopBar.module.css';

/** Figma "Top bar" (49:304): breadcrumb · search · camera status · bell · avatar. 64px high. */
export interface TopBarProps {
  /** Breadcrumb items; the last one is the current page (Body/S Medium, primary). */
  breadcrumb: string[];
  camerasLive?: string;
  cameraNote?: string;
}

export function TopBar({
  breadcrumb,
  camerasLive = topBarStatus.camerasLive,
  cameraNote = topBarStatus.cameraNote,
}: TopBarProps) {
  return (
    <header className={styles.topBar}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        {breadcrumb.map((crumb, i) => {
          const last = i === breadcrumb.length - 1;
          return (
            <Fragment key={`${crumb}-${i}`}>
              {i > 0 && <Icon name="chevron-right" size={14} color="var(--text-tertiary)" />}
              <span className={last ? styles.crumbCurrent : styles.crumb} aria-current={last ? 'page' : undefined}>
                {crumb}
              </span>
            </Fragment>
          );
        })}
      </nav>
      <span className={styles.spacer} />
      <label className={styles.search}>
        <Icon name="search" size={16} color="var(--text-tertiary)" />
        <input className={styles.searchInput} type="search" placeholder="Search a visit ID, like TV-0412" />
        <kbd className={styles.kbd}>Ctrl K</kbd>
      </label>
      <button type="button" className={styles.cameraStatus}>
        <span className={styles.dotLive} aria-hidden="true" />
        <span className={styles.statusLive}>{camerasLive}</span>
        <span className={styles.statusDivider} aria-hidden="true" />
        <span className={styles.dotPartial} aria-hidden="true" />
        <span className={styles.statusNote}>{cameraNote}</span>
      </button>
      <span className={styles.bell}>
        <IconButton icon="bell" aria-label="Notifications" />
        <span className={styles.bellDot} aria-hidden="true" />
      </span>
      <Avatar initials={currentUser.initials} size="M" />
    </header>
  );
}
