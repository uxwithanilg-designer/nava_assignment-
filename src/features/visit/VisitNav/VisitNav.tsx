import { Link } from 'react-router-dom';
import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import styles from './VisitNav.module.css';

/**
 * Visit nav (Figma 68:2250): "Back to Gate dashboard" · queue position · previous / next visit.
 * Buttons without a prototype link stay plain buttons.
 */
export interface VisitNavProps {
  backTo: string;
  /** "1 of 5 with no owner" */
  position: string;
  prevTo?: string;
  nextTo?: string;
}

export function VisitNav({ backTo, position, prevTo, nextTo }: VisitNavProps) {
  return (
    <nav className={styles.nav} aria-label="Visit navigation">
      <Button label="Back to Gate dashboard" variant="Ghost" size="S" icon="chevron-left" to={backTo} className={styles.back} />
      <span className={styles.spacer} />
      <p className={styles.position}>{position}</p>
      {prevTo ? (
        <Link to={prevTo} className={styles.prev} aria-label="Previous visit">
          <Icon name="chevron-left" size={18} />
        </Link>
      ) : (
        <button type="button" className={styles.prev} aria-label="Previous visit">
          <Icon name="chevron-left" size={18} />
        </button>
      )}
      <Button label="Next visit" variant="Secondary" size="S" icon="chevron-right" to={nextTo} />
    </nav>
  );
}
