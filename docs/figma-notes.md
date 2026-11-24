# Figma notes

Things noticed while reading the Figma file (`K7pIHObtQV7R11Y4Mt2Vpm`) that the build prompt does not spell out, and how the code handles them.

## Shell and layout

- **Sidebar.** Each screen has a 240×900 `Sidebar` instance at the top plus a full-height "Sidebar background" rectangle in `bg/nav`. The app reproduces this with a full-height navy column and a `position: sticky; height: 100vh` sidebar inside it.
- **Content padding.** The content column uses 32 px side padding and a 24 px gap between sections. Top padding is 24 px on most screens and 28 px on the gate dashboard (02, 02b, 03). Bottom padding is 48 px on every scrolling screen, which makes the page heights match the frames.
- **Page header height.** On 02/02b/03 the page header is 100 px tall because it holds a fixed 100 px spacer, with the text block centred. On 01, 12 and 13 the header hugs its content (61 px). `PageHeader` takes a `height` prop for this.
- **Buttons.** A Primary button at size M is 38 px tall (no border). A Secondary button is 40 px tall (1 px border). Figma has the same mismatch, and it is kept.

## Icons

- **Icon export.** Every icon export contained two background rects (page `#F5F5F5` and the white board), plus strokes in `#0A1A2E`. The cleaned SVGs in `src/assets/icons` keep only the icon paths, set to `stroke="currentColor"`.
- **Icon colour.** Figma colours icons per instance. The colour is only visible inside each instance's asset SVG, so it was read there and mapped to tokens. Examples:
  - nav icons use `text/nav`, and the active one uses `cyan/400`;
  - status-chip icons use the status main colour;
  - filter icons use `text/tertiary` and the chevron `text/secondary`;
  - "Changed" filters use `text/brand`.
- **Stroke width.** Figma scales the stroke with the icon (0.875 at 12 px, 1.3125 at 18 px). `<Icon>` keeps the 24 px viewBox and 1.75 stroke and scales the whole SVG, which gives the same result.

## Logo and images

- **Logo export.** The full export of node `49:142` includes the sidebar's navy rectangle and board backgrounds. The project uses the vector-only export: white paths, transparent, 76×18.3757.
- **Evidence images.** Each image is a 480×270 frame in Figma, but the source images are 1536×864, which is 3.2× that frame. They are stored as WebP (quality 92) at the full 1536×864 size. That is more than the 2× the prompt asks for, and keeps the Evidence viewer's large frame sharp.

## Components board

- **Baseline size.** Board C-01 (`48:83`) is 1920×7673. Its baseline in `qa/figma/C-01-components.png` was rendered at about 0.53× (the 4096 px export cap). `/components` should be compared with it by eye.

## Visual QA

- **Lenient metric.** pixelmatch at threshold 0.1 barely counts light-on-light differences, such as a white panel on the `bg/canvas` grey. So every screen was also compared side by side, region by region, and not only by the mismatch %.
