import { Panel } from '@/components/layout/Panel';
import { Banner } from '@/components/ui/Banner';
import { TIMELINE_DESCRIPTION, type BannerData, type FootnoteData, type TimelineStepData } from '@/data/visits';
import { TimelineStep } from '../TimelineStep';
import styles from './Timeline.module.css';

/**
 * Panel "What happened, step by step" (Figma 68:2310): optional banner (08 camera blocked,
 * 10 two trucks), the SOP steps in order, optional footnote (09 outward: no disinfection).
 */
export interface TimelineProps {
  steps: TimelineStepData[];
  banner?: BannerData;
  footnote?: FootnoteData;
}

export function Timeline({ steps, banner, footnote }: TimelineProps) {
  return (
    <Panel title="What happened, step by step" description={TIMELINE_DESCRIPTION} className={styles.panel}>
      {banner && (
        <Banner tone={banner.tone} icon={banner.icon} size="M" title={banner.title}>
          {banner.text}
        </Banner>
      )}
      <ol className={styles.steps}>
        {steps.map((step, i) => (
          <TimelineStep key={step.key} step={step} last={i === steps.length - 1} />
        ))}
      </ol>
      {footnote && (
        <Banner tone="subtle" icon={footnote.icon} size="M" iconSize={16} align="center">
          {footnote.text}
        </Banner>
      )}
    </Panel>
  );
}
