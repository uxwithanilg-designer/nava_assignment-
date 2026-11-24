/**
 * Mock data for screen 01 · Management overview (/overview, Figma 72:4249).
 * "All 3 units" for Mon 23 Nov, 06:00–14:30. Values copied from Figma.
 *
 * The KPI strip and the GateView module tile are summed from the three facility rows, so the numbers
 * always agree (118 in · 96 out · 95% / 96% / 92% · 31 open, 10 no owner).
 * Coverage % follows getCoverageDisplay(): Unit 3 entry disinfection has only 34 of 48 visits judged
 * (camera problems are not violations and stay out of the base), so it shows "% hidden".
 */
import type { IconName } from '@/components/icons';
import type { ChipStatus } from '@/components/ui/StatusChip';
import type { CoverageInput } from '@/types/domain';
import type { EvidenceImageKey } from '@/data/evidenceImages';

/* ---------- Types ---------- */

/** Step results for one check across a set of visits. Violet "not judged" is never folded into "not observed". */
export interface StepCounts {
  observed: number;
  late: number;
  notObserved: number;
  /** Could not judge (camera problem, low visibility). */
  notJudged: number;
}

export interface FacilitySummary {
  unitId: 'unit-1' | 'unit-2' | 'unit-3';
  name: string;
  gates: string;
  inward: number;
  outward: number;
  inwardInspection: StepCounts;
  entryDisinfection: StepCounts;
  outwardInspection: StepCounts;
  review: { open: number; noOwner: number; waitingOver24h?: number };
  cameras: { live: number; partial?: number };
  /** Prototype link (row + "Open"): only Unit 3 has a Gate dashboard in the design. */
  to?: string;
}

export interface ModuleSummary {
  id: 'gate' | 'feedmill' | 'birdshed' | 'eggstore';
  name: string;
  description: string;
  icon: IconName;
  status: string;
  value: number;
  unit: string;
  needReview: number;
  noOwner: number;
  link: string;
  to?: string;
}

export interface TrendSeriesData {
  id: string;
  label: string;
  /** One value per day, oldest first (Tue 17 … Today). */
  values: number[];
  /** Line colour (token). */
  color: string;
  /** End-value label colour (token). */
  labelColor: string;
  strokeWidth: number;
}

export interface WaitingVisit {
  id: string;
  meta: string;
  age: string;
  title: string;
  status: ChipStatus;
  image: EvidenceImageKey;
  time: string;
  alt: string;
  to?: string;
}

/* ---------- Helpers ---------- */

export const judgedOf = (s: StepCounts) => s.observed + s.late + s.notObserved;

/** Coverage input for getCoverageDisplay(): observed in time ÷ judged; "not judged" stays out of the base. */
export const coverageInput = (s: StepCounts): CoverageInput => ({
  observed: s.observed,
  judged: judgedOf(s),
  total: judgedOf(s) + s.notJudged,
});

const sumSteps = (list: StepCounts[]): StepCounts =>
  list.reduce(
    (a, s) => ({
      observed: a.observed + s.observed,
      late: a.late + s.late,
      notObserved: a.notObserved + s.notObserved,
      notJudged: a.notJudged + s.notJudged,
    }),
    { observed: 0, late: 0, notObserved: 0, notJudged: 0 },
  );

/* ---------- Page header + filters ---------- */

export const overviewHeader = {
  breadcrumb: ['Sakku Group', 'Overview'],
  title: 'All farms, today',
  updated: 'Updated 14:28 · every 5 min',
  subtitle: 'All modules today, with Gate details for 3 units · Mon 23 Nov, 06:00–14:30',
};

export const overviewFilters: { label: string; value: string; icon: IconName }[] = [
  { label: 'Facility', value: 'All facilities', icon: 'map-pin' },
  { label: 'Date', value: 'Today, 23 Nov', icon: 'calendar' },
  { label: 'Compare with', value: 'Last Monday', icon: 'history' },
];

