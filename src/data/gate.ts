/**
 * Gate dashboard mock data — Unit 3, Mon 23 Nov, 06:00–14:30 (Figma 02 · 54:296, 02b · 90:6507, 03 · 70:3453).
 *
 * Rules the dashboard follows:
 * - Coverage % only when the base is reliable (≥ 80% of visits judged and ≥ 10 visits), see lib/coverage.ts.
 *   Otherwise a count plus "% hidden" and the reason.
 * - "Needs review" (violet) means the AI could not judge (camera problem, mist, unclear link). It is never
 *   counted as "Not observed" and stays out of the coverage base.
 * - Judged = observed + late + not observed. Coverage = observed / judged.
 *
 * The day view (02) and the 07:00 hour (03) copy Figma exactly. Every other hour (/gate?hour=HH) is built
 * from the same hour buckets so the 03 layout can be shown for it (only 07:00 is checked against Figma).
 */
import type { EvidenceImageKey } from '@/data/evidenceImages';
import { nothingNeedsYouExample } from '@/data/states';
import type {
  CoverageInput,
  Direction,
  EvidenceQualityValue,
  HourBucket,
  OutcomeStack,
  ReviewStatusKind,
  StepResult,
} from '@/types/domain';

/* ------------------------------------------------------------------ types */

export type GateCheckKey = 'inwardInspection' | 'entryDisinfection' | 'outwardInspection';

export interface GateResult {
  id: 'main' | 'feed';
  name: string;
  inward: number;
  outward: number;
  cameras: number;
  /** Camera health pill: amber "1 partial view" or neutral "Cameras clear". */
  health: { tone: 'partial' | 'clear'; label: string };
  checks: Record<GateCheckKey, OutcomeStack>;
  /** "AI checks:" line — amber shield while a check is still being validated for a camera angle. */
  aiStatus: { tone: 'validating' | 'validated'; text: string };
  /** Camera note at the bottom of the gate card. */
  note: { tone: 'warning' | 'clear'; text: string; action?: string };
  /**
   * Figma's bar segment widths (px, in the order observed · late · not observed · not judged) for the
   * frames checked against Figma; other views size the bars by count.
   */
  barWidths?: Partial<Record<GateCheckKey, readonly number[]>>;
}

export interface GateVisitRow {
  id: string;
  image?: EvidenceImageKey;
  gate: string;
  direction: Direction;
  /** Entry (inward) or exit (outward) time. */
  time: string;
  inspection: { time?: string; result: StepResult };
  disinfection: { time?: string; result: StepResult };
  quality: EvidenceQualityValue;
  review: ReviewStatusKind;
  reviewName?: string;
  reviewInitials?: string;
  action: 'Review' | 'View';
  /** The visit has a detail page (screens 04–10), so the row links to it. */
  linked?: boolean;
}

export interface AttentionItem {
  id: string;
  meta: string;
  age: string;
  title: string;
  status: StepResult;
  review: ReviewStatusKind;
  /** Owner shown on "Assigned" items. */
  reviewName?: string;
  reviewInitials?: string;
  image: EvidenceImageKey;
  photoTime: string;
  linked?: boolean;
}

export type AttentionTab = 'noOwner' | 'assigned' | 'closed';

export interface CountKpi {
  badge?: string;
  footnote?: string;
}

export interface GateDashboardView {
  /** Selected hour ("07") or undefined for the whole day. */
  hour?: string;
  /** Figma's KPI coverage-bar widths (px) for frame 03; other views size the bars by count. */
  kpiBarWidths?: Partial<Record<GateCheckKey, readonly number[]>>;
  subtitleRange: string;
  filters: { date: string; dateChanged: boolean; useCase: string };
  inward: CountKpi;
  outward: CountKpi;
  review: { open: number; noOwner: number; owned: number };
  gates: GateResult[];
  gatesDescription: string;
  attention: {
    tabs: { noOwner: number; assigned: number; closed: number };
    items: AttentionItem[];
    footer: string;
    /**
     * Hour views other than 07:00: the items of each tab. The panel opens the first tab that has items
     * and shows the "Nothing needs you" state for an empty tab, so it is never an empty panel.
     * The Figma frames (02, 03) have one list only and leave this out.
     */
    lists?: Record<AttentionTab, AttentionItem[]>;
    empty?: { title: string; description: string; action: string };
  };
  visits: {
    tabs: { all: number; needsPerson: number; closed: number; noProblems: number };
    rows: GateVisitRow[];
    footer: string;
    pages: string[];
    /** 03: "Hour: 07:00–08:00" filter chip. */
    hourChip?: string;
  };
}

