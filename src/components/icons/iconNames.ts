/** The 97 line icons from Figma frame "Icons — 1.75 stroke, 24 grid" (node 17:2). */
export const ICON_NAMES = [
  'home', 'grid', 'users', 'user', 'user-check', 'calendar', 'clock', 'search', 'bell', 'settings',
  'shield', 'shield-check', 'shield-alert', 'alert', 'check', 'check-circle', 'x', 'x-circle', 'plus',
  'minus', 'chevron-right', 'chevron-left', 'chevron-down', 'arrow-right', 'arrow-down', 'arrow-up-right',
  'arrow-down-left', 'log-in', 'log-out', 'building', 'map-pin', 'monitor', 'message', 'file', 'pen',
  'camera', 'camera-off', 'cctv', 'video', 'image', 'eye', 'eye-off', 'truck', 'droplets', 'egg',
  'feather', 'factory', 'warehouse', 'gate', 'flame', 'chart-bar', 'chart-line', 'pie', 'list', 'filter',
  'download', 'more', 'link', 'unlink', 'zap', 'sparkle', 'server', 'layers', 'book', 'play', 'pause',
  'history', 'refresh', 'tag', 'flag', 'help', 'info', 'route', 'workflow', 'database', 'target', 'layout',
  'clipboard', 'file-check', 'lock', 'maximize', 'zoom-in', 'sliders', 'mail', 'phone', 'sun', 'moon',
  'hash', 'scan', 'vest', 'award', 'lightbulb', 'compass', 'puzzle', 'heart', 'smile', 'frown',
] as const;

export type IconName = (typeof ICON_NAMES)[number];