/* ---------- Compare facilities (Gate data only) ---------- */

export const compareFacilities = {
  title: 'Compare facilities',
  description: 'Gate data only. Click a row to open that unit’s Gate dashboard.',
};

export const facilities: FacilitySummary[] = [
  {
    unitId: 'unit-1',
    name: 'Unit 1',
    gates: 'Main gate, Feed gate',
    inward: 38,
    outward: 30,
    inwardInspection: { observed: 36, late: 0, notObserved: 1, notJudged: 1 },
    entryDisinfection: { observed: 35, late: 1, notObserved: 1, notJudged: 1 },
    outwardInspection: { observed: 28, late: 0, notObserved: 1, notJudged: 1 },
    review: { open: 6, noOwner: 1 },
    cameras: { live: 4 },
  },
  {
    unitId: 'unit-2',
    name: 'Unit 2',
    gates: 'Main gate, Feed gate',
    inward: 32,
    outward: 25,
    inwardInspection: { observed: 29, late: 0, notObserved: 2, notJudged: 1 },
    entryDisinfection: { observed: 28, late: 2, notObserved: 1, notJudged: 1 },
    outwardInspection: { observed: 23, late: 0, notObserved: 1, notJudged: 1 },
    review: { open: 11, noOwner: 4, waitingOver24h: 1 },
    cameras: { live: 4 },
  },
  {
    unitId: 'unit-3',
    name: 'Unit 3',
    gates: 'Main gate, Feed gate',
    inward: 48,
    outward: 41,
    inwardInspection: { observed: 42, late: 0, notObserved: 3, notJudged: 3 },
    entryDisinfection: { observed: 31, late: 2, notObserved: 1, notJudged: 14 },
    outwardInspection: { observed: 36, late: 0, notObserved: 2, notJudged: 3 },
    review: { open: 14, noOwner: 5 },
    cameras: { live: 5, partial: 1 },
    to: '/gate',
  },
];

/* ---------- KPI strip: all 3 units ---------- */

const inwardInspection = sumSteps(facilities.map((f) => f.inwardInspection));
const outwardInspection = sumSteps(facilities.map((f) => f.outwardInspection));
const entryDisinfection = sumSteps(facilities.map((f) => f.entryDisinfection));
const reviewOpen = facilities.reduce((n, f) => n + f.review.open, 0);
const reviewNoOwner = facilities.reduce((n, f) => n + f.review.noOwner, 0);

export const overviewKpis = {
  inward: {
    value: facilities.reduce((n, f) => n + f.inward, 0),
    delta: '+9',
    /** Visits per hour 06–14 (Figma spark heights). */
    spark: [4, 9, 8, 6, 5, 5, 4, 4, 3],
    footnote: 'vs last Monday, same time',
  },
  outward: {
    value: facilities.reduce((n, f) => n + f.outward, 0),
    delta: '+4',
    spark: [4, 9, 8, 6, 5, 5, 4, 4, 3],
    footnote: 'vs last Monday, same time',
  },
  inwardInspection,
  outwardInspection,
  entryDisinfection,
  /**
   * The KPI card fraction bar in Figma keeps the component's fixed segment widths
   * (observed 132.72 · late 6.32 · not observed 9.48 · not judged 9.48 px) inside a 144 px track that
   * clips the overflow, so only these parts are visible. Reproduced as proportions of the 144 px track.
   */
  bars: {
    inwardInspection: { observed: 132.72, notObserved: 9.28 },
    outwardInspection: { observed: 132.72, notObserved: 9.28 },
    entryDisinfection: { observed: 132.72, late: 6.32, notObserved: 0.96 },
  },
  review: { open: reviewOpen, noOwner: reviewNoOwner, owned: reviewOpen - reviewNoOwner },
};

/* ---------- Modules ---------- */