/* ---------------------------------------------------------- shared copy */

export const gateCopy = {
  breadcrumb: ['Overview', 'Unit 3', 'GateView'],
  title: 'Unit 3 gates, today',
  updated: 'Updated 14:28 · every 5 min',
  subtitlePrefix: 'Vehicle inspection and disinfection · Unit 3 · Mon 23 Nov, ',
  dayRange: '06:00–14:30',
  facility: 'Unit 3',
  gate: 'All gates',
  hourChart: {
    inspection: 'Inward above the time line, outward below. Click any bar to open those visits.',
    disinfection:
      'Inward visits only, because spraying is checked before the truck goes in. Click any bar to open those visits.',
    outwardNote: 'Disinfection is not required for outward visits',
    violetInspection: 'Violet = could not judge. Never counted as not observed.',
    violetDisinfection: 'Violet = could not judge',
  },
  attentionDescription: 'Waiting longest first. Each one has its photo, what happened, and who owns it.',
  visitsDescription:
    'One row for each vehicle visit, problems first. TV numbers are temporary visit IDs. Number plate reading (ANPR) and Focus PO / gate-pass checks come in Phase 2.',
  sort: 'Needs attention first',
} as const;

/* ------------------------------------------------------------ hour data */

const stack = (observed: number, late: number, notObserved: number, needsReview: number): OutcomeStack => ({
  observed,
  late,
  notObserved,
  needsReview,
});

export const HOURS = ['06', '07', '08', '09', '10', '11', '12', '13', '14'] as const;

/**
 * Inspection results per hour, read from the Figma chart (57:433): stack heights are 14.55px per visit.
 * Inward totals 4 9 8 6 5 5 4 4 3 (= 48), outward 1 3 5 6 6 5 6 6 3 (= 41).
 */
export const inspectionByHour: HourBucket[] = [
  { hour: '06', inward: stack(4, 0, 0, 0), outward: stack(1, 0, 0, 0) },
  { hour: '07', inward: stack(7, 0, 1, 1), outward: stack(3, 0, 0, 0) },
  { hour: '08', inward: stack(7, 0, 0, 1), outward: stack(4, 0, 1, 0) },
  { hour: '09', inward: stack(5, 0, 1, 0), outward: stack(5, 0, 0, 1) },
  { hour: '10', inward: stack(5, 0, 0, 0), outward: stack(6, 0, 0, 0) },
  { hour: '11', inward: stack(4, 0, 0, 1), outward: stack(4, 0, 0, 1) },
  { hour: '12', inward: stack(4, 0, 0, 0), outward: stack(5, 0, 1, 0) },
  { hour: '13', inward: stack(3, 0, 1, 0), outward: stack(5, 0, 0, 1) },
  { hour: '14', inward: stack(3, 0, 0, 0), outward: stack(3, 0, 0, 0) },
];

/** Entry disinfection per hour, inward only (Figma 02b chart 90:7094): observed, late, not observed, needs review. */
export const disinfectionByHour: { hour: string; inward: OutcomeStack }[] = [
  { hour: '06', inward: stack(2, 0, 0, 2) },
  { hour: '07', inward: stack(7, 0, 0, 2) },
  { hour: '08', inward: stack(4, 1, 0, 3) },
  { hour: '09', inward: stack(3, 1, 0, 2) },
  { hour: '10', inward: stack(3, 0, 1, 1) },
  { hour: '11', inward: stack(4, 0, 0, 1) },
  { hour: '12', inward: stack(3, 0, 0, 1) },
  { hour: '13', inward: stack(3, 0, 0, 1) },
  { hour: '14', inward: stack(2, 0, 0, 1) },
];

