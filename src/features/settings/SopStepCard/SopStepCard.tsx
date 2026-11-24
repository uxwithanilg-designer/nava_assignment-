import { Icon } from '@/components/icons';
import { Filter } from '@/components/ui/Filter';
import { IconButton } from '@/components/ui/IconButton';
import { Toggle } from '@/components/ui/Toggle';
import type { SopStepConfig } from '@/data/sops';
import styles from './SopStepCard.module.css';

/**
 * One step of the SOP editor (Figma "Step 1 · Approach" 75:4942 and siblings):
 * drag handle · order number · step icon · title, description, rule tags, camera select · Required toggle · more.
 */
export interface SopStepCardProps {
  step: SopStepConfig;
  order: number;
  onRequiredChange: (required: boolean) => void;
}

export function SopStepCard({ step, order, onRequiredChange }: SopStepCardProps) {
  return (
    <li className={styles.card}>
      <Icon name="grid" size={16} className={styles.handle} />
      <span className={styles.order}>{order}</span>
      <span className={styles.iconBox}>
        <Icon name={step.icon} size={18} />
      </span>
      <div className={styles.body}>
        <h3 className={styles.title}>{step.title}</h3>
        <p className={styles.description}>{step.description}</p>
        <ul className={styles.tags} aria-label={`${step.title} rules`}>
          {step.tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
        <Filter
          label="Camera"
          value={step.camera}
          icon="cctv"
          aria-label={`Camera for ${step.title}: ${step.camera}`}
        />
      </div>
      <label className={styles.required}>
        <Toggle on={step.required} onChange={onRequiredChange} aria-label={`${step.title} is required`} />
        <span>Required</span>
      </label>
      <IconButton icon="more" aria-label={`More options for ${step.title}`} />
    </li>
  );
}
