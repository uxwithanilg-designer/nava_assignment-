import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getEvidenceViewer, type EvidenceViewerData, type ViewerAnswerId } from '@/data/evidenceViewer';
import { FrameStrip } from './FrameStrip';
import { PlayerControls } from './PlayerControls';
import { Scrubber } from './Scrubber';
import { VideoFrame } from './VideoFrame';
import { ViewerBar } from './ViewerBar';
import { ViewerSide } from './ViewerSide';
import styles from './EvidenceViewerPage.module.css';

/**
 * 11 · Evidence viewer (Figma 73:4594) · /gate/visits/:visitId/evidence/:step.
 * Full-screen dark viewer, no sidebar. Opened from "Watch clip" on the visit page.
 * - "Back to visit" goes back in history, or to the visit page when the viewer was opened directly.
 * - A frame click or ← / → selects a frame (local state); Space or a play button only toggles the icon.
 * - "I can see spraying" opens "Close visit" with reason 1 picked; the other answers are just selected.
 */
export function EvidenceViewerPage() {
  const { visitId, step } = useParams();
  const viewer = getEvidenceViewer(visitId, step);
  if (!viewer) return <Navigate to={visitId ? `/gate/visits/${visitId}` : '/gate'} replace />;
  return <EvidenceViewer viewer={viewer} />;
}

const INTERACTIVE = 'button, a, input, textarea, select, [role="button"], [contenteditable="true"]';

function EvidenceViewer({ viewer }: { viewer: EvidenceViewerData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState(viewer.initialFrame);
  const [playing, setPlaying] = useState(false);
  const [answer, setAnswer] = useState<ViewerAnswerId>();

  const visitPath = `/gate/visits/${viewer.visitId}`;
  const frame = viewer.frames[selected];
  const last = viewer.frames.length - 1;

  const step = useCallback(
    (delta: number) => setSelected((i) => Math.min(last, Math.max(0, i + delta))),
    [last],
  );
  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      const typing = target?.closest('input, textarea, select, [contenteditable="true"]');
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (typing) return;
        event.preventDefault();
        step(event.key === 'ArrowLeft' ? -1 : 1);
      } else if (event.key === ' ' || event.code === 'Space') {
        // A focused button keeps its own Space behaviour.
        if (target?.closest(INTERACTIVE)) return;
        event.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, togglePlay]);

  const onBack = (event: MouseEvent<HTMLAnchorElement>) => {
    // Opened from inside the app: go back. Opened directly (no history entry): follow the link to the visit.
    if (location.key !== 'default') {
      event.preventDefault();
      navigate(-1);
    }
  };

  const onAnswer = (id: ViewerAnswerId) => {
    setAnswer(id);
    if (id === 'spraying') {
      navigate(`${visitPath}/close`, { state: { reasonId: viewer.closeReasonId } });
    }
  };

  return (
    <div className={styles.viewer}>
      <ViewerBar
        visitId={viewer.visitId}
        backTo={visitPath}
        onBack={onBack}
        context={viewer.context}
        quality={viewer.quality}
      />
      <div className={styles.body}>
        <main className={styles.video} aria-label="Camera recording">
          <VideoFrame
            frame={frame}
            camera={viewer.cameraOverlay}
            date={viewer.date}
            illustrativeLabel={viewer.illustrativeLabel}
            playing={playing}
            onTogglePlay={togglePlay}
          />
          <PlayerControls
            time={frame.time}
            range={`of ${viewer.window.start} – ${viewer.window.end}`}
            playing={playing}
            speed={viewer.speed}
            hint={viewer.keyboardHint}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            onTogglePlay={togglePlay}
          />
          <Scrubber
            window={viewer.window}
            ticks={viewer.ticks}
            expected={viewer.expected}
            markers={viewer.markers}
            current={frame.time}
          />
          <FrameStrip frames={viewer.frames} selected={selected} onSelect={setSelected} />
        </main>
        <ViewerSide
          aiSaw={viewer.aiSaw}
          facts={viewer.facts}
          answers={viewer.answers}
          answer={answer}
          onAnswer={onAnswer}
          answerHelp={viewer.answerHelp}
          footnote={viewer.footnote}
        />
      </div>
    </div>
  );
}
