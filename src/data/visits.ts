/**
 * Visit detail pages (screens 04–10 + OV). Every value is copied from the Figma frames:
 * 04 TV-0412 (68:2109) · 06 assigned (68:2657) · 07 closed (68:3214) · 08 TV-0431 (69:2535)
 * 09 TV-0419 (69:3087) · 10 TV-0438 / TV-0439 (69:3539).
 *
 * Rules kept in this data:
 * - A camera problem (blocked, low visibility) is not a violation: the step becomes "Needs review" /
 *   "Camera blocked" (violet / slate) and stays out of the coverage %.
 * - A missing step shows the camera recording for that time window, never a made-up photo.
 * - Wording talks about the step, never blames a person. "Observed", never "Verified".
 * - Visit IDs are temporary; number plates and Focus PO / gate-pass checks are Phase 2.
 */
import type { IconName } from '@/components/icons';
import type { CloseReasonId } from '@/data/closeReasons';
import type { EvidenceImageKey } from '@/data/evidenceImages';
import type {
  Direction,
  Evidence,
  EvidenceQualityValue,
  HistoryEntry,
  LinkStatus,
  Person,
  StepKey,
  StepResult,
} from '@/types/domain';

/* ------------------------------------------------------------------ types */

/** Colour family of a timeline step icon (status colours only). */
export type StepTone = 'observed' | 'review' | 'missing' | 'obstructed';

export interface StatusLabel {
  status: StepResult;
  /** Longer Figma label, e.g. "Needs review · camera blocked". */
  label?: string;
}

export interface HeaderChip {
  icon: IconName;
  label: string;
  /** Prototype link (the SOP chip goes to screen 12). */
  to?: string;
}

export interface CameraRecordingData {
  /** "Camera recording 07:38–07:42 · 4 min" */
  label: string;
  /** "Watch clip" destination (screen 11). Without it the button stays a plain button. */
  clipTo?: string;
  frames: Evidence[];
  note: string;
}

export interface TimelineStepData {
  key: StepKey;
  title: string;
  icon: IconName;
  tone: StepTone;
  result: StatusLabel;
  /** Mono time or time window. */
  time: string;
  description: string;
  /** Camera id from data/cameras.ts. */
  cameraId: string;
  quality?: EvidenceQualityValue;
  /** "Confirmed by Emily C at 14:52" (07). */
  confirmedBy?: string;
  photos?: Evidence[];
  recording?: CameraRecordingData;
}

export interface BannerData {
  tone: 'obstructed' | 'review';
  icon: IconName;
  title: string;
  text: string;
}

export interface FootnoteData {
  icon: IconName;
  text: string;
}

export type ReviewActionKind = 'assign' | 'close' | 'reassign' | 'reopen' | 'report-camera';

export interface ReviewActionData {
  kind: ReviewActionKind;
  label: string;
  icon: IconName;
  variant: 'Primary' | 'Secondary';
}

export interface ReviewPanelData {
  status: StatusLabel;
  /** Without an owner the panel shows the orange "No owner" tag. */
  ownerId?: Person['id'];
  /** Third row: "Due · Today, 18:00" or "Closed · Today, 14:52". */
  detail: { label: string; value: string };
  tip?: string;
  /** Closed visits: the reason label and the reviewer's note. */
  closure?: { reason: string; note: string };
  actions: ReviewActionData[];
  history: HistoryEntry[];
}

export interface LinkCandidate {
  visitId: string;
  /** "Entry 10:12" */
  entry: string;
  photo: Evidence;
}

export interface LinkPanelData {
  status: LinkStatus;
  text: string;
  /** "Confirm link" + "Flag wrong link". */
  showConfirmActions?: boolean;
  /** "Which truck?" candidates (10): one button per truck, "It is TV-0438". */
  candidates?: LinkCandidate[];
}

export interface CameraRowData {
  cameraId: string;
  tone: 'live' | 'attention';
  /** "Live", "Partial view", "Blocked 09:14–09:22". */
  status: string;
}

export interface CamerasPanelData {
  rows: CameraRowData[];
  note: { tone: 'attention' | 'subtle'; text: string };
}

