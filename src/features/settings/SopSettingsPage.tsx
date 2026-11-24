import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { DEFAULT_SOP_ID, sopDetail, sopList, sopSettingsPage, type SopDetail } from '@/data/sops';
import { SopEditor } from './SopEditor';
import { SopList } from './SopList';
import styles from './SopSettingsPage.module.css';

/**
 * 12 · Settings — SOP step order (Figma 75:4687) · route /settings/sop.
 * The selected SOP in the list, the step "Required" toggles and the rule toggles are local state.
 * "Save as v3" goes to visit TV-0412 (screen 04), as in the Figma prototype.
 * Only "Unit 3 · Inward" has editor content in Figma, so the editor always shows that SOP.
 */
export function SopSettingsPage() {
  const [selectedId, setSelectedId] = useState(DEFAULT_SOP_ID);
  const [sop, setSop] = useState<SopDetail>(sopDetail);
  const editing = sopList.find((s) => s.id === sop.sopId);

  const setStepRequired = (stepId: string, required: boolean) =>
    setSop((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => (step.id === stepId ? { ...step, required } : step)),
    }));

  const setRule = (ruleId: string, on: boolean) =>
    setSop((prev) => ({
      ...prev,
      rules: prev.rules.map((rule) => (rule.id === ruleId ? { ...rule, on } : rule)),
    }));

  return (
    <AppShell active="Settings" breadcrumb={[...sopSettingsPage.breadcrumb, editing?.name ?? sop.title]}>
      <header className={styles.header}>
        <div className={styles.text}>
          <h1 className={styles.title}>{sopSettingsPage.title}</h1>
          <p className={styles.subtitle}>{sopSettingsPage.subtitle}</p>
        </div>
        <Button label="Version history" variant="Secondary" icon="history" />
        <Button
          label={sopSettingsPage.saveLabel}
          variant="Primary"
          icon="check"
          to={sopSettingsPage.saveTo}
        />
      </header>

      <div className={styles.columns}>
        <SopList items={sopList} selectedId={selectedId} onSelect={setSelectedId} />
        <SopEditor sop={sop} onStepRequiredChange={setStepRequired} onRuleChange={setRule} />
      </div>
    </AppShell>
  );
}
