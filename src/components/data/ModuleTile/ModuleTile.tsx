import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from '@/components/icons';
import styles from './ModuleTile.module.css';

/**
 * Figma "Module tile" (81:5674): one platform module on the management overview.
 * Head (icon tile · name + description · status pill) · KPI value + unit · review pills · rule · open link.
 * The Figma component has no variants; its properties (name, description, icon, value, unit, review,
 * noOwner, link) map 1:1 to these props. `to` wires the prototype link; without it the link is a
 * plain button (modules not in the prototype do not navigate).
 */
export interface ModuleTileProps {
  name: string;
  description: string;
  icon: IconName;
  /** Big number, e.g. "214". */
  value: string;
  /** Text after the number, e.g. "visits today". */
  unit: string;
  /** Violet pill, e.g. "31 need review". */
  review: string;
  /** Orange pill, e.g. "10 no owner". */
  noOwner: string;
  /** Link label, e.g. "Open GateView". */
  link: string;
  /** Status pill text (Figma shows "Live" with a cyan dot). */
  status?: string;
  /** Router destination for the open link. */
  to?: string;
  className?: string;
}

export function ModuleTile({
  name,
  description,
  icon,
  value,
  unit,
  review,
  noOwner,
  link,
  status = 'Live',
  to,
  className,
}: ModuleTileProps) {
  const linkContent = (
    <>
      <span className={styles.linkLabel}>{link}</span>
      <span className={styles.spacer} />
      <Icon name="chevron-right" size={16} />
    </>
  );
  return (
    <article className={clsx(styles.tile, className)} aria-label={name}>
      <div className={styles.head}>
        <span className={styles.iconBox}>
          <Icon name={icon} size={20} />
        </span>
        <div className={styles.titles}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <span className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />
          {status}
        </span>
      </div>
      <p className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        <span className={styles.unit}>{unit}</span>
      </p>
      <div className={styles.pills}>
        <span className={clsx(styles.pill, styles.reviewPill)}>
          <Icon name="eye" size={12} />
          {review}
        </span>
        <span className={clsx(styles.pill, styles.noOwnerPill)}>{noOwner}</span>
      </div>
      <span className={styles.rule} aria-hidden="true" />
      {to ? (
        <Link to={to} className={styles.link}>
          {linkContent}
        </Link>
      ) : (
        <button type="button" className={styles.link}>
          {linkContent}
        </button>
      )}
    </article>
  );
}
