import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { Icon } from '@/components/icons';
import { Panel } from '@/components/layout/Panel';
import { needsPersonTrend } from '@/data/overview';
import styles from './NeedsPersonTrendPanel.module.css';

/** Panel "Visits that needed a person, last 7 days" (72:4774): legend, 3-line trend, insight note. */
export function NeedsPersonTrendPanel() {
  const t = needsPersonTrend;
  return (
    <Panel title={t.title} description={t.description} className={styles.panel}>
      <TrendLineChart series={t.series} xLabels={t.days} yTicks={t.yTicks} />
      <p className={styles.insight}>
        <Icon name="lightbulb" size={16} />
        <span className={styles.insightText}>{t.insight}</span>
      </p>
    </Panel>
  );
}
