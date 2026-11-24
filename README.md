# NAVA Vision AI · GateView — React UI

A clickable front end for every screen on the Figma page **"06 UI screens"** of the GateView design:
14 screens and 1 overlay. It is built in React with mock data only. There is no backend, no API calls and no real KPIs.

- Figma file: <https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled> (page `16:7`, components board `48:83`)
- Spec: [`docs/BUILD_PROMPT.md`](docs/BUILD_PROMPT.md) · notes on the Figma file: [`docs/figma-notes.md`](docs/figma-notes.md)

## Run it

Requires Node 18 or newer (built with Node 24 / npm 11).

```bash
npm install
npm run dev          # http://localhost:5173  ( / redirects to /gate )
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | Type-check (`tsc -b`, strict) + production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint (flat config in `eslint.config.js`) |
| `npm run format` | Prettier |
| `npm run qa:install` | One-time: download Playwright's Chromium |
| `npm run qa:visual` | Visual QA: screenshot every route and diff it against Figma |

## Screens and routes

Every route below is also listed on the developer page **`/screens`**, which has a **Reset demo data** button. **`/components`** shows every Figma component and variant, laid out like board C-01.

| # | Screen | Route | Figma |
|---|---|---|---|
| 01 | Management overview | `/overview` | [72:4249](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=72-4249) |
| 02 | GV-01 — Gate dashboard | `/gate` | [54:296](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=54-296) |
| 02b | GV-01 — Disinfection by hour | `/gate?chart=disinfection` | [90:6507](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=90-6507) |
| 03 | GV-01 — Drilled down to one hour | `/gate?hour=07` | [70:3453](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=70-3453) |
| 04 | SH-03 — Visit needs review | `/gate/visits/TV-0412` | [68:2109](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=68-2109) |
| 05 | SH-03 — Assign drawer | `/gate/visits/TV-0412/assign` | [68:3764](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=68-3764) |
| 06 | SH-03 — Assigned, ready to close | `/gate/visits/TV-0412?demo=assigned` | [68:2657](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=68-2657) |
| OV | Close with reason (overlay) | `/gate/visits/TV-0412/close` | [76:4953](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=76-4953) |
| 07 | SH-03 — Closed with a reason | `/gate/visits/TV-0412?demo=closed` | [68:3214](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=68-3214) |
| 08 | SH-03 — Camera blocked, not a violation | `/gate/visits/TV-0431` | [69:2535](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=69-2535) |
| 09 | SH-03 — Outward, inspection not seen | `/gate/visits/TV-0419` | [69:3087](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=69-3087) |
| 10 | SH-03 — Which truck? Link needs review | `/gate/visits/TV-0438` | [69:3539](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=69-3539) |
| 11 | Evidence viewer | `/gate/visits/TV-0412/evidence/disinfection` | [73:4594](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=73-4594) |
| 12 | Settings — SOP step order | `/settings/sop` | [75:4687](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=75-4687) |
| 13 | States — empty, offline, analysing, loading | `/states` | [86:5032](https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=86-5032) |

Other hours of the chart open `/gate?hour=HH` with the 03 layout, filled from mock data. Only 07:00 is checked against Figma.

### Prototype flows

1. **Review, assign and close a visit** (starts at 02). Open review list → 04 → Assign → 05 → "Assign to Emily C" → 06 (toast with Undo; it hides after about 6 s) → Close visit → OV → Close visit → 07 → Next visit → 08.
2. **Management view to one unit** (starts at 01). Unit 3 row, its "Open" or "Open GateView" → 02. TV-0412 in "Waiting the longest" → 04.
3. **Camera blocked visit** (starts at 08). Close visit opens OV with "Not evaluable: camera or visibility issue" pre-selected.

All links from section 6 of the spec work, including the sidebar, Back / Next / Prev, the SOP chip, Watch clip and "I can see spraying" (which opens OV with reason 1). They also include Save as v3 and the hour chip ×. Elements without a Figma link (Export, Share link, pagination, other modules…) are real buttons with hover and focus states that do nothing.

### Demo state

The review state lives in `src/store/reviewStore.tsx` (React Context + `useReducer`). It is saved to `sessionStorage`, so a refresh keeps it. "Reset demo data" on `/screens` clears it.

- **TV-0412:** needs review → assigned to Emily C → closed with a reason.
- **TV-0438:** the truck link goes from unclear → confirmed.
- **Other visits:** closing any other visit uses the same closed pattern as 07.
- **Deep links:** `?demo=assigned` / `?demo=closed` open 06 / 07 directly, and their toasts stay visible.
- **Dashboards:** 01 and 02/02b/03 never change; they stay exactly as designed.

## Visual QA

`tests/visual.spec.ts` opens every route at 1440×900 (deviceScaleFactor 1) and waits for fonts and images, with animations off. It takes a full-page screenshot (viewport only for 05, OV, 11, 13) and diffs it against the Figma baseline in `qa/figma/` with pixelmatch (threshold 0.1).

- **Outputs:** app screenshots go to `qa/app/`, diff images to `qa/diff/`, and the table to [`qa/diff/report.md`](qa/diff/report.md).
- **Running a subset:** `SCREENS=02,02b npm run qa:visual`.
- **Using a running server:** set `BASE_URL=http://127.0.0.1:5173`.

