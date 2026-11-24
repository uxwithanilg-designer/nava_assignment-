/**
 * Screen 11 · Evidence viewer (Figma 73:4594) · /gate/visits/TV-0412/evidence/disinfection.
 * Opened from "Watch clip". The images are illustrative, AI-generated stills (no real video):
 * the frame strip switches the big still and the time, and play only toggles the play/pause icon.
 * A missing or unclear step always shows the camera recording for that time window, never a made-up photo.
 */
import type { EvidenceImageKey } from '@/data/evidenceImages';
import type { EvidenceQualityValue } from '@/types/domain';

export interface ViewerFrame {
  /** "07:39:40" */
  time: string;
  image: EvidenceImageKey;
  alt: string;
}

export interface ViewerMarker {
  /** Time the marker line sits at, "07:38:02". */
  at: string;
  label: string;
  tone: 'observed' | 'neutral';
}

export interface ViewerFact {
  label: string;
  value: string;
  /** Amber text on the dark panel for camera / quality problems. */
  warning?: boolean;
}

export type ViewerAnswerId = 'spraying' | 'no-spraying' | 'unclear';

export interface ViewerAnswer {
  id: ViewerAnswerId;
  label: string;
}

export interface EvidenceViewerData {
  visitId: string;
  step: string;
  /** "Disinfection · CAM 02 · Spray arch · Main gate" */
  context: string;
  quality: EvidenceQualityValue;
  /** Overlay pills on the big frame. */
  cameraOverlay: string;
  date: string;
  illustrativeLabel: string;
  /** Recording window shown on the scrubber. */
  window: { start: string; end: string };
  /** Tick labels under the scrubber. */
  ticks: string[];
  /** Shaded "spray should happen here" window. */
  expected: { start: string; end: string; label: string; labelAt: string };
  markers: ViewerMarker[];
  frames: ViewerFrame[];
  /** Index of the frame selected when the viewer opens. */
  initialFrame: number;
  speed: string;
  keyboardHint: string;
  aiSaw: string;
  facts: ViewerFact[];
  answers: ViewerAnswer[];
  answerHelp: string;
  footnote: string;
  /** Reason pre-selected in "Close visit" when the reviewer can see spraying. */
  closeReasonId: string;
}

const frame = (time: string): ViewerFrame => ({
  time,
  image: 'haze-spray-inward',
  alt: `CAM 02 spray arch at ${time}, mist`,
});

const VIEWERS: Record<string, EvidenceViewerData> = {
  'TV-0412/disinfection': {
    visitId: 'TV-0412',
    step: 'disinfection',
    context: 'Disinfection · CAM 02 · Spray arch · Main gate',
    quality: 'Low visibility',
    cameraOverlay: 'CAM 02 · MAIN GATE · SPRAY ARCH',
    date: '23 NOV 2026',
    illustrativeLabel: 'ILLUSTRATIVE IMAGE',
    window: { start: '07:36:00', end: '07:44:00' },
    ticks: ['07:36', '07:37', '07:38', '07:39', '07:40', '07:41', '07:42', '07:43', '07:44'],
    expected: { start: '07:38:00', end: '07:42:18', label: 'Spray should happen here', labelAt: '07:39:45' },
    markers: [
      { at: '07:38:02', label: 'Inspection 07:38', tone: 'observed' },
      { at: '07:42:18', label: 'Entry 07:42', tone: 'neutral' },
    ],
    frames: ['07:38:30', '07:39:05', '07:39:40', '07:40:15', '07:40:50', '07:41:56'].map(frame),
    initialFrame: 2,
    speed: 'Speed 1×',
    keyboardHint: '← → one frame · Space to play',
    aiSaw:
      'Mist and haze cover the spray arch from 07:36. The AI could not see if the tyres were sprayed before entry.',
    facts: [
      { label: 'Step', value: 'Disinfection, before entry' },
      { label: 'Expected', value: '07:38 – 07:42:18' },
      { label: 'Quality', value: 'Low visibility', warning: true },
      { label: 'Camera', value: 'Partial view since 06:00', warning: true },
    ],
    answers: [
      { id: 'spraying', label: 'I can see spraying' },
      { id: 'no-spraying', label: 'No spraying' },
      { id: 'unclear', label: 'Still unclear' },
    ],
    answerHelp:
      'Your answer opens “Close visit” with the right reason already picked. You can still change it.',
    footnote:
      'Images are AI-generated for this design. Real clips come from Sakku’s cameras. Faces and number plates are never read.',
    closeReasonId: 'observed-on-review',
  },
};

export function getEvidenceViewer(visitId: string | undefined, step: string | undefined) {
  return VIEWERS[`${visitId}/${step}`];
}

/** "07:39:40" → seconds since midnight. */
export function toSeconds(time: string): number {
  const [h = 0, m = 0, s = 0] = time.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}