export const modules: ModuleSummary[] = [
  {
    id: 'gate',
    name: 'GateView',
    description: 'Vehicle checks at the gate',
    icon: 'gate',
    status: 'Live',
    value: overviewKpis.inward.value + overviewKpis.outward.value,
    unit: 'visits today',
    needReview: overviewKpis.review.open,
    noOwner: overviewKpis.review.noOwner,
    link: 'Open GateView',
    to: '/gate',
  },
  {
    id: 'feedmill',
    name: 'FeedMill',
    description: 'Grinding and sample checks',
    icon: 'factory',
    status: 'Live',
    value: 12,
    unit: 'grinding runs',
    needReview: 2,
    noOwner: 1,
    link: 'Open FeedMill',
  },
  {
    id: 'birdshed',
    name: 'BirdShed',
    description: 'Daily routines in 18 sheds',
    icon: 'feather',
    status: 'Live',
    value: 52,
    unit: 'routines done',
    needReview: 4,
    noOwner: 2,
    link: 'Open BirdShed',
  },
  {
    id: 'eggstore',
    name: 'EggStore',
    description: 'Egg stock and store hygiene',
    icon: 'egg',
    status: 'Live',
    value: 36,
    unit: 'stock moves',
    needReview: 3,
    noOwner: 1,
    link: 'Open EggStore',
  },
];

/* ---------- Visits that needed a person, last 7 days ---------- */

export const needsPersonTrend = {
  title: 'Visits that needed a person, last 7 days',
  description: 'Is it getting better? Each line is one unit. Today is counted until 14:30.',
  days: ['Tue 17', 'Wed 18', 'Thu 19', 'Fri 20', 'Sat 21', 'Sun 22', 'Today'],
  yTicks: [0, 8, 16, 24],
  series: [
    {
      id: 'unit-1',
      label: 'Unit 1',
      values: [7, 6, 8, 5, 6, 5, 7],
      color: 'var(--text-tertiary)',
      labelColor: 'var(--text-secondary)',
      strokeWidth: 2,
    },
    {
      id: 'unit-2',
      label: 'Unit 2',
      values: [12, 14, 11, 13, 12, 10, 13],
      color: 'var(--chart-2)',
      labelColor: 'var(--chart-2)',
      strokeWidth: 2,
    },
    {
      id: 'unit-3',
      label: 'Unit 3',
      values: [9, 10, 8, 11, 16, 19, 22],
      color: 'var(--chart-1)',
      labelColor: 'var(--chart-1)',
      strokeWidth: 3,
    },
  ] satisfies TrendSeriesData[],
  insight:
    'Unit 3 has gone up since Friday. These are the same days the spray-arch camera at Main gate got a partial view. Fixing the camera angle should bring it down.',
};

/* ---------- Waiting the longest ---------- */

export const waitingLongest = {
  title: 'Waiting the longest',
  description: 'Problems with no owner, oldest first, across all units.',
  visits: [
    {
      id: 'TV-0388',
      meta: 'Unit 2 · Outward',
      age: '26 h',
      title: 'Inspection not seen before exit',
      status: 'Not observed',
      image: 'outward-exit-no-guard',
      time: '12:41:09',
      alt: 'Unit 2 gate camera at 12:41:09, truck leaving with no guard near it',
    },
    {
      id: 'TV-0412',
      meta: 'Unit 3 · Inward',
      age: '6 h',
      title: 'Disinfection not clearly seen before entry',
      status: 'Needs review',
      image: 'haze-spray-inward',
      time: '07:41:56',
      alt: 'CAM 02 spray arch at 07:41:56, mist',
      to: '/gate/visits/TV-0412',
    },
    {
      id: 'TV-0419',
      meta: 'Unit 3 · Outward',
      age: '6 h',
      title: 'Inspection not seen before exit',
      status: 'Not observed',
      image: 'outward-exit-no-guard',
      time: '08:14:40',
      alt: 'CAM 01 inside gate at 08:14:40, truck leaving with no guard near it',
    },
  ] satisfies WaitingVisit[],
  openCount: reviewOpen,
};