/** Chart footers. The busiest hour is the one Figma names (07:00, 9 in + 3 out). */
export const hourChartFooters = {
  busiest: { range: '07:00–08:00', visits: 12 },
  mostUnclearSpray: { range: '08:00–09:00', visits: 3 },
};

/** KPI sparklines (9 bars, 06–14). Figma draws both count cards with the same bar heights (81:5224, 81:5247). */
export const kpiSparks = {
  inward: [4, 9, 8, 6, 5, 5, 4, 4, 3],
  outward: [4, 9, 8, 6, 5, 5, 4, 4, 3],
};

/* ---------------------------------------------------------- helpers */

export const stackTotal = (s: OutcomeStack) => s.observed + s.late + s.notObserved + s.needsReview;

/** Coverage base of one check: judged = observed + late + not observed; "needs review" is left out. */
export function stackCoverage(s: OutcomeStack): CoverageInput {
  const judged = s.observed + s.late + s.notObserved;
  return { judged, total: judged + s.needsReview, observed: s.observed };
}

export function sumStacks(stacks: OutcomeStack[]): OutcomeStack {
  return stacks.reduce(
    (a, s) =>
      stack(
        a.observed + s.observed,
        a.late + s.late,
        a.notObserved + s.notObserved,
        a.needsReview + s.needsReview,
      ),
    stack(0, 0, 0, 0),
  );
}

export const hourRange = (hour: string) => `${hour}:00–${String(Number(hour) + 1).padStart(2, '0')}:00`;

export const visitPath = (id: string) => `/gate/visits/${id}`;

/* ------------------------------------------------------------ gates */

const MAIN_AI = 'inspection validated · disinfection still being validated for this camera angle';
const FEED_AI = 'inspection and disinfection validated for these cameras';
const FEED_NOTE = 'Both cameras clear today. Last health check at 14:25.';

/** Day view gates (57:670). Main 30 in / 26 out, Feed 18 in / 15 out. Sums give the KPI strip. */
const dayGates: GateResult[] = [
  {
    id: 'main',
    name: 'Main gate',
    inward: 30,
    outward: 26,
    cameras: 3,
    health: { tone: 'partial', label: '1 partial view' },
    checks: {
      inwardInspection: stack(26, 0, 2, 2),
      entryDisinfection: stack(15, 1, 1, 13),
      outwardInspection: stack(23, 0, 1, 2),
    },
    // 57:670 Main gate bars (177px track).
    barWidths: {
      inwardInspection: [153, 12, 8],
      entryDisinfection: [88, 6, 6, 72],
      outwardInspection: [157, 7, 10],
    },
    aiStatus: { tone: 'validating', text: MAIN_AI },
    note: {
      tone: 'warning',
      text: 'Spray-arch camera has a partial view since 06:00. 13 of 30 spray checks could not be judged.',
      action: 'See camera',
    },
  },
  {
    id: 'feed',
    name: 'Feed gate',
    inward: 18,
    outward: 15,
    cameras: 2,
    health: { tone: 'clear', label: 'Cameras clear' },
    checks: {
      inwardInspection: stack(16, 0, 1, 1),
      entryDisinfection: stack(16, 1, 0, 1),
      outwardInspection: stack(13, 0, 1, 1),
    },
    // 57:670 Feed gate bars (177px track).
    barWidths: {
      inwardInspection: [157, 10, 6],
      entryDisinfection: [157, 10, 6],
      outwardInspection: [153, 12, 8],
    },
    aiStatus: { tone: 'validated', text: FEED_AI },
    note: { tone: 'clear', text: FEED_NOTE },
  },
];

