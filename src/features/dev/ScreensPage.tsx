import { Link } from 'react-router-dom';
import { COMPONENTS_BOARD, SCREENS } from '@/app/screens';
import { Button } from '@/components/ui/Button';
import { useReviewStore } from '@/store/reviewStore';
import styles from './ScreensPage.module.css';

/** Developer page (not in Figma): every screen with its route and Figma link, plus "Reset demo data". */
export function ScreensPage() {
  const { reset } = useReviewStore();
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className="t-heading-1">GateView screens</h1>
          <p className="t-body-s">
            All 15 frames from the Figma page “06 UI screens”. Demo state is kept for this browser tab.
          </p>
        </div>
        <Button label="Reset demo data" variant="Secondary" icon="refresh" onClick={reset} />
      </header>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Screen</th>
            <th>Route</th>
            <th>Figma</th>
          </tr>
        </thead>
        <tbody>
          {SCREENS.map((screen) => (
            <tr key={screen.number}>
              <td className="t-mono-s">{screen.number}</td>
              <td>{screen.name}</td>
              <td>
                <Link className={styles.link} to={screen.route}>
                  {screen.route}
                </Link>
              </td>
              <td>
                <a className={styles.link} href={screen.figma} target="_blank" rel="noreferrer">
                  {screen.node}
                </a>
              </td>
            </tr>
          ))}
          <tr>
            <td className="t-mono-s">C-01</td>
            <td>Components (all variants)</td>
            <td>
              <Link className={styles.link} to="/components">
                /components
              </Link>
            </td>
            <td>
              <a className={styles.link} href={COMPONENTS_BOARD} target="_blank" rel="noreferrer">
                48:83
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