export interface AssignContext {
  /** "TV-0412 · Inward · Main gate · disinfection needs review" */
  context: string;
  summary: { photo: Evidence; title: string; text: string };
  due: string;
  /** Pre-filled note for the reviewer (optional field). */
  note: string;
  /** Person selected when the drawer opens. */
  defaultOwnerId: Person['id'];
}

export interface CloseContext {
  /** Step name used in reason 1's helper ("Disinfection will show as …"). */
  step: string;
  defaultReasonId: CloseReasonId;
  /** Pre-filled "What did you see?" note. */
  note: string;
  /** Info box above the modal footer. */
  info: string;
  /** Toast after closing (07). */
  toast: string;
}

/** The parts of a visit page that change with the review state. */
export interface VisitView {
  status: StatusLabel;
  heading: string;
  body: string;
  steps: TimelineStepData[];
  review: ReviewPanelData;
  link: LinkPanelData;
  /** "Next visit" destination for this state. */
  nextTo?: string;
}

export interface VisitDetail extends VisitView {
  id: string;
  direction: Direction;
  breadcrumb: string[];
  /** "1 of 5 with no owner" */
  position: string;
  prevTo?: string;
  chips: HeaderChip[];
  banner?: BannerData;
  footnote?: FootnoteData;
  cameras: CamerasPanelData;
  assign: AssignContext;
  close: CloseContext;
  /** Exact Figma states this visit reaches through the review flow (TV-0412: 06 and 07). */
  states?: {
    assigned?: { ownerId: Person['id']; view: Partial<VisitView> };
    closed?: { ownerId: Person['id']; reasonId: CloseReasonId; view: Partial<VisitView> };
  };
}

/* --------------------------------------------------------------- constants */

/** Demo clock for review actions (Figma: assigned 14:31, closed 14:52). */
export const DEMO_TIMES = { assignedAt: '14:31', closedAt: '14:52', closedLabel: 'Today, 14:52' } as const;

export const TIMELINE_DESCRIPTION = 'In the order the SOP expects. Each step shows its camera, its time and its proof.';

/** Description of the "Which truck?" panel. */
export const LINK_DESCRIPTION = 'The AI links each step to one visit. You can confirm the link or fix it.';

export const PHASE_2_NOTE =
  'Temporary visit ID · number plate (ANPR) and Focus PO / gate-pass checks come in Phase 2';

/** Toast after assigning (06). Without the alert only the first sentence shows. */
export const ASSIGN_TOAST: Record<Person['id'], { assigned: string; notified: string }> = {
  emily: { assigned: 'Assigned to Emily C.', notified: 'She will get a notification.' },
  sarah: { assigned: 'Assigned to Dr Sarah J.', notified: 'She will get a notification.' },
  ryan: { assigned: 'Assigned to you.', notified: 'You will get a notification.' },
  david: { assigned: 'Assigned to David B.', notified: 'He will get a notification.' },
};

export function assignToastMessage(ownerId: Person['id'], notified: boolean): string {
  const toast = ASSIGN_TOAST[ownerId];
  return notified ? `${toast.assigned} ${toast.notified}` : toast.assigned;
}

/** "Send Emily an app and email alert" */
export const ALERT_NAME: Record<Person['id'], string> = {
  emily: 'Emily',
  sarah: 'Sarah',
  ryan: 'yourself',
  david: 'David',
};

/** People offered in the assign drawer, in Figma order. */
export const ASSIGNABLE_PEOPLE: Person['id'][] = ['emily', 'sarah', 'ryan'];

/* ----------------------------------------------------------------- helpers */

const CLIP_TV0412 = '/gate/visits/TV-0412/evidence/disinfection';
const SOP_ROUTE = '/settings/sop';

const ALT: Record<EvidenceImageKey, string> = {
  'haze-spray-inward': 'mist over the spray arch',
  'outward-exit-no-guard': 'truck at the gate line',
  'camera-blocked': 'view blocked by a parked truck',
  'late-spray': 'truck in the spray arch',
  'two-trucks-guard': 'guard in a vest next to two trucks',
};

function photo(image: EvidenceImageKey, time: string, camera: string): Evidence {
  return { image, time, alt: `${camera} at ${time}, ${ALT[image]}` };
}

