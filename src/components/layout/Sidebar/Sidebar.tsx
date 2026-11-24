import { Icon } from '@/components/icons';
import { NavItem, type NavItemState } from '@/components/layout/NavItem';
import { workspace } from '@/data/workspace';
import navaLogo from '@/assets/logo/nava-logo.svg';
import styles from './Sidebar.module.css';

/** Figma "Sidebar" (49:265). Sticky: stays on the left while the page scrolls. */
export type SidebarItem =
  | 'Overview'
  | 'GateView'
  | 'FeedMill'
  | 'BirdShed'
  | 'EggStore'
  | 'Review list'
  | 'Cameras'
  | 'Reports'
  | 'Settings'
  | 'Help and guides';

export interface SidebarProps {
  active: SidebarItem;
}

export function Sidebar({ active }: SidebarProps) {
  const s = (item: SidebarItem): NavItemState => (item === active ? 'Active' : 'Default');
  return (
    <nav className={styles.sidebar} aria-label="Main">
      <div className={styles.brand}>
        <img src={navaLogo} alt="NAVA" width={76} height={18} className={styles.logo} />
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.product}>Vision AI</span>
      </div>

      <button type="button" className={styles.workspace} aria-label={`Workspace: ${workspace.name}`}>
        <span className={styles.badge}>{workspace.initials}</span>
        <span className={styles.wsText}>
          <span className={styles.wsName}>{workspace.name}</span>
          <span className={styles.wsMeta}>{workspace.meta}</span>
        </span>
        <span className={styles.spacer} />
        <Icon name="chevron-down" size={16} color="var(--text-nav)" />
      </button>

      <div className={styles.gap12} />
      <NavItem label="Overview" icon="grid" state={s('Overview')} to="/overview" />

      <div className={styles.group}>Modules</div>
      <NavItem label="GateView" icon="gate" state={s('GateView')} to="/gate" />
      <NavItem label="FeedMill" icon="factory" state={s('FeedMill')} />
      <NavItem label="BirdShed" icon="feather" state={s('BirdShed')} />
      <NavItem label="EggStore" icon="egg" state={s('EggStore')} />

      <div className={styles.group}>Work</div>
      <NavItem
        label="Review list"
        icon="clipboard"
        state={s('Review list')}
        showBadge
        count={workspace.reviewBadge}
      />
      <NavItem label="Cameras" icon="cctv" state={s('Cameras')} />
      <NavItem label="Reports" icon="chart-bar" state={s('Reports')} />
      <NavItem label="Settings" icon="sliders" state={s('Settings')} to="/settings/sop" />

      <div className={styles.fill} />
      <NavItem label="Help and guides" icon="help" state={s('Help and guides')} />
    </nav>
  );
}
