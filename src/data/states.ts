/**
 * Screen 13 (Figma 86:5032): how the Gate dashboard of Unit 3 looks on a quiet day, when a camera is down,
 * while footage is still being checked, and while data loads. Copy for the reusable `StateBlock` examples.
 */
import type { StateBlockState } from '@/components/data/StateBlock';

export interface StateExample {
  state: StateBlockState;
  /** Example heading (Label/M, brand). */
  label: string;
  /** Example explanation (Body/XS, secondary). */
  caption: string;
  title?: string;
  description?: string;
  actionLabel?: string;
}

export const statesPage: { breadcrumb: string[]; title: string; subtitle: string } = {
  breadcrumb: ['Overview', 'Unit 3', 'GateView'],
  title: 'Unit 3 gates — other states',
  subtitle:
    'How the Gate dashboard looks on a quiet day, when a camera is down, while footage is still being checked, and while data loads.',
};

export const analysingExample: StateExample = {
  state: 'Still analysing',
  label: 'While footage is still being checked',
  caption: 'Shows under the filters. Numbers for that time may still change, so we say so.',
  title: 'Footage from 14:15 to 14:30 is still being checked',
  description: 'Usually ready in about 5 minutes. Numbers for this time may still change.',
};

export const cameraOfflineExample: StateExample = {
  state: 'Camera offline',
  label: 'When a camera goes offline',
  caption:
    'Shows at the top and on that gate. Visits in the gap are “not judged”, never counted as problems.',
  title: 'Feed gate camera is offline since 10:00',
  description:
    'Visits at Feed gate after 10:00 are not judged yet. They will be checked when the camera is back.',
  actionLabel: 'See camera health',
};

export const nothingNeedsYouExample: StateExample = {
  state: 'Nothing needs you',
  label: 'When nothing needs a person',
  caption: 'The needs-attention list on a good day. It tells you why it is empty.',
  title: 'Nothing needs you right now',
  description: 'All 48 inward and 41 outward visits look fine so far today. New problems will show here.',
  actionLabel: 'See all visits',
};

/** Needs-attention tabs on a quiet day: nothing without an owner, nothing assigned, 6 closed today. */
export const quietDayTabs = [
  { id: 'no-owner', label: 'No owner', count: 0 },
  { id: 'assigned', label: 'Assigned', count: 0 },
  { id: 'closed', label: 'Closed today', count: 6 },
] as const;

export const loadingExample: StateExample & { cards: number } = {
  state: 'Loading',
  label: 'While data loads',
  caption: 'Grey shapes in the same layout as the KPI cards, so the page does not jump when numbers arrive.',
  cards: 4,
};