function inwardChips(entry: string): HeaderChip[] {
  return [
    { icon: 'arrow-down-left', label: 'Inward visit' },
    { icon: 'gate', label: 'Main gate' },
    { icon: 'clock', label: `Mon 23 Nov · entry ${entry}` },
    { icon: 'workflow', label: 'SOP: Unit 3 · Inward v2', to: SOP_ROUTE },
  ];
}

const ACTION = {
  assign: { kind: 'assign', label: 'Assign', icon: 'user-check', variant: 'Primary' },
  closeSecondary: { kind: 'close', label: 'Close visit', icon: 'check', variant: 'Secondary' },
  closePrimary: { kind: 'close', label: 'Close visit', icon: 'check', variant: 'Primary' },
  reassign: { kind: 'reassign', label: 'Reassign', icon: 'users', variant: 'Secondary' },
  reopen: { kind: 'reopen', label: 'Reopen', icon: 'refresh', variant: 'Secondary' },
  reportCamera: { kind: 'report-camera', label: 'Report camera', icon: 'camera-off', variant: 'Secondary' },
} satisfies Record<string, ReviewActionData>;

/** Actions after an owner is set (06, 10). */
export const ASSIGNED_ACTIONS: ReviewActionData[] = [ACTION.closePrimary, ACTION.reassign];
/** Actions on a closed visit (07). */
export const CLOSED_ACTIONS: ReviewActionData[] = [ACTION.reopen];

const DUE_TODAY = { label: 'Due', value: 'Today, 18:00' };

const MAIN_GATE_CAMERAS: CamerasPanelData = {
  rows: [
    { cameraId: 'cam01-out', tone: 'live', status: 'Live' },
    { cameraId: 'cam02', tone: 'attention', status: 'Partial view' },
    { cameraId: 'cam03', tone: 'live', status: 'Live' },
  ],
  note: {
    tone: 'attention',
    text: 'AI check status: inspection validated. The spray check is still being validated for this camera angle, so a person confirms unclear cases.',
  },
};

/* ------------------------------------------------------------ TV-0412 (04) */

const TV0412_STEPS: TimelineStepData[] = [
  {
    key: 'approach',
    title: 'Approach',
    icon: 'truck',
    tone: 'observed',
    result: { status: 'Observed' },
    time: '07:36:10',
    description: 'Vehicle stopped before the outer gate.',
    cameraId: 'cam01-out',
    photos: [photo('haze-spray-inward', '07:36:10', 'CAM 01 outside gate')],
  },
  {
    key: 'inspection',
    title: 'Security inspection',
    icon: 'vest',
    tone: 'observed',
    result: { status: 'Observed' },
    time: '07:38:02',
    description: 'A person in the security vest was next to the vehicle for 1 min 40 s.',
    cameraId: 'cam01-out',
    quality: 'Good',
    photos: [
      photo('two-trucks-guard', '07:38:02', 'CAM 01 outside gate'),
      photo('two-trucks-guard', '07:39:10', 'CAM 01 outside gate'),
    ],
  },
  {
    key: 'disinfection',
    title: 'Disinfection',
    icon: 'droplets',
    tone: 'review',
    result: { status: 'Needs review' },
    time: '07:38 – 07:42',
    description: 'Spraying should happen before the truck goes in at 07:42.',
    cameraId: 'cam02',
    quality: 'Low visibility',
    recording: {
      label: 'Camera recording 07:38–07:42 · 4 min',
      clipTo: CLIP_TV0412,
      frames: ['07:38:30', '07:39:40', '07:40:50', '07:41:56'].map((t) =>
        photo('haze-spray-inward', t, 'CAM 02 spray arch'),
      ),
      note: 'Mist covers the spray arch in these frames. We show the camera recording for this time, never a made-up photo.',
    },
  },
  {
    key: 'entry',
    title: 'Entry',
    icon: 'gate',
    tone: 'observed',
    result: { status: 'Observed' },
    time: '07:42:18',
    description: 'Vehicle crossed the gate line. The other steps are checked against this time.',
    cameraId: 'cam03',
    photos: [photo('outward-exit-no-guard', '07:42:18', 'CAM 03 gate line')],
  },
];

const TV0412_HISTORY: HistoryEntry[] = [
  { time: '07:43', text: 'AI flagged it: spray not clear because of low visibility' },
  { time: '07:43', text: 'Added to “Needs attention”, no owner yet' },
];