/** 07:00–08:00 gates (70:3605): fewer than 10 visits per gate, so counts are shown. */
const hour07Gates: GateResult[] = [
  {
    ...dayGates[0],
    inward: 6,
    outward: 2,
    checks: {
      inwardInspection: stack(4, 0, 1, 1),
      entryDisinfection: stack(4, 0, 0, 2),
      outwardInspection: stack(2, 0, 0, 0),
    },
    // 70:3605 Main gate bars; outward is one full green segment.
    barWidths: { inwardInspection: [118, 30, 26], entryDisinfection: [119, 56] },
    note: {
      tone: 'warning',
      text: 'Mist on the spray-arch camera this hour. 2 of 6 spray checks could not be judged.',
      action: 'See camera',
    },
  },
  {
    ...dayGates[1],
    inward: 3,
    outward: 1,
    checks: {
      inwardInspection: stack(3, 0, 0, 0),
      entryDisinfection: stack(3, 0, 0, 0),
      outwardInspection: stack(1, 0, 0, 0),
    },
    barWidths: undefined,
  },
];

/* ------------------------------------------------------------ visits */

/** Visit rows on 02 (58:490 … 58:875). Thumbnails are centre crops of the Figma evidence images. */
const dayRows: GateVisitRow[] = [
  {
    id: 'TV-0412',
    image: 'haze-spray-inward',
    gate: 'Main gate',
    direction: 'Inward',
    time: '07:42',
    inspection: { time: '07:38', result: 'Observed' },
    disinfection: { time: '—', result: 'Needs review' },
    quality: 'Low visibility',
    review: 'No owner',
    action: 'Review',
    linked: true,
  },
  {
    id: 'TV-0419',
    image: 'outward-exit-no-guard',
    gate: 'Main gate',
    direction: 'Outward',
    time: '08:15',
    inspection: { time: '—', result: 'Not observed' },
    disinfection: { result: 'Not required' },
    quality: 'Good',
    review: 'No owner',
    action: 'Review',
    linked: true,
  },
  {
    id: 'TV-0427',
    image: 'late-spray',
    gate: 'Feed gate',
    direction: 'Inward',
    time: '09:05',
    inspection: { time: '09:01', result: 'Observed' },
    disinfection: { time: '09:07', result: 'Late' },
    quality: 'Good',
    review: 'No owner',
    action: 'Review',
  },
  {
    id: 'TV-0431',
    image: 'camera-blocked',
    gate: 'Main gate',
    direction: 'Inward',
    time: '09:20',
    inspection: { time: '09:16', result: 'Observed' },
    disinfection: { time: '—', result: 'Needs review' },
    quality: 'Camera blocked',
    review: 'No owner',
    action: 'Review',
    linked: true,
  },
  {
    id: 'TV-0435',
    image: 'haze-spray-inward',
    gate: 'Main gate',
    direction: 'Inward',
    time: '09:48',
    inspection: { time: '09:44', result: 'Observed' },
    disinfection: { time: '—', result: 'Needs review' },
    quality: 'Low visibility',
    review: 'No owner',
    action: 'Review',
  },
  {
    id: 'TV-0438',
    image: 'two-trucks-guard',
    gate: 'Main gate',
    direction: 'Inward',
    time: '10:12',
    inspection: { time: '10:09', result: 'Needs review' },
    disinfection: { time: '10:10', result: 'Observed' },
    quality: 'Partial',
    review: 'Assigned',
    reviewName: 'Emily C',
    reviewInitials: 'EC',
    action: 'Review',
    linked: true,
  },
  {
    id: 'TV-0440',
    image: 'outward-exit-no-guard',
    gate: 'Feed gate',
    direction: 'Outward',
    time: '10:31',
    inspection: { time: '10:27', result: 'Observed' },
    disinfection: { result: 'Not required' },
    quality: 'Good',
    review: 'None',
    action: 'View',
  },
  {
    id: 'TV-0441',
    image: 'two-trucks-guard',
    gate: 'Main gate',
    direction: 'Inward',
    time: '10:44',
    inspection: { time: '10:40', result: 'Observed' },
    disinfection: { time: '10:42', result: 'Observed' },
    quality: 'Good',
    review: 'None',
    action: 'View',
  },
];

