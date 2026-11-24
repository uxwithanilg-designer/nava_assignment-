import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EvidencePhoto } from '@/components/data/EvidencePhoto';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Drawer } from '@/components/ui/Drawer';
import { Filter } from '@/components/ui/Filter';
import { PersonOption } from '@/components/ui/PersonOption';
import { TextArea } from '@/components/ui/TextArea';
import { people } from '@/data/people';
import {
  ALERT_NAME,
  ASSIGNABLE_PEOPLE,
  assignToastMessage,
  getVisitDetail,
  type VisitDetail,
} from '@/data/visits';
import type { Person } from '@/types/domain';
import { useReviewStore } from '@/store/reviewStore';
import { useCloseOverlay, visitPath, type VisitLocationState } from '../navigation';
import styles from './AssignDrawer.module.css';

/**
 * 05 · Assign drawer (Figma 68:3973), route /gate/visits/:visitId/assign over the visit page.
 * × / Cancel / Esc go back to the visit. "Assign to …" stores the owner and shows the assigned
 * state (06) with its toast.
 */
export function AssignDrawer() {
  const { visitId } = useParams();
  const detail = getVisitDetail(visitId);
  if (!detail) return null;
  return <AssignDrawerContent detail={detail} />;
}

function AssignDrawerContent({ detail }: { detail: VisitDetail }) {
  const navigate = useNavigate();
  const { state, assign } = useReviewStore();
  const onClose = useCloseOverlay(detail.id);
  const { assign: context } = detail;

  const currentOwner = state.visits[detail.id]?.ownerId ?? detail.review.ownerId;
  const [ownerId, setOwnerId] = useState<Person['id']>(currentOwner ?? context.defaultOwnerId);
  const [note, setNote] = useState(context.note);
  const [notify, setNotify] = useState(true);
  const owner = people[ownerId];

  const onAssign = () => {
    assign(detail.id, ownerId, note.trim() || undefined);
    const navState: VisitLocationState = { toast: { message: assignToastMessage(ownerId, notify), undo: true } };
    navigate(visitPath(detail.id), { replace: true, state: navState });
  };

  return (
    <Drawer
      title="Assign for review"
      subtitle={context.context}
      onClose={onClose}
      closeLabel="Close assign drawer"
      footer={
        <>
          <Button label="Cancel" variant="Secondary" onClick={onClose} />
          <Button label={`Assign to ${owner.name}`} icon="user-check" onClick={onAssign} />
        </>
      }
    >
      <div className={styles.body}>
        <div className={styles.summary}>
          <EvidencePhoto
            size="S"
            image={context.summary.photo.image}
            time={context.summary.photo.time}
            alt={context.summary.photo.alt}
            crop={context.summary.photo.crop}
          />
          <div className={styles.summaryText}>
            <p className={styles.summaryTitle}>{context.summary.title}</p>
            <p className={styles.summaryMeta}>{context.summary.text}</p>
          </div>
        </div>
        <fieldset className={styles.people}>
          <legend className={styles.legend}>Who should look at it?</legend>
          <div className={styles.options}>
            {ASSIGNABLE_PEOPLE.map((id) => {
              const person = people[id];
              return (
                <PersonOption
                  key={id}
                  name="assignee"
                  value={id}
                  label={person.isCurrentUser ? `${person.name} (you)` : person.name}
                  initials={person.initials}
                  role={`${person.role} · ${person.scope}`}
                  open={`${person.openCount} open`}
                  selected={id === ownerId}
                  onSelect={() => setOwnerId(id)}
                />
              );
            })}
          </div>
        </fieldset>
        <Filter label="Due by" value={context.due} icon="calendar" className={styles.due} />
        <TextArea label="Note for the reviewer (optional)" value={note} onChange={setNote} />
        <Checkbox label={`Send ${ALERT_NAME[ownerId]} an app and email alert`} checked={notify} onChange={setNotify} />
      </div>
    </Drawer>
  );
}