| Screen | Mismatch % | Page height (app / Figma) |
|---|---|---|
| 01 Management overview | 1.19 | 1697 / 1697 |
| 02 Gate dashboard | 1.63 | 2275 / 2275 |
| 02b Disinfection by hour | 1.64 | 2275 / 2275 |
| 03 Drilled down to one hour | 1.59 | 2328 / 2328 |
| 04 Visit needs review | 1.43 | 1462 / 1462 |
| 05 Assign drawer | 1.80 | 900 / 900 |
| 06 Assigned, ready to close | 1.52 | 1462 / 1462 |
| OV Close with reason | 1.98 (modal; whole frame 20.23, see below) | 900 / 900 |
| 07 Closed with a reason | 1.54 | 1462 / 1462 |
| 08 Camera blocked | 1.50 | 1544 / 1544 |
| 09 Outward, inspection not seen | 1.45 | 1317 / 1317 |
| 10 Which truck? | 1.44 | 1465 / 1465 |
| 11 Evidence viewer | 0.97 | 900 / 900 |
| 12 Settings — SOP step order | 1.28 | 1498 / 1498 |
| 13 States | 1.53 | 900 / 900 |

The remaining mismatch is text anti-aliasing. Chromium uses subpixel (coloured) anti-aliasing and Figma uses greyscale, and Inter's glyph advances differ by fractions of a pixel. pixelmatch at 0.1 barely sees light-on-light differences, so every screen was also compared side by side, region by region.

## What could not be matched exactly, and why

- **OV background.** The Figma OV frame draws the modal on a plain dim fill. The spec asks for the modal over the current visit page, so the app shows the dimmed page behind it. The modal itself is scored (1.98%); the whole frame differs by 20% because of the page behind the dim.
- **Font rasterisation.** Same fonts, sizes, weights and line heights as Figma, but Chrome's text rendering differs slightly, as described above. One line ("Reason: Confirmed: activity observed on review" on 07) measures 298.1 px in Chrome against a 298 px box. It gets 2 px of slack so it breaks like Figma.
- **Evidence viewer colours.** Frame 11 uses a few dark fills that are not NV variables. They are added as `--viewer-*` tokens in `tokens.css`.
- **Evidence viewer answers.** "No spraying" and "Still unclear" have no selected state in Figma. A 2 px accent ring marks the chosen answer.
- **SOP list.** Figma only has editor content for "Unit 3 · Inward v2". Selecting another SOP moves the highlight but keeps that editor, so no copy is invented.
- **02b chart bars.** These link to `/gate?chart=disinfection&hour=HH`, which uses the 03 layout. Figma has no frame for this.
- **Board C-01 baseline.** The baseline (`qa/figma/C-01-components.png`) is exported at about 0.53× (1920×7673 board), so `/components` is compared with it by eye.

## Layout rules

- **At 1440 px:** pixel-exact (240 px sticky sidebar + 1200 px main column, 32 px content padding).
- **From 1280 to 1920 px:** the main column is fluid. Two-column rows keep the Figma ratios with grid `fr` units: 692 : 420 on the dashboard and 736 : 376 on visit pages. Below 1440 the filter row and chips wrap, and the visits table scrolls sideways inside its panel.
- **Below 1280 px:** `min-width: 1280px`, so the page scrolls horizontally.

## Tech and structure

Vite 5 · React 18 · TypeScript (strict) · React Router 6 data router (v7 future flags on) · CSS Modules + CSS custom properties · `clsx` · self-hosted `@fontsource` Poppins / Inter / JetBrains Mono. No UI kit and no chart library: the charts are hand-drawn SVG/CSS. Dev tools are ESLint 9, Prettier and Playwright + pixelmatch + pngjs.

```
src/
├─ app/            App, router (all routes), providers, screens.ts (screen map used by /screens and QA)
├─ styles/         reset, tokens.css (Figma variables), typography.css (one class per text style), globals
├─ assets/         logo, 97 Figma icons (currentColor SVG), 5 evidence images (WebP)
├─ components/
│  ├─ icons/       <Icon name size color /> with a typed name union
│  ├─ ui/          Avatar, Button, IconButton, StatusChip, ReviewTag, EvidenceQuality, LegendItem, Segment,
│  │               SegmentedControl, Tab, Filter, Checkbox, RadioOption, PersonOption, TextArea, Toggle,
│  │               Toast, Modal, Drawer, Banner, InfoLine
│  ├─ layout/      AppShell, Sidebar, NavItem, TopBar, PageHeader, Panel, FilterBar
│  ├─ data/        KpiCard, KpiGroup, ModuleTile, EvidencePhoto, NeedsAttentionItem, NeedsAttentionList,
│  │               TableHeader, VisitRow, VisitTable, StateBlock, Skeleton
│  └─ charts/      MirroredHourChart, ChartTooltip, MiniBars, CoverageBar, TrendLineChart
├─ features/       overview (01) · gate (02, 02b, 03) · visit (04–10, drawer, modal) · evidence (11) ·
│                  settings (12) · states (13) · dev (/screens, /components)
├─ data/           typed mock data (all numbers and copy shown on screens)
├─ store/          review state (Context + useReducer, sessionStorage)
├─ lib/coverage.ts getCoverageDisplay(): % only with ≥ 80% judged and ≥ 10 visits, else "% hidden" + reason
└─ types/domain.ts Unit, Gate, Camera, Visit, VisitStep, Evidence, ReviewState, Person, Sop, KpiSet, HourBucket
qa/                figma/ (baselines) · app/ (screenshots) · diff/ (diffs + report.md)
tests/visual.spec.ts
```

### Notes

- **Component props.** Figma component props map to typed React props with the same variant names. One exception: the Button's Figma property "Type" is called `variant`, because `type` is the HTML button attribute.
- **Icons.** All 97 icons are exported from Figma; none was replaced with another icon set.
- **ESLint config.** ESLint 9 uses the flat config `eslint.config.js` instead of `.eslintrc.cjs`.
- **Project location.** The project lives in `D:\Assignment\NAVA\gateview-ui`. Drive F: is a 0.5 GB FAT32 partition and could not hold `node_modules`.
- **Git.** The work is on branch `feature/gateview-ui`, one commit per build step.