const TV0412: VisitDetail = {
  id: 'TV-0412',
  direction: 'Inward',
  breadcrumb: ['GateView', 'Unit 3 · Today', 'TV-0412'],
  position: '1 of 5 with no owner',
  nextTo: '/gate/visits/TV-0419',
  chips: inwardChips('07:42'),
  status: { status: 'Needs review' },
  heading: 'Disinfection was not clearly seen before entry',
  body: 'Mist on the spray-arch camera hid the spray between 07:38 and 07:42. The AI could not decide, so a person needs to watch the clip.',
  steps: TV0412_STEPS,
  review: {
    status: { status: 'Needs review' },
    detail: DUE_TODAY,
    tip: 'Watch the 4-minute clip first. Most mist cases can be decided in under a minute.',
    actions: [ACTION.assign, ACTION.closeSecondary],
    history: TV0412_HISTORY,
  },
  link: {
    status: 'Auto-matched',
    text: 'All four steps are linked to TV-0412. No other vehicle was at Main gate between 07:30 and 07:50.',
    showConfirmActions: true,
  },
  cameras: MAIN_GATE_CAMERAS,
  assign: {
    context: 'TV-0412 · Inward · Main gate · disinfection needs review',
    summary: {
      photo: photo('haze-spray-inward', '07:41:56', 'CAM 02 spray arch'),
      title: 'Disinfection not clearly seen before entry',
      text: 'Camera recording 07:38–07:42 · low visibility',
    },
    due: 'Today, 18:00',
    note: 'Please check the spray clip from 07:38 to 07:42. Mist on CAM 02 again this morning.',
    defaultOwnerId: 'emily',
  },
  close: {
    step: 'Disinfection',
    defaultReasonId: 'observed-on-review',
    note: 'Spray visible at 07:39 when zoomed in. Mist made it hard for the AI.',
    info: 'After closing, Entry-disinfection coverage updates and the visit leaves the needs-attention list.',
    toast: 'Visit closed. Entry-disinfection coverage is updated.',
  },
  states: {
    // 06 · Assigned, ready to close
    assigned: {
      ownerId: 'emily',
      view: {
        review: {
          status: { status: 'Needs review' },
          ownerId: 'emily',
          detail: DUE_TODAY,
          actions: ASSIGNED_ACTIONS,
          history: [
            { time: '14:31', text: 'Ryan M assigned it to Emily C. Note: “Please check the spray clip.”' },
            ...TV0412_HISTORY,
          ],
        },
      },
    },
    // 07 · Closed with a reason
    closed: {
      ownerId: 'emily',
      reasonId: 'observed-on-review',
      view: {
        status: { status: 'Observed', label: 'Closed · observed on review' },
        heading: 'Disinfection was seen on review, before entry',
        body: 'Emily C watched the clip and saw the spray at 07:39. The visit is closed and the coverage numbers now include it.',
        nextTo: '/gate/visits/TV-0431',
        steps: TV0412_STEPS.map((step) =>
          step.key !== 'disinfection'
            ? step
            : {
                ...step,
                tone: 'observed',
                result: { status: 'Observed', label: 'Observed · confirmed by reviewer' },
                time: '07:39:40',
                confirmedBy: 'Confirmed by Emily C at 14:52',
                recording: step.recording && {
                  ...step.recording,
                  note: 'The AI could not decide because of mist. A reviewer watched the clip and saw spraying at 07:39, before entry.',
                },
              },
        ),
        review: {
          status: { status: 'Observed', label: 'Closed' },
          ownerId: 'emily',
          detail: { label: 'Closed', value: DEMO_TIMES.closedLabel },
          closure: {
            reason: 'Confirmed: activity observed on review',
            note: 'Spray visible at 07:39 when zoomed in. Mist made it hard for the AI.',
          },
          actions: CLOSED_ACTIONS,
          history: [
            { time: '14:52', text: 'Emily C closed it: activity observed on review' },
            { time: '14:31', text: 'Ryan M assigned it to Emily C' },
            TV0412_HISTORY[0],
          ],
        },
        link: {
          status: 'Confirmed by reviewer',
          text: 'Emily C confirmed all four steps belong to TV-0412.',
        },
      },
    },
  },
};

/* ------------------------------------------------------------ TV-0431 (08) */