/** Visit rows on 03, the 07:00–08:00 hour (70:3715 … 70:3722). */
const hour07Rows: GateVisitRow[] = [
  {
    id: 'TV-0409',
    image: 'two-trucks-guard',
    gate: 'Main gate',
    direction: 'Inward',
    time: '07:24',
    inspection: { time: '—', result: 'Not observed' },
    disinfection: { time: '07:21', result: 'Observed' },
    quality: 'Good',
    review: 'No owner',
    action: 'Review',
  },
  dayRows[0],
  {
    id: 'TV-0407',
    image: 'haze-spray-inward',
    gate: 'Main gate',
    direction: 'Inward',
    time: '07:15',
    inspection: { time: '07:12', result: 'Needs review' },
    disinfection: { time: '—', result: 'Needs review' },
    quality: 'Low visibility',
    review: 'Assigned',
    reviewName: 'Emily C',
    reviewInitials: 'EC',
    action: 'Review',
  },
  {
    id: 'TV-0405',
    image: 'two-trucks-guard',
    gate: 'Main gate',
    direction: 'Inward',
    time: '07:06',
    inspection: { time: '07:03', result: 'Observed' },
    disinfection: { time: '07:04', result: 'Observed' },
    quality: 'Good',
    review: 'Closed',
    action: 'View',
  },
  {
    id: 'TV-0408',
    image: 'late-spray',
    gate: 'Feed gate',
    direction: 'Inward',
    time: '07:18',
    inspection: { time: '07:15', result: 'Observed' },
    disinfection: { time: '07:16', result: 'Observed' },
    quality: 'Good',
    review: 'None',
    action: 'View',
  },
  {
    id: 'TV-0410',
    image: 'outward-exit-no-guard',
    gate: 'Main gate',
    direction: 'Outward',
    time: '07:31',
    inspection: { time: '07:28', result: 'Observed' },
    disinfection: { result: 'Not required' },
    quality: 'Good',
    review: 'None',
    action: 'View',
  },
  {
    id: 'TV-0411',
    image: 'two-trucks-guard',
    gate: 'Feed gate',
    direction: 'Inward',
    time: '07:36',
    inspection: { time: '07:33', result: 'Observed' },
    disinfection: { time: '07:34', result: 'Observed' },
    quality: 'Good',
    review: 'None',
    action: 'View',
  },
  {
    id: 'TV-0413',
    image: 'outward-exit-no-guard',
    gate: 'Main gate',
    direction: 'Inward',
    time: '07:49',
    inspection: { time: '07:46', result: 'Observed' },
    disinfection: { time: '07:47', result: 'Observed' },
    quality: 'Good',
    review: 'None',
    action: 'View',
  },
];

/* ------------------------------------------------------ needs attention */

const attentionTV0412: AttentionItem = {
  id: 'TV-0412',
  meta: 'Inward · Main gate',
  age: '6 h',
  title: 'Disinfection not clearly seen before entry',
  status: 'Needs review',
  review: 'No owner',
  image: 'haze-spray-inward',
  photoTime: '07:41:56',
  linked: true,
};

/** Day list, "No owner" tab (57:548). */
const dayAttention: AttentionItem[] = [
  attentionTV0412,
  {
    id: 'TV-0419',
    meta: 'Outward · Main gate',
    age: '6 h',
    title: 'Inspection not seen before exit',
    status: 'Not observed',
    review: 'No owner',
    image: 'outward-exit-no-guard',
    photoTime: '08:14:40',
    linked: true,
  },
  {
    id: 'TV-0431',
    meta: 'Inward · Main gate',
    age: '5 h',
    title: 'Spray camera blocked by a parked truck',
    status: 'Camera blocked',
    review: 'No owner',
    image: 'camera-blocked',
    photoTime: '09:18:05',
    linked: true,
  },
];

/** 07:00–08:00 list (70:3589). */
const hour07Attention: AttentionItem[] = [
  attentionTV0412,
  {
    id: 'TV-0409',
    meta: 'Inward · Main gate',
    age: '7 h',
    title: 'Inspection not seen before entry',
    status: 'Not observed',
    review: 'No owner',
    image: 'two-trucks-guard',
    photoTime: '07:21:30',
  },
];

/* ------------------------------------------------------------- views */

