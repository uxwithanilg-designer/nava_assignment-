import { ModuleTile } from '@/components/data/ModuleTile';
import { modules } from '@/data/overview';
import styles from './ModulesRow.module.css';

/** Modules (72:4451): four "Module tile"s. Only "Open GateView" is a prototype link. */
export function ModulesRow() {
  return (
    <section className={styles.modules} aria-label="Modules">
      {modules.map((m) => (
        <ModuleTile
          key={m.id}
          name={m.name}
          description={m.description}
          icon={m.icon}
          status={m.status}
          value={String(m.value)}
          unit={m.unit}
          review={`${m.needReview} need review`}
          noOwner={`${m.noOwner} no owner`}
          link={m.link}
          to={m.to}
        />
      ))}
    </section>
  );
}
