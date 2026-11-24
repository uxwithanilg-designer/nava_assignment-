/**
 * SOPs (screen 12 · Settings — SOP step order, Figma 75:4687).
 * Each unit sets the steps it expects at the gate; the AI checks every visit against the active version.
 * Changes apply to new visits only: old visits keep the version they were checked with,
 * so past results never change.
 */
import type { IconName } from '@/components/icons';
import { people } from '@/data/people';
import type { Sop } from '@/types/domain';

export interface SopListEntry extends Sop {
  /** "Unit 3 · Inward" */
  name: string;
  /** "v2 · 4 steps" */
  meta: string;
}

const entry = (sop: Sop): SopListEntry => ({
  ...sop,
  name: `${sop.unit} · ${sop.direction}`,
  meta: `${sop.version} · ${sop.stepCount} steps`,
});

/** "SOPs by unit" list, in Figma order. */
export const sopList: SopListEntry[] = [
  entry({
    id: 'unit3-inward',
    unit: 'Unit 3',
    direction: 'Inward',
    version: 'v2',
    stepCount: 4,
    active: true,
  }),
  entry({
    id: 'unit3-outward',
    unit: 'Unit 3',
    direction: 'Outward',
    version: 'v1',
    stepCount: 2,
    active: true,
  }),
  entry({
    id: 'unit1-inward',
    unit: 'Unit 1',
    direction: 'Inward',
    version: 'v3',
    stepCount: 4,
    active: true,
  }),
  entry({
    id: 'unit1-outward',
    unit: 'Unit 1',
    direction: 'Outward',
    version: 'v1',
    stepCount: 2,
    active: true,
  }),
  entry({
    id: 'unit2-inward',
    unit: 'Unit 2',
    direction: 'Inward',
    version: 'v2',
    stepCount: 4,
    active: true,
  }),
  entry({
    id: 'unit2-outward',
    unit: 'Unit 2',
    direction: 'Outward',
    version: 'v1',
    stepCount: 2,
    active: true,
  }),
];

/** The SOP open in the editor (and the one visits on screens 04–08 are checked against). */
export const DEFAULT_SOP_ID = 'unit3-inward';

export interface SopStepConfig {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  /** Rule tags under the description ("Before entry", "At least 30 s", "After entry = Late"…). */
  tags: string[];
  /** Camera the step is checked on, "CAM 01 · Outside gate". */
  camera: string;
  required: boolean;
}

export interface SopRule {
  id: string;
  title: string;
  description: string;
  on: boolean;
  /** Not available yet (greyed row with a "Phase 2" chip, no toggle). */
  phase2?: boolean;
}

export interface SopDetail {
  sopId: string;
  /** "Unit 3 · Inward visit" */
  title: string;
  /** "Active · v2" */
  status: string;
  /** "Changed 12 Nov by Dr Sarah J" */
  changed: string;
  /** Blue info box above the steps. */
  notice: string;
  steps: SopStepConfig[];
  rules: SopRule[];
}

export const sopDetail: SopDetail = {
  sopId: 'unit3-inward',
  title: 'Unit 3 · Inward visit',
  status: 'Active · v2',
  changed: `Changed 12 Nov by ${people.sarah.name}`,
  notice:
    'Changes apply to new visits from tomorrow, 00:00. Old visits keep the version they were checked with, so past results never change.',
  steps: [
    {
      id: 'approach',
      title: 'Approach',
      description: 'Vehicle stops before the outer gate. This starts the visit.',
      icon: 'truck',
      tags: ['Starts the visit'],
      camera: 'CAM 01 · Outside gate',
      required: true,
    },
    {
      id: 'inspection',
      title: 'Security inspection',
      description: 'A person in the security vest is next to the vehicle.',
      icon: 'vest',
      tags: ['Before entry', 'At least 30 s'],
      camera: 'CAM 01 · Outside gate',
      required: true,
    },
    {
      id: 'disinfection',
      title: 'Disinfection',
      description: 'Spray is seen on the tyres and underside of the vehicle.',
      icon: 'droplets',
      tags: ['Before entry', 'After entry = Late'],
      camera: 'CAM 02 · Spray arch',
      required: true,
    },
    {
      id: 'entry',
      title: 'Entry',
      description: 'Vehicle crosses the gate line. All other steps are timed against this.',
      icon: 'gate',
      tags: ['Reference time'],
      camera: 'CAM 03 · Gate line',
      required: true,
    },
  ],
  rules: [
    {
      id: 'camera-view',
      title: 'Camera view is low or blocked',
      description: 'Mark the step “Needs review”. Never count it as a violation.',
      on: true,
    },
    {
      id: 'two-vehicles',
      title: 'Two vehicles at the gate within 2 minutes',
      description: 'Ask a person to confirm which truck each step belongs to.',
      on: true,
    },
    {
      id: 'short-step',
      title: 'Step seen, but shorter than the minimum time',
      description: 'Mark the step “Needs review” instead of “Observed”.',
      on: true,
    },
    {
      id: 'focus-po',
      title: 'Match the visit with a Focus PO or gate pass',
      description: 'Needs the Focus connection and number plate reading.',
      on: false,
      phase2: true,
    },
  ],
};

/** Page copy and the "Save as v3" target (the Figma prototype goes back to visit TV-0412, screen 04). */
export const sopSettingsPage = {
  title: 'SOP step order',
  subtitle:
    'Each unit sets the steps it expects at the gate. The AI checks every visit against the active version.',
  breadcrumb: ['Settings', 'SOP step order'],
  saveLabel: 'Save as v3',
  saveTo: '/gate/visits/TV-0412',
} as const;
