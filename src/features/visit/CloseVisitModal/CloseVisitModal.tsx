import { useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { RadioOption } from '@/components/ui/RadioOption';
import { TextArea } from '@/components/ui/TextArea';
import {
  CLOSE_MODAL_DESCRIPTION,
  CLOSE_REASONS,
  isCloseReasonId,
  type CloseReasonId,
} from '@/data/closeReasons';
import { getVisitDetail, type VisitDetail } from '@/data/visits';
import { useReviewStore } from '@/store/reviewStore';
import { useCloseOverlay, visitPath, type VisitLocationState } from '../navigation';
import styles from './CloseVisitModal.module.css';

/**
 * OV · Close with reason (Figma 68:4059), route /gate/visits/:visitId/close over the visit page.
 * The reason is pre-selected from router state (`reasonId`, e.g. from the evidence viewer's
 * "I can see spraying"), otherwise from the visit's suggested reason (TV-0431: "Not evaluable").
 * × / Cancel / Esc close the modal; "Close visit" closes the visit in the demo store and shows the
 * closed state (07 for TV-0412) with its toast.
 */
export function CloseVisitModal() {
  const { visitId } = useParams();
  const detail = getVisitDetail(visitId);
  if (!detail) return null;
  return <CloseVisitModalContent detail={detail} />;
}

interface CloseLocationState {
  reasonId?: unknown;
}

function CloseVisitModalContent({ detail }: { detail: VisitDetail }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { close } = useReviewStore();
  const onCancel = useCloseOverlay(detail.id);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const handed = (location.state as CloseLocationState | null)?.reasonId;
  const [reasonId, setReasonId] = useState<CloseReasonId>(
    isCloseReasonId(handed) ? handed : detail.close.defaultReasonId,
  );
  const [note, setNote] = useState(detail.close.note);
  const [invalid, setInvalid] = useState(false);

  const onConfirm = () => {
    // "What did you see?" is required: the note is what the history and reports keep.
    if (!note.trim()) {
      setInvalid(true);
      noteRef.current?.focus();
      return;
    }
    close(detail.id, reasonId, note.trim());
    const navState: VisitLocationState = { toast: { message: detail.close.toast } };
    navigate(visitPath(detail.id), { replace: true, state: navState });
  };

  return (
    <Modal
      title={`Close visit ${detail.id}`}
      description={CLOSE_MODAL_DESCRIPTION}
      onClose={onCancel}
      closeLabel="Close this window"
      footer={
        <>
          <Button label="Cancel" variant="Secondary" onClick={onCancel} />
          <Button label="Close visit" icon="check" onClick={onConfirm} />
        </>
      }
    >
      <div className={styles.body}>
        <fieldset className={styles.reasons}>
          <legend className="visually-hidden">Reason for closing</legend>
          {CLOSE_REASONS.map((reason) => (
            <RadioOption
              key={reason.id}
              name="close-reason"
              value={reason.id}
              label={reason.label}
              helper={reason.helper?.(detail.close.step)}
              showHelper={reason.id === reasonId && Boolean(reason.helper)}
              selected={reason.id === reasonId}
              onSelect={(value) => setReasonId(value as CloseReasonId)}
            />
          ))}
        </fieldset>
        <TextArea
          ref={noteRef}
          label="What did you see? (required)"
          value={note}
          required
          invalid={invalid}
          onChange={(value) => {
            setNote(value);
            if (invalid && value.trim()) setInvalid(false);
          }}
        />
        <p className={styles.info}>
          <Icon name="info" size={16} color="var(--text-link)" />
          <span>{detail.close.info}</span>
        </p>
      </div>
    </Modal>
  );
}