const dayView: GateDashboardView = {
  subtitleRange: gateCopy.dayRange,
  filters: { date: 'Today, 23 Nov', dateChanged: false, useCase: 'All use cases' },
  inward: { badge: '+6', footnote: 'vs last Monday, same time' },
  outward: { badge: '+3', footnote: 'vs last Monday, same time' },
  review: { open: 14, noOwner: 5, owned: 9 },
  gates: dayGates,
  gatesDescription: 'Each gate keeps inward and outward checks apart, and shows how healthy its cameras are.',
  attention: {
    tabs: { noOwner: 5, assigned: 9, closed: 8 },
    items: dayAttention,
    footer: 'See all 5 with no owner',
  },
  visits: {
    tabs: { all: 89, needsPerson: 14, closed: 8, noProblems: 67 },
    rows: dayRows,
    footer: 'Showing 8 of 89 visits',
    pages: ['1', '2', '3', '…', '12'],
  },
};

const HOUR_GATES_DESCRIPTION = 'Fewer than 10 visits per gate in this hour, so we show counts, not %.';

const hour07View: GateDashboardView = {
  hour: '07',
  // 81:5413: the cards keep the KPI master's bar widths, clipped by the 144px track.
  kpiBarWidths: {
    inwardInspection: [132.72, 9.48, 9.48],
    outwardInspection: [132.72],
    entryDisinfection: [132.72, 9.48],
  },
  subtitleRange: '07:00–08:00',
  filters: { date: 'Today, 07:00–08:00', dateChanged: true, useCase: 'All' },
  inward: { badge: 'Peak', footnote: 'Busiest hour of the day' },
  outward: { badge: 'Low', footnote: 'Quiet hour for outward' },
  review: { open: 3, noOwner: 2, owned: 1 },
  gates: hour07Gates,
  gatesDescription: HOUR_GATES_DESCRIPTION,
  attention: {
    tabs: { noOwner: 2, assigned: 1, closed: 1 },
    items: hour07Attention,
    footer: 'See all 3 in this hour',
  },
  visits: {
    tabs: { all: 12, needsPerson: 3, closed: 1, noProblems: 8 },
    rows: hour07Rows,
    footer: 'Showing 8 of 12 visits · 07:00–08:00',
    pages: ['1', '2'],
    hourChip: 'Hour: 07:00–08:00',
  },
};

/** "Updated 14:28": ages in the needs-attention list count from this time. */
const DASHBOARD_TIME = '14:28';
const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};
const ageSince = (time: string) => `${Math.floor((toMinutes(DASHBOARD_TIME) - toMinutes(time)) / 60)} h`;

/**
 * What happened, for visits that need a person but are not in a Figma needs-attention list
 * (hour views other than 07:00). Wording follows the visit pages and the SOP rules ("After entry = Late").
 */
const ATTENTION_TITLES: Record<string, string> = {
  'TV-0427': 'Disinfection seen after entry',
  'TV-0435': 'Disinfection not clearly seen before entry',
  'TV-0438': 'The inspection may belong to another truck',
};

/** Needs-attention item for a visit row: the Figma item when there is one, else built from the row. */
function attentionFor(r: GateVisitRow): AttentionItem | undefined {
  if (r.review === 'None') return undefined;
  const known = dayAttention.find((a) => a.id === r.id);
  if (known) return known;
  const title = ATTENTION_TITLES[r.id];
  if (!title || !r.image) return undefined;
  const flagged = (result: StepResult) => result !== 'Observed' && result !== 'Not required';
  const step = flagged(r.inspection.result) ? r.inspection : r.disinfection;
  return {
    id: r.id,
    meta: `${r.direction} · ${r.gate}`,
    age: ageSince(r.time),
    title,
    status: step.result,
    review: r.review,
    reviewName: r.reviewName,
    reviewInitials: r.reviewInitials,
    image: r.image,
    photoTime: step.time && step.time !== '—' ? step.time : r.time,
    linked: r.linked,
  };
}

