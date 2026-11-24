/**
 * Domain model for NAVA Vision AI · GateView (UI only, mock data).
 *
 * Rules the UI follows (keep them true in data and components):
 * - A camera problem (blocked, low visibility) is NOT a violation. It becomes "Needs review"
 *   and stays out of the coverage %.
 * - Coverage % is shown only when the base is reliable: at least 80% of visits judged AND
 *   at least 10 visits. Otherwise show a count plus "% hidden" and the reason (see lib/coverage.ts).
 * - Violet ("Needs review") always means "could not judge". It is never counted as "Not observed".
 * - Wording: "Observed", never "Verified"/"Passed". Talk about the step, never blame a person.
 * - A missing step shows the camera recording for that time window, never a made-up photo.
 * - Visits use temporary IDs (TV-0412). Number plates (ANPR) and Focus PO / gate-pass matching are Phase 2.
 */
import type { EvidenceImageKey } from '@/data/evidenceImages';

export type Direction = 'Inward' | 'Outward';

/** Step-result family (Figma "Status chip"). */
export type StepResult =
  | 'Observed'
  | 'Not observed'
  | 'Late'
  | 'Needs review'
  | 'Low visibility'
  | 'Camera blocked'
  | 'Not required'
  | 'Phase 2';

/** Evidence-quality family (Figma "Evidence quality"). */
export type EvidenceQualityValue = 'Good' | 'Partial' | 'Low visibility' | 'Camera blocked';

/** Link-to-vehicle family (shown in the "Which truck?" panel). */
export type LinkStatus = 'Auto-matched' | 'Unclear' | 'Not matched' | 'Confirmed by reviewer' | 'Marked wrong';

/** Review-status family (Figma "Review tag"). */
export type ReviewStatusKind = 'No owner' | 'Assigned' | 'Closed' | 'None';

export interface Person {
  id: 'ryan' | 'emily' | 'sarah' | 'david';
  name: string;
  initials: string;
  role: string;
  scope: string;
  /** Open reviews they currently own. */
  openCount: number;
  isCurrentUser?: boolean;
}

export type CameraHealth = 'Live' | 'Partial view' | 'Blocked' | 'Offline';

export interface Camera {
  id: string;
  /** "CAM 01" */
  code: string;
  /** "Outside gate" */
  name: string;
  gateId: string;
  health: CameraHealth;
  healthNote?: string;
}

export interface Gate {
  id: string;
  name: string;
  unitId: string;
  cameraIds: string[];
}

export interface Unit {
  id: string;
  name: string;
  gateIds: string[];
}

export interface Evidence {
  image: EvidenceImageKey;
  /** Mono timestamp shown on the photo, "07:41:56". */
  time: string;
  alt: string;
  /** Image-fill crop from the Figma instance. */
  crop?: { position?: string; scale?: number; origin?: string };
}

export type StepKey = 'approach' | 'inspection' | 'disinfection' | 'entry' | 'exit';

export interface CameraRecording {
  /** "07:38–07:42 · 4 min" */
  label: string;
  frames: Evidence[];
  note?: string;
}

export interface VisitStep {
  key: StepKey;
  title: string;
  result: StepResult;
  /** Chip text override, e.g. "Needs review · unclear link". */
  resultLabel?: string;
  /** Mono time or time window, "07:38 – 07:42". */
  time: string;
  description: string;
  /** "CAM 01 · Outside gate" */
  camera?: string;
  quality?: EvidenceQualityValue;
  photos?: Evidence[];
  recording?: CameraRecording;
  note?: string;
}

export interface HistoryEntry {
  time: string;
  text: string;
}

export interface ReviewState {
  status: ReviewStatusKind;
  ownerId?: Person['id'];
  /** "Today 18:00" */
  due?: string;
  closedAt?: string;
  reason?: string;
  note?: string;
  history: HistoryEntry[];
}

export interface Visit {
  id: string;
  unitId: string;
  gateId: string;
  direction: Direction;
  /** Entry (inward) or exit (outward) time, "07:42". */
  time: string;
  sopId: string;
}

export interface Sop {
  id: string;
  unit: string;
  direction: Direction;
  version: string;
  stepCount: number;
  active?: boolean;
}

/** One stacked segment group in the hour chart. */
export interface OutcomeStack {
  observed: number;
  late: number;
  notObserved: number;
  needsReview: number;
}

export interface HourBucket {
  /** "06" … "14" */
  hour: string;
  inward: OutcomeStack;
  outward: OutcomeStack;
}

export interface CoverageInput {
  /** Visits where the step was judged (observed + late + not observed). */
  judged: number;
  /** All visits in the base (judged + could not judge). */
  total: number;
  /** Visits where the step was observed in time. */
  observed: number;
}

export interface KpiSet {
  inward: number;
  outward: number;
  inwardInspection: CoverageInput & { notSeen: number; notJudged: number };
  outwardInspection: CoverageInput & { notSeen: number; notJudged: number };
  entryDisinfection: CoverageInput & { late: number; notSeen: number; notJudged: number };
  review: { open: number; noOwner: number; owned: number };
}
