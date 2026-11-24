import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from '@/components/icons';
import styles from './Button.module.css';

/**
 * Figma "Button" (48:145). Type Primary / Secondary / Ghost × Size M / S.
 * The Figma "Type" property is exposed as `variant` (`type` is the HTML button attribute).
 * Pass `to` to render a router link (prototype navigation), otherwise it is a <button>.
 */
export type ButtonVariant = 'Primary' | 'Secondary' | 'Ghost';
export type ButtonSize = 'M' | 'S';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Figma "Show icon" + "Icon". */
  icon?: IconName;
  /** Icon on the right of the label (used by "Next visit" and similar). */
  iconRight?: IconName;
  /** Router destination. When set the button renders as <Link>. */
  to?: string;
  /** Replace the current history entry when navigating (drawer/modal routes). */
  replace?: boolean;
  /** Router state forwarded to <Link>. */
  state?: unknown;
}

export function Button({
  label,
  variant = 'Primary',
  size = 'M',
  icon,
  iconRight,
  to,
  replace,
  state,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const cls = clsx(styles.button, styles[variant.toLowerCase()], styles[`size${size}`], className);
  const content = (
    <>
      {icon && <Icon name={icon} size={16} />}
      <span className={styles.label}>{label}</span>
      {iconRight && <Icon name={iconRight} size={16} />}
    </>
  );
  if (to) {
    return (
      <Link
        to={to}
        replace={replace}
        state={state}
        className={cls}
        onClick={rest.onClick as never}
        aria-label={rest['aria-label']}
      >
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} {...rest}>
      {content}
    </button>
  );
}
