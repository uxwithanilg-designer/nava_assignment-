import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './StateExample.module.css';

/** One labelled example on screen 13: brand Label/M heading + Body/XS caption, then the state itself. */
export interface StateExampleProps {
  label: string;
  caption: string;
  className?: string;
  children: ReactNode;
}

export function StateExample({ label, caption, className, children }: StateExampleProps) {
  return (
    <section className={clsx(styles.example, className)} aria-label={label}>
      <div className={styles.head}>
        <h2 className={styles.label}>{label}</h2>
        <p className={styles.caption}>{caption}</p>
      </div>
      {children}
    </section>
  );
}