const TV0431: VisitDetail = {
  id: 'TV-0431',
  direction: 'Inward',
  breadcrumb: ['GateView', 'Unit 3 · Today', 'TV-0431'],
  position: '4 of 5 with no owner',
  nextTo: '/gate',
  chips: inwardChips('09:20'),
  status: { status: 'Needs review', label: 'Needs review · camera blocked' },
  heading: 'The spray camera was blocked, so disinfection could not be judged',
  body: 'A parked truck stood in front of CAM 02 from 09:14 to 09:22. This is a camera problem, not a violation, so it is left out of the coverage %.',
  banner: {
    tone: 'obstructed',
    icon: 'camera-off',
    title: 'Not a violation',
    text: '“Camera blocked” means the AI could not see. Nobody is blamed, and the visit stays out of the coverage % until a person decides.',
  },
  steps: [
    {
      key: 'approach',
      title: 'Approach',
      icon: 'truck',
      tone: 'observed',
      result: { status: 'Observed' },
      time: '09:14:40',
      description: 'Vehicle stopped before the outer gate.',
      cameraId: 'cam01-out',
      photos: [photo('outward-exit-no-guard', '09:14:40', 'CAM 01 outside gate')],
    },
    {
      key: 'inspection',
      title: 'Security inspection',
      icon: 'vest',
      tone: 'observed',
      result: { status: 'Observed' },
      time: '09:16:05',
      description: 'A person in the security vest was next to the vehicle for 1 min 10 s.',
      cameraId: 'cam01-out',
      quality: 'Good',
      photos: [photo('two-trucks-guard', '09:16:05', 'CAM 01 outside gate')],
    },
    {
      key: 'disinfection',
      title: 'Disinfection',
      icon: 'droplets',
      tone: 'obstructed',
      result: { status: 'Camera blocked' },
      time: '09:16 – 09:20',
      description: 'Spraying should happen before the truck goes in at 09:20.',
      cameraId: 'cam02',
      quality: 'Camera blocked',
      recording: {
        label: 'Camera recording 09:16–09:20 · 4 min',
        frames: ['09:16:30', '09:17:40', '09:18:50', '09:19:55'].map((t) =>
          photo('camera-blocked', t, 'CAM 02 spray arch'),
        ),
        note: 'The view is blocked in every frame. Last clear frame from this camera: 09:13:52.',
      },
    },
    {
      key: 'entry',
      title: 'Entry',
      icon: 'gate',
      tone: 'observed',
      result: { status: 'Observed' },
      time: '09:20:11',
      description: 'Vehicle crossed the gate line.',
      cameraId: 'cam03',
      photos: [photo('outward-exit-no-guard', '09:20:11', 'CAM 03 gate line')],
    },
  ],
  review: {
    status: { status: 'Needs review' },
    detail: DUE_TODAY,
    tip: 'Suggested reason: “Not evaluable: camera or visibility issue”. You can also report the camera to maintenance.',
    actions: [ACTION.closePrimary, ACTION.reportCamera],
    history: [
      { time: '09:21', text: 'AI flagged it: spray camera blocked' },
      { time: '09:21', text: 'Camera health: CAM 02 blocked 09:14–09:22' },
    ],
  },
  link: {
    status: 'Auto-matched',
    text: 'All steps are linked to TV-0431. No other vehicle was near it at the gate.',
    showConfirmActions: true,
  },
  cameras: {
    ...MAIN_GATE_CAMERAS,
    rows: [
      { cameraId: 'cam01-out', tone: 'live', status: 'Live' },
      { cameraId: 'cam02', tone: 'attention', status: 'Blocked 09:14–09:22' },
      { cameraId: 'cam03', tone: 'live', status: 'Live' },
    ],
  },
  assign: {
    context: 'TV-0431 · Inward · Main gate · spray camera blocked',
    summary: {
      photo: photo('camera-blocked', '09:19:55', 'CAM 02 spray arch'),
      title: 'Spray camera blocked by a parked truck',
      text: 'Camera recording 09:16–09:20 · camera blocked',
    },
    due: 'Today, 18:00',
    note: '',
    defaultOwnerId: 'emily',
  },
  close: {
    step: 'Disinfection',
    defaultReasonId: 'not-evaluable',
    note: '',
    info: 'After closing, Entry-disinfection coverage updates and the visit leaves the needs-attention list.',
    toast: 'Visit closed. Entry-disinfection coverage is updated.',
  },
};

