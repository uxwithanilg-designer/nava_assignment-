/**
 * Screen map: every frame on the Figma page "06 UI screens", its route and its baseline screenshot.
 * Used by the /screens developer page and by tests/visual.spec.ts.
 */
const FIGMA_FILE = 'https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled';

export interface ScreenEntry {
  number: string;
  name: string;
  route: string;
  node: string;
  figma: string;
  /** Baseline screenshot in qa/figma (1440 px wide, 1x). */
  baseline: string;
  /** Full-page screenshot (scrolling screens) or viewport only (05, OV, 11, 13). */
  fullPage: boolean;
  width: number;
  height: number;
}

const s = (
  number: string,
  name: string,
  route: string,
  node: string,
  baseline: string,
  height: number,
  fullPage = true,
): ScreenEntry => ({
  number,
  name,
  route,
  node,
  figma: `${FIGMA_FILE}?node-id=${node.replace(':', '-')}`,
  baseline,
  fullPage,
  width: 1440,
  height,
});

export const SCREENS: ScreenEntry[] = [
  s('01', 'Management overview', '/overview', '72:4249', '01-management-overview.png', 1697),
  s('02', 'GV-01 — Gate dashboard', '/gate', '54:296', '02-gate-dashboard.png', 2275),
  s('02b', 'GV-01 — Disinfection by hour', '/gate?chart=disinfection', '90:6507', '02b-disinfection-by-hour.png', 2275),
  s('03', 'GV-01 — Drilled down to one hour', '/gate?hour=07', '70:3453', '03-drilled-hour.png', 2328),
  s('04', 'SH-03 — Visit needs review', '/gate/visits/TV-0412', '68:2109', '04-visit-needs-review.png', 1462),
  s('05', 'SH-03 — Assign drawer', '/gate/visits/TV-0412/assign', '68:3764', '05-assign-drawer.png', 900, false),
  s('06', 'SH-03 — Assigned, ready to close', '/gate/visits/TV-0412?demo=assigned', '68:2657', '06-assigned.png', 1462),
  s('OV', 'Close with reason (overlay)', '/gate/visits/TV-0412/close', '76:4953', 'OV-close-with-reason.png', 900, false),
  s('07', 'SH-03 — Closed with a reason', '/gate/visits/TV-0412?demo=closed', '68:3214', '07-closed.png', 1462),
  s('08', 'SH-03 — Camera blocked, not a violation', '/gate/visits/TV-0431', '69:2535', '08-camera-blocked.png', 1544),
  s('09', 'SH-03 — Outward, inspection not seen', '/gate/visits/TV-0419', '69:3087', '09-outward-not-seen.png', 1317),
  s('10', 'SH-03 — Which truck? Link needs review', '/gate/visits/TV-0438', '69:3539', '10-which-truck.png', 1465),
  s('11', 'Evidence viewer', '/gate/visits/TV-0412/evidence/disinfection', '73:4594', '11-evidence-viewer.png', 900, false),
  s('12', 'Settings — SOP step order', '/settings/sop', '75:4687', '12-settings-sop.png', 1498),
  s('13', 'States — empty, offline, analysing, loading', '/states', '86:5032', '13-states.png', 900, false),
];

export const COMPONENTS_BOARD = `${FIGMA_FILE}?node-id=48-83`;
