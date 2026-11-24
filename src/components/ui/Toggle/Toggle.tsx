import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import styles from './Toggle.module.css';

/**
 * Figma "Toggle" (75:315). Variant On=True / On=False, 36×20.
 * On: action/primary track, knob right. Off: border/default track, knob left.
 * A real switch: role="switch" + aria-checked; give it an aria-label or aria-labelledby.
 */
export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'> {
  /** Figma "On". */
  on: boolean;
  onChange?: (on: boolean) => void;
}

export function Toggle({ on, onChange, className, type = 'button', onClick, ...rest }: ToggleProps) {
  return (
    <button
      type={type}
      role="switch"
      aria-checked={on}
      className={clsx(styles.toggle, on && styles.on, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onChange?.(!on);
      }}
      {...rest}
    >
      <span className={styles.knob} aria-hidden="true" />
    </button>
  );
}