/* ------------------------------------------------------------ TV-0419 (09) */

const TV0419: VisitDetail = {
  id: 'TV-0419',
  direction: 'Outward',
  breadcrumb: ['GateView', 'Unit 3 · Today', 'TV-0419'],
  position: '2 of 5 with no owner',
  prevTo: '/gate/visits/TV-0412',
  nextTo: '/gate/visits/TV-0431',
  chips: [
    { icon: 'arrow-up-right', label: 'Outward visit' },
    { icon: 'gate', label: 'Main gate' },
    { icon: 'clock', label: 'Mon 23 Nov · exit 08:15' },
    { icon: 'workflow', label: 'SOP: Unit 3 · Outward v1', to: SOP_ROUTE },
  ],
  status: { status: 'Not observed' },
  heading: 'Inspection was not seen before exit',
  body: 'The camera had a clear view from 08:09 to 08:15. No person in the security vest came near the vehicle before it left.',
  steps: [
    {
      key: 'inspection',
      title: 'Security inspection',
      icon: 'vest',
      tone: 'missing',
      result: { status: 'Not observed' },
      time: '08:09 – 08:15',
      description: 'The check should happen before the vehicle crosses the gate line.',
      cameraId: 'cam01-in',
      quality: 'Good',
      recording: {
        label: 'Camera recording 08:09–08:15 · 6 min',
        frames: ['08:10:05', '08:11:30', '08:13:00', '08:14:40'].map((t) =>
          photo('outward-exit-no-guard', t, 'CAM 01 inside gate'),
        ),
        note: 'Clear view in all frames, and no person in the vest near the vehicle. This is the recording for the missing step, not a made-up photo.',
      },
    },
    {
      key: 'exit',
      title: 'Exit',
      icon: 'gate',
      tone: 'observed',
      result: { status: 'Observed' },
      time: '08:15:02',
      description: 'Vehicle crossed the gate line going out.',
      cameraId: 'cam03',
      photos: [photo('outward-exit-no-guard', '08:15:02', 'CAM 03 gate line')],
    },
  ],
  footnote: {
    icon: 'droplets',
    text: 'Disinfection is not required for outward visits, so it is not checked here.',
  },
  review: {
    status: { status: 'Not observed' },
    detail: DUE_TODAY,
    tip: 'If the guard checked the vehicle out of camera view, pick “Other” and add a note.',
    actions: [ACTION.assign, ACTION.closeSecondary],
    history: [
      { time: '08:16', text: 'AI flagged it: inspection not seen before exit' },
      { time: '08:16', text: 'Added to “Needs attention”, no owner yet' },
    ],
  },
  link: {
    status: 'Auto-matched',
    text: 'All steps are linked to TV-0419. No other vehicle was near it at the gate.',
    showConfirmActions: true,
  },
  cameras: {
    rows: [
      { cameraId: 'cam01-in', tone: 'live', status: 'Live' },
      { cameraId: 'cam03', tone: 'live', status: 'Live' },
    ],
    note: {
      tone: 'subtle',
      text: 'AI check status: inspection validated for these cameras. A person still confirms anything unclear.',
    },
  },
  assign: {
    context: 'TV-0419 · Outward · Main gate · inspection not seen',
    summary: {
      photo: photo('outward-exit-no-guard', '08:14:40', 'CAM 01 inside gate'),
      title: 'Inspection not seen before exit',
      text: 'Camera recording 08:09–08:15 · clear view',
    },
    due: 'Today, 18:00',
    note: '',
    defaultOwnerId: 'emily',
  },
  close: {
    step: 'Inspection',
    defaultReasonId: 'observed-on-review',
    note: '',
    info: 'After closing, Outward inspection coverage updates and the visit leaves the needs-attention list.',
    toast: 'Visit closed. Outward inspection coverage is updated.',
  },
};

/* ---------------------------------------------------- TV-0438 / TV-0439 (10) */