/** Split an hour's counts between the two gates in the day's proportion (mock data for hours other than 07). */
function splitStack(s: OutcomeStack, share: number): [OutcomeStack, OutcomeStack] {
  const main = stack(
    Math.round(s.observed * share),
    Math.round(s.late * share),
    Math.round(s.notObserved * share),
    Math.round(s.needsReview * share),
  );
  return [
    main,
    stack(
      s.observed - main.observed,
      s.late - main.late,
      s.notObserved - main.notObserved,
      s.needsReview - main.needsReview,
    ),
  ];
}

function buildHourView(hour: string): GateDashboardView {
  const insp = inspectionByHour.find((b) => b.hour === hour)!;
  const dis = disinfectionByHour.find((b) => b.hour === hour)!;
  const range = hourRange(hour);
  const inShare = dayGates[0].inward / (dayGates[0].inward + dayGates[1].inward);
  const outShare = dayGates[0].outward / (dayGates[0].outward + dayGates[1].outward);
  const [mainIn, feedIn] = splitStack(insp.inward, inShare);
  const [mainDis, feedDis] = splitStack(dis.inward, inShare);
  const [mainOut, feedOut] = splitStack(insp.outward, outShare);
  const gates: GateResult[] = [
    {
      ...dayGates[0],
      inward: stackTotal(mainIn),
      outward: stackTotal(mainOut),
      checks: { inwardInspection: mainIn, entryDisinfection: mainDis, outwardInspection: mainOut },
      barWidths: undefined,
      note: {
        ...dayGates[0].note,
        text: `Spray-arch camera has a partial view this hour. ${mainDis.needsReview} of ${stackTotal(mainDis)} spray checks could not be judged.`,
      },
    },
    {
      ...dayGates[1],
      inward: stackTotal(feedIn),
      outward: stackTotal(feedOut),
      checks: { inwardInspection: feedIn, entryDisinfection: feedDis, outwardInspection: feedOut },
      barWidths: undefined,
    },
  ];
  const inHour = (time: string) => time.startsWith(`${hour}:`);
  const rows = dayRows.filter((r) => inHour(r.time));
  const items = rows.map(attentionFor).filter((a): a is AttentionItem => Boolean(a));
  const lists: Record<AttentionTab, AttentionItem[]> = {
    noOwner: items.filter((a) => a.review === 'No owner'),
    assigned: items.filter((a) => a.review === 'Assigned'),
    closed: items.filter((a) => a.review === 'Closed'),
  };
  const all = stackTotal(insp.inward) + stackTotal(insp.outward);
  const flagged = (s: OutcomeStack) => s.late + s.notObserved + s.needsReview;
  const needsPerson = Math.min(flagged(insp.inward) + flagged(insp.outward) + flagged(dis.inward), all);
  // The review card and the needs-attention tabs count the same visits.
  const noOwner = lists.noOwner.length;
  const owned = lists.assigned.length;
  const closed = lists.closed.length;
  return {
    hour,
    subtitleRange: range,
    filters: { date: `Today, ${range}`, dateChanged: true, useCase: 'All' },
    inward: {},
    outward: {},
    review: { open: noOwner + owned, noOwner, owned },
    gates,
    gatesDescription: HOUR_GATES_DESCRIPTION,
    attention: {
      tabs: { noOwner, assigned: owned, closed },
      items,
      footer: `See all ${noOwner + owned} in this hour`,
      lists,
      empty: {
        title: nothingNeedsYouExample.title ?? '',
        description: `Nothing from ${range} is waiting for a person. New problems will show here.`,
        action: nothingNeedsYouExample.actionLabel ?? '',
      },
    },
    visits: {
      tabs: { all, needsPerson, closed, noProblems: all - needsPerson - closed },
      rows,
      footer: `Showing ${rows.length} of ${all} visits · ${range}`,
      pages: ['1'],
      hourChip: `Hour: ${range}`,
    },
  };
}

/** The dashboard for the whole day, or for one hour ("07" is the Figma 03 frame). Unknown hours give the day. */
export function getGateDashboard(hour?: string | null): GateDashboardView {
  if (!hour || !HOURS.includes(hour as (typeof HOURS)[number])) return dayView;
  if (hour === '07') return hour07View;
  return buildHourView(hour);
}
