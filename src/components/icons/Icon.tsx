import type { CSSProperties } from 'react';
import type { IconName } from './iconNames';

/*
 * Icons are the SVGs exported from Figma (src/assets/icons), with stroke/fill set to currentColor.
 * We keep the 24px viewBox and the 1.75 stroke, and scale the whole icon, exactly like Figma does
 * (a 12px icon in Figma renders with a 0.875 effective stroke).
 */
const rawIcons = import.meta.glob('../../assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const ICON_BODIES: Record<string, { viewBox: string; body: string }> = {};
for (const [path, svg] of Object.entries(rawIcons)) {
  const name = path.slice(path.lastIndexOf('/') + 1, -'.svg'.length);
  const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1] ?? '0 0 24 24';
  const body = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  ICON_BODIES[name] = { viewBox, body };
}

export interface IconProps {
  name: IconName;
  /** Rendered size in px (Figma uses 12, 14, 15, 16, 18 and 20). */
  size?: number;
  /** Any CSS colour, normally a token: `var(--text-secondary)`. Defaults to currentColor. */
  color?: string;
  className?: string;
  style?: CSSProperties;
  /** Accessible label. Without it the icon is decorative (aria-hidden). */
  label?: string;
}

export function Icon({ name, size = 16, color, className, style, label }: IconProps) {
  const icon = ICON_BODIES[name];
  if (!icon) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="none"
      style={{ color, flexShrink: 0, ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
