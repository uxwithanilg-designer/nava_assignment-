import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from '@/components/icons';
import { CoverageBar, type CoverageSegments } from '@/components/charts/CoverageBar';
import { MiniBars } from '@/components/charts/MiniBars';
import styles from './KpiCard.module.css';

/**
 * Figma "KPI card" (81:395). Type: Count · Coverage · Coverage hidden · Review.
 * Order inside the card: head (icon + badge) · label · value row · caption · bar · spark · footnote · link.
 * "Coverage hidden" is used when getCoverageDisplay() says the base is not reliable (see lib/coverage.ts).
 */
export type KpiCardType = 'Count' | 'Coverage' | 'Coverage hidden' | 'Review';

export type KpiBadgeTone = 'neutral' | 'hidden' | 'attention';

export interface KpiBadge {
  text: string;
  /** neutral: delta pill (+6) · hidden: violet "% hidden" with info icon · attention: orange "5 no owner". */
  tone?: KpiBadgeTone;
}

export interface KpiCardProps {
  type: KpiCardType;
  icon: IconName;
  label: string;
  value: string;
  unit?: string;
  badge?: KpiBadge;
  /** Body/XS line under the value ("42 of 45 judged", "9 already have an owner"). */
  caption?: ReactNode;
  bar?: CoverageSegments & { total?: number };
  spark?: number[];
  /** Index of the highlighted spark bar (03: selected hour). */
  sparkHighlight?: number;
  /** Spark bar colour (a token). Defaults to chart/1; outward cards use chart/2. */
  sparkColor?: string;
  /** Last Body/XS line ("vs last Monday, same time · by hour", "3 not seen · 3 not judged", hidden reason). */
  footnote?: ReactNode;
  link?: { label: string; to?: string };
  className?: string;
}

const DEFAULT_BADGE_TONE: Record<KpiCardType, KpiBadgeTone> = {
  Count: 'neutral',
  Coverage: 'neutral',
  'Coverage hidden': 'hidden',
  Review: 'attention',
};

export function KpiCard({
  type,
  icon,
  label,
  value,
  unit,
  badge,
  caption,
  bar,
  spark,
  sparkHighlight,
  sparkColor,
  footnote,
  link,
  className,
}: KpiCardProps) {
  const tone = badge?.tone ?? DEFAULT_BADGE_TONE[type];
  const typeClass = {
    Count: styles.count,
    Coverage: styles.coverage,
    'Coverage hidden': styles.hidden,
    Review: styles.review,
  }[type];
  return (
    <article className={clsx(styles.card, typeClass, className)}>
      <div className={styles.head}>
        <span className={styles.iconBox}>
          <Icon name={icon} size={15} />
        </span>
        <span className={styles.spacer} />
        {badge && (
          <span
            className={clsx(
              styles.badge,
              { neutral: styles.badgeNeutral, hidden: styles.badgeHidden, attention: styles.badgeAttention }[tone],
            )}
          >
            {tone === 'hidden' && <Icon name="info" size={12} />}
            {badge.text}
          </span>
        )}
      </div>
      <p className={styles.label}>{label}</p>
      <p className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </p>
      {caption && <p className={styles.caption}>{caption}</p>}
      {bar && <CoverageBar {...bar} />}
      {spark && <MiniBars values={spark} highlight={sparkHighlight} color={sparkColor} />}
      {footnote && <p className={styles.footnote}>{footnote}</p>}
      {link &&
        (link.to ? (
          <Link to={link.to} className={styles.link}>
            {link.label}
          </Link>
        ) : (
          <button type="button" className={styles.link}>
            {link.label}
          </button>
        ))}
    </article>
  );
}
