/** Workspace switcher in the sidebar and the shared top-bar camera status. */
export const workspace = {
  initials: 'SG',
  name: 'Sakku Group',
  meta: '3 units · 6 gates',
  /** Orange badge on "Review list" in the sidebar. */
  reviewBadge: 5,
} as const;

export const topBarStatus = {
  camerasLive: '5 cameras live',
  cameraNote: '1 partial view',
} as const;
