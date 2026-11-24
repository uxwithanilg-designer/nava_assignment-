import clsx from 'clsx';
import { StatusChip } from '@/components/ui/StatusChip';
import { Toggle } from '@/components/ui/Toggle';
import type { SopRule } from '@/data/sops';
import styles from './SopRules.module.css';

/**
 * "When to ask a person" (Figma "Rules" 75:5115): one row per rule with a Toggle.
 * Phase 2 rules are greyed out and show the "Phase 2" chip instead of a toggle.
 */
export interface SopRulesProps {
  rules: SopRule[];
  onToggle: (id: string, on: boolean) => void;
}

export function SopRules({ rules, onToggle }: SopRulesProps) {
  return (
    <ul className={styles.rules}>
      {rules.map((rule) => (
        <li key={rule.id} className={clsx(styles.rule, rule.phase2 && styles.phase2)}>
          <div className={styles.text}>
            <p className={styles.title}>{rule.title}</p>
            <p className={styles.description}>{rule.description}</p>
          </div>
          {rule.phase2 ? (
            <StatusChip status="Phase 2" />
          ) : (
            <Toggle on={rule.on} onChange={(on) => onToggle(rule.id, on)} aria-label={rule.title} />
          )}
        </li>
      ))}
    </ul>
  );
}
