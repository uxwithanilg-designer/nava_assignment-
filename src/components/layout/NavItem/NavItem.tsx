import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from '@/components/icons';
import styles from './NavItem.module.css';

/**
 * Figma "Nav item" (49:139). State Default / Active, label, icon, optional orange count badge.
 * Items with a `to` are prototype links; the others stay real buttons that do not navigate.
 */
export type NavItemState = 'Default' | 'Active';

export interface NavItemProps {
  label: string;
  icon: IconName;
  state?: NavItemState;
  showBadge?: boolean;
  count?: string | number;
  to?: string;
}

export function NavItem({ label, icon, state = 'Default', showBadge = false, count, to }: NavItemProps) {
  const active = state === 'Active';
  const content = (
    <>
      <Icon name={icon} size={18} className={styles.icon} />
      <span className={styles.label}>{label}</span>
      <span className={styles.spacer} />
      {showBadge && <span className={styles.badge}>{count}</span>}
    </>
  );
  const cls = clsx(styles.item, active && styles.active);
  if (to) {
    return (
      <Link to={to} className={cls} aria-current={active ? 'page' : undefined}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={cls}>
      {content}
    </button>
  );
}
