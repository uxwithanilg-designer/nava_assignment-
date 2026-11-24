import clsx from 'clsx';
import { Icon, type IconName } from '@/components/icons';
import type { ViewerAnswer, ViewerAnswerId, ViewerFact } from '@/data/evidenceViewer';
import styles from './ViewerSide.module.css';

/**
 * Figma "Side" (73:4749): what the AI saw, the step facts, the reviewer's answer and the
 * "images are AI-generated" note pinned to the bottom.
 */
export interface ViewerSideProps {
  aiSaw: string;
  facts: ViewerFact[];
  answers: ViewerAnswer[];
  answer?: ViewerAnswerId;
  onAnswer: (id: ViewerAnswerId) => void;
  answerHelp: string;
  footnote: string;
}

const ANSWER_STYLE: Record<ViewerAnswerId, { icon: IconName; className: string | undefined }> = {
  spraying: { icon: 'check', className: styles.spraying },
  'no-spraying': { icon: 'x', className: styles.noSpraying },
  unclear: { icon: 'eye-off', className: styles.unclear },
};

export function ViewerSide({
  aiSaw,
  facts,
  answers,
  answer,
  onAnswer,
  answerHelp,
  footnote,
}: ViewerSideProps) {
  return (
    <aside className={styles.side} aria-label="Review this clip">
      <h2 className={styles.label}>What the AI saw</h2>
      <p className={styles.aiSaw}>{aiSaw}</p>
      <dl className={styles.facts}>
        {facts.map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <dt className={styles.factLabel}>{fact.label}</dt>
            <dd className={clsx(styles.factValue, fact.warning && styles.warning)}>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <h2 className={styles.label} id="viewer-answer-label">
        What do you see?
      </h2>
      <div className={styles.answers} role="group" aria-labelledby="viewer-answer-label">
        {answers.map((a) => (
          <button
            key={a.id}
            type="button"
            className={clsx(styles.answer, ANSWER_STYLE[a.id].className, answer === a.id && styles.chosen)}
            aria-pressed={answer === a.id}
            onClick={() => onAnswer(a.id)}
          >
            <Icon name={ANSWER_STYLE[a.id].icon} size={16} className={styles.answerIcon} />
            {a.label}
          </button>
        ))}
      </div>
      <p className={styles.help}>{answerHelp}</p>
      <p className={styles.note}>
        <Icon name="info" size={14} />
        <span>{footnote}</span>
      </p>
    </aside>
  );
}
