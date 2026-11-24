import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import type { SopDetail } from '@/data/sops';
import { SopRules } from '../SopRules';
import { SopStepCard } from '../SopStepCard';
import styles from './SopEditor.module.css';

/**
 * Figma "Editor" (75:4927): SOP title + version chip, the "changes apply from tomorrow" notice,
 * the ordered step cards and the "When to ask a person" rules.
 */
export interface SopEditorProps {
  sop: SopDetail;
  onStepRequiredChange: (stepId: string, required: boolean) => void;
  onRuleChange: (ruleId: string, on: boolean) => void;
}

export function SopEditor({ sop, onStepRequiredChange, onRuleChange }: SopEditorProps) {
  return (
    <section className={styles.editor} aria-labelledby="sop-editor-title">
      <div className={styles.head}>
        <h2 id="sop-editor-title" className={styles.title}>
          {sop.title}
        </h2>
        <span className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          {sop.status}
        </span>
        <span className={styles.spacer} />
        <p className={styles.changed}>{sop.changed}</p>
      </div>

      <p className={styles.notice}>
        <Icon name="info" size={16} />
        <span>{sop.notice}</span>
      </p>

      <h3 className={styles.sectionLabel}>Steps, in the order the camera should see them</h3>
      <ol className={styles.steps}>
        {sop.steps.map((step, i) => (
          <SopStepCard
            key={step.id}
            step={step}
            order={i + 1}
            onRequiredChange={(required) => onStepRequiredChange(step.id, required)}
          />
        ))}
      </ol>
      <Button label="Add a step" variant="Ghost" size="S" icon="plus" className={styles.addStep} />

      <hr className={styles.divider} />

      <h3 className={styles.sectionLabel}>When to ask a person</h3>
      <SopRules rules={sop.rules} onToggle={onRuleChange} />
    </section>
  );
}