const TV0438: VisitDetail = {
  id: 'TV-0438',
  direction: 'Inward',
  breadcrumb: ['GateView', 'Unit 3 · Today', 'TV-0438'],
  position: '1 of 9 assigned',
  nextTo: '/gate',
  chips: inwardChips('10:12'),
  status: { status: 'Needs review', label: 'Needs review · unclear link' },
  heading: 'The inspection may belong to another truck',
  body: 'Two trucks waited at Main gate at the same time. The AI saw one inspection at 10:09, but could not tell which truck it was for.',
  banner: {
    tone: 'review',
    icon: 'unlink',
    title: 'Two trucks at the gate',
    text: 'TV-0438 and TV-0439 were both at Main gate between 10:05 and 10:13.',
  },
  steps: [
    {
      key: 'approach',
      title: 'Approach',
      icon: 'truck',
      tone: 'observed',
      result: { status: 'Observed' },
      time: '10:05:30',
      description: 'Vehicle stopped before the outer gate, behind another truck.',
      cameraId: 'cam01-out',
      photos: [photo('two-trucks-guard', '10:05:30', 'CAM 01 outside gate')],
    },
    {
      key: 'inspection',
      title: 'Security inspection',
      icon: 'vest',
      tone: 'review',
      result: { status: 'Needs review', label: 'Needs review · unclear link' },
      time: '10:09:12',
      description: 'A person in the vest stood between TV-0438 and TV-0439 for 50 s.',
      cameraId: 'cam01-out',
      quality: 'Partial',
      photos: [
        photo('two-trucks-guard', '10:09:12', 'CAM 01 outside gate'),
        photo('two-trucks-guard', '10:09:48', 'CAM 01 outside gate'),
      ],
    },
    {
      key: 'disinfection',
      title: 'Disinfection',
      icon: 'droplets',
      tone: 'observed',
      result: { status: 'Observed' },
      time: '10:10:30',
      description: 'Spray seen on the tyres, 1 min 35 s before entry.',
      cameraId: 'cam02',
      quality: 'Good',
      photos: [photo('late-spray', '10:10:30', 'CAM 02 spray arch')],
    },
    {
      key: 'entry',
      title: 'Entry',
      icon: 'gate',
      tone: 'observed',
      result: { status: 'Observed' },
      time: '10:12:05',
      description: 'Vehicle crossed the gate line.',
      cameraId: 'cam03',
      photos: [photo('outward-exit-no-guard', '10:12:05', 'CAM 03 gate line')],
    },
  ],
  review: {
    status: { status: 'Needs review' },
    ownerId: 'emily',
    detail: DUE_TODAY,
    actions: ASSIGNED_ACTIONS,
    history: [
      { time: '10:40', text: 'Ryan M assigned it to Emily C' },
      { time: '10:13', text: 'AI flagged it: inspection link unclear, two trucks' },
    ],
  },
  link: {
    status: 'Unclear',
    text: 'Pick the truck this inspection belongs to. The other visit will be checked again.',
    candidates: [
      { visitId: 'TV-0438', entry: 'Entry 10:12', photo: photo('two-trucks-guard', '10:12:05', 'CAM 01 outside gate') },
      { visitId: 'TV-0439', entry: 'Entry 10:13', photo: photo('outward-exit-no-guard', '10:13:40', 'CAM 03 gate line') },
    ],
  },
  cameras: MAIN_GATE_CAMERAS,
  assign: {
    context: 'TV-0438 · Inward · Main gate · unclear link',
    summary: {
      photo: photo('two-trucks-guard', '10:09:12', 'CAM 01 outside gate'),
      title: 'The inspection may belong to another truck',
      text: 'Security inspection 10:09:12 · partial view',
    },
    due: 'Today, 18:00',
    note: '',
    defaultOwnerId: 'emily',
  },
  close: {
    step: 'Inspection',
    defaultReasonId: 'observed-on-review',
    note: '',
    info: 'After closing, Inward inspection coverage updates and the visit leaves the needs-attention list.',
    toast: 'Visit closed. Inward inspection coverage is updated.',
  },
};

/** Visits with a detail page. TV-0439 is shown as the second truck in TV-0438's "Which truck?" panel. */
export const VISIT_DETAILS: Record<string, VisitDetail> = {
  'TV-0412': TV0412,
  'TV-0419': TV0419,
  'TV-0431': TV0431,
  'TV-0438': TV0438,
};

export function getVisitDetail(id: string | undefined): VisitDetail | undefined {
  return id ? VISIT_DETAILS[id] : undefined;
}
