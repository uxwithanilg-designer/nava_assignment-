/**
 * Copy and sample values for the /components developer page, taken from Figma board
 * "C-01 — Components" (48:83) so the page can be compared with the board side by side.
 */
export const galleryHeader = {
  tag: 'Components · C-01',
  title: 'Components for the Gate module',
  description:
    'Every screen is built only from these parts. Each part uses auto layout, colour tokens and text styles, so FeedMill, BirdShed and EggStore can reuse them later.',
};

export const gallerySections = {
  avatar: { title: 'Avatar', description: 'Initials only. We never show a face from the cameras.' },
  button: {
    title: 'Button',
    description:
      'Labels say exactly what happens: “Assign”, “Close visit”, “Export”. One primary button per area.',
  },
  iconButton: { title: 'Icon button' },
  statusChip: {
    title: 'Status chip',
    description:
      'Result of one step. Icon and words always come with the colour, so it works for colour-blind people too.',
  },
  reviewTag: {
    title: 'Review tag',
    description: 'Who owns the follow-up. Orange only for “No owner”, because that needs someone now.',
  },
  evidenceQuality: {
    title: 'Evidence quality',
    description: 'How much to trust the photo. Kept quiet on purpose: it is about the camera, not the truck.',
  },
  legend: { title: 'Chart legend' },
  navigation: {
    title: 'Navigation',
    description: 'Left menu. The other modules stay visible, so the product feels complete from day one.',
  },
  topBar: {
    title: 'Top bar',
    description: 'Where am I, and a quick way to jump to any visit. Camera health is always one glance away.',
  },
  filter: {
    title: 'Filter',
    description:
      'Filters stay on top of the page and travel to the next screen. A changed filter turns navy, so you always know the view is narrowed.',
  },
  kpi: {
    title: 'KPI',
    description:
      'The six KPIs, named exactly as in the brief. Coverage always shows “x of y”. If the base number is not reliable, the % hides itself and says why.',
  },
  moduleTile: {
    title: 'Module tile',
    description:
      'Used on the management overview. One big number, then what needs a person, then a clear way in.',
  },
  evidencePhoto: {
    title: 'Evidence photo',
    description:
      'The same camera frame in four sizes. Time from the camera is always on the photo, from size S up.',
  },
  needsAttention: {
    title: 'Needs-attention item',
    description:
      'One visit that needs a person. Photo first, then what happened in plain words, then who owns it.',
  },
  chartTooltip: {
    title: 'Chart tooltip',
    description: 'Shows the numbers behind a bar, and what a click will open.',
  },
  visitTable: {
    title: 'Visit table',
    description:
      'The nine columns from the brief, in the same order. One vehicle visit is one row. Outward rows say “Not required” for disinfection.',
  },
  formControls: {
    title: 'Form controls',
    description:
      'Used in the assign drawer and the close-with-reason window. A selected choice gets a blue edge, so it is clear even without colour.',
  },
  states: {
    title: 'Empty, offline, analysing and loading',
    description:
      'What the screen says when there is nothing to show, when a camera is down, while footage is still being checked, and while data loads. Each one says what happened and what to do next.',
  },
};

/** Sample values shown in the component variants (the masters on board C-01). */
export const gallerySamples = {
  avatars: ['RM', 'EC', 'SJ'],
  kpi: {
    count: {
      label: 'Observed inward visits',
      value: '48',
      unit: 'visits',
      badge: '+6',
      spark: [4, 9, 8, 6, 5, 5, 4, 4, 3],
      footnote: 'vs last Monday, same time · by hour',
    },
    coverage: {
      label: 'Inward inspection coverage',
      value: '93%',
      caption: '42 of 45 judged',
      bar: { observed: 42, notObserved: 3, notJudged: 3 },
      footnote: '3 not seen · 3 not judged',
    },
    hidden: {
      label: 'Entry-disinfection coverage',
      value: '31',
      unit: 'seen',
      badge: '% hidden',
      bar: { observed: 31, late: 2, notObserved: 1, notJudged: 14 },
      footnote: 'Only 34 of 48 visits could be judged',
    },
    review: {
      label: 'Visits needing review',
      value: '14',
      unit: 'open',
      badge: '5 no owner',
      caption: '9 already have an owner',
      link: 'Open review list',
    },
  },
  photo: { image: 'haze-spray-inward' as const, time: '07:41:56', camera: 'CAM 02 · SPRAY ARCH' },
  tooltip: {
    title: '07:00–08:00 · Inward',
    rows: [
      { series: 'Observed' as const, value: 7 },
      { series: 'Not observed' as const, value: 1 },
      { series: 'Needs review' as const, value: 1 },
    ],
    footer: 'Click to see these 9 visits',
  },
  radio: {
    label: 'Confirmed: activity observed on review',
    helper: 'The step will show as observed, confirmed by a reviewer.',
  },
  person: { name: 'Emily C', initials: 'EC', role: 'QA reviewer · Unit 3', open: '3 open' },
  checkbox: 'Send an app and email alert',
  textArea: { label: 'Note for the reviewer', value: 'Please check the spray clip from 07:38 to 07:42.' },
};
