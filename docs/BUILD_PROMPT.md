# Build prompt: NAVA Vision AI · GateView — React UI from Figma

You are a senior front-end engineer. Build a **React.js UI** that reproduces **every screen on the Figma page "06 UI screens"** of the GateView design file, **pixel for pixel**, as a clickable front-end application. Read this whole document before you write any code. If something here and the Figma file disagree on a visual detail, **Figma wins**. If something here and Figma disagree on behaviour or scope, **this document wins**.

---

## 0. The non-negotiables

1. **100% visual match with Figma** at a 1440 px wide desktop viewport: same layout, spacing, sizes, colours, fonts, font weights, line heights, radii, borders, shadows, icons, images, chart shapes and copy. Do not "improve", restyle or re-word anything.
2. **Every frame on the "06 UI screens" page gets built**: 14 screens + 1 overlay = 15 frames (list in section 4). Nothing is skipped, nothing extra is invented.
3. **UI only. No backend, no APIs, no real KPIs.** All numbers, names, visits and images come from local mock data that copies what the Figma screens show. Do not call any network service.
4. **Use the same images that are in Figma.** Export them from Figma into the project. Never hot-link Figma asset URLs, because they expire.
5. **The prototype flow must work like the Figma prototype.** Every link in section 6 must work. Navigation uses real routes so each screen has its own URL.
6. **Clean, scalable folder structure**, typed code, reusable components that mirror the Figma components 1:1 (same names, same variants).
7. **Do not edit the Figma file.** It is read-only for you.
8. **Names:** the design uses US names only: Ryan M (RM), Emily C (EC), Dr Sarah J (SJ), David B. Use exactly what Figma shows. Do not add any other names.

---

## 1. Figma access (do this first)

- File: **https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled**
- File key: `K7pIHObtQV7R11Y4Mt2Vpm`
- Page to build: **"06 UI screens"** (page id `16:7`)
- Reference pages (read, do not build): "05 Design system" (`16:6`) for brand boards and components; "00"–"04" are UX process boards that explain the product.

Use the **Figma MCP server** (connected in this environment). For every node you build:

- `get_design_context` on the node: exact layout, auto-layout direction, gaps, padding, sizes, fills, strokes, radii, effects, text styles and asset URLs.
- `get_screenshot` on the node: the visual reference. Save it under `qa/figma/` for the comparison step.
- `get_variable_defs`: confirm the tokens in section 3.
- Download assets (logo, icons, images) from the URLs that `get_design_context` returns, or with the Figma asset download tool. Store them under `src/assets/`.

**If the Figma MCP tools are not available, or you cannot open this file, stop and tell me.** Do not guess the design.

Work section by section, not whole-frame-at-once. Large frames (02 is 1440×2275) should be read per section using the section node IDs in section 5.

---

## 2. What the application is (context you need)

**NAVA Vision AI** is a platform built by NAVA Software Solutions for **Sakku Group**, a poultry company with farms ("units"), each with a feed mill, bird sheds, an egg store and gates. Existing **CCTV cameras** record the farm. An **AI backend** watches the video and checks whether the required procedure steps (the **SOP**) happened. The dashboard shows the results, with photo proof, and lets a person review the unclear ones.

The design assignment covers the **GateView** module: vehicles coming in and going out of the farm gates.

- **Inward visit** steps (SOP "Unit 3 · Inward v2"): Approach → Security inspection → Disinfection (spray before entry) → Entry.
- **Outward visit** steps (SOP "Unit 3 · Outward v1"): Security inspection → Exit. Disinfection is not required for outward visits.
- Each vehicle visit has a **temporary visit ID** like `TV-0412` (number plate reading and Focus PO / gate-pass matching are Phase 2, so the UI never shows a plate number).

**Users in the design:** Ryan M (facility manager, Unit 3, the signed-in user, avatar "RM"), Emily C (QA reviewer), Dr Sarah J (biosecurity lead), David B (group operations, management view).

**The four status families (never mix them):**

| Family | Values | Figma component |
|---|---|---|
| Step result | Observed · Not observed · Late · Needs review (also Not required, Phase 2) | `Status chip` |
| Evidence quality | Good · Partial · Low visibility · Camera blocked | `Evidence quality` |
| Link to vehicle | Auto-matched · Unclear · Not matched · Confirmed by reviewer · Marked wrong | text + chip inside the "Which truck?" panel |
| Review status | No owner · Assigned (with person) · Closed · None ("No review needed") | `Review tag` |

**Rules the UI follows (they explain the design, keep them in code comments and in the data model):**

- A camera problem (blocked, low visibility) is **not a violation**. It becomes "Needs review" and stays out of the coverage %.
- Coverage % is shown only when the base is reliable: **at least 80% of visits judged and at least 10 visits**. Otherwise the card shows a count plus "% hidden" and the reason. Implement this as a pure function `getCoverageDisplay()` in `src/lib/coverage.ts`, and make the mock data produce exactly what Figma shows (93% / 95% / "% hidden" on 02; counts on 03).
- Violet always means "could not judge". It is never counted as "not observed".
- Wording: say "Observed", never "Verified" or "Passed". Talk about the step, never blame a person.
- A missing step shows the **camera recording for that time window**, never a made-up photo.

---

## 3. Branding and design tokens

All values below come from the Figma variables and styles. Put them in `src/styles/tokens.css` as CSS custom properties with these exact names (replace `/` with `-`), and use them everywhere. **No hard-coded hex values in components.**

### 3.1 Brand

- Logo: **NAVA logo** (the client's own logo). Export as SVG from the Sidebar component: node `49:142` ("NAVA logo", white on navy, 76×18). The brand board versions are nodes `44:30`, `44:50`, `44:69`, `44:80`. The lockup in the sidebar is: logo · 1 px divider · "Vision AI".
- Workspace switcher in the sidebar: "SG" badge (orange) · "Sakku Group" · "3 units · 6 gates".
- Personality: calm navy product, signal blue for actions, orange only for attention counts ("no owner"), status colours only for status.

### 3.2 Primitive colours (`NV/Primitives`)

| Token | Hex | Token | Hex |
|---|---|---|---|
| navy/950 | #0A1A2E | grey/0 | #FFFFFF |
| navy/900 | #00194A | grey/25 | #F8FAFC |
| navy/800 | #002467 | grey/50 | #F1F4F8 |
| navy/700 | #00328F | grey/100 | #E5E9F0 |
| navy/100 | #DCE6F5 | grey/200 | #CED5DF |
| navy/50 | #F0F4FB | grey/400 | #8A96A8 |
| blue/700 | #0071C2 | grey/600 | #556275 |
| blue/500 | #019DFE | grey/800 | #2A3546 |
| blue/100 | #D9EFFF | green/600 | #1A8A50 |
| blue/50 | #F0F7FF | green/100 | #E2F4EA |
| cyan/400 | #4FCEDB | green/800 | #11693B |
| cyan/100 | #DDF5F8 | red/600 | #D32F3A |
| orange/500 | #FF9900 | red/100 | #FCE5E6 |
| orange/100 | #FFF1DB | red/800 | #A51F29 |
| amber/600 | #C26A00 | violet/600 | #6B4FD8 |
| amber/100 | #FFF0D6 | violet/100 | #EEE9FD |
| amber/800 | #8A4B00 | violet/800 | #4B32A8 |
| slate/600 | #657386 | slate/100 | #ECEFF4 |
| slate/800 | #434F60 | | |

### 3.3 Semantic colours (`NV/Color`, mode Light)

```
bg/canvas → grey/50          bg/surface → grey/0          bg/subtle → grey/25
bg/muted → grey/100          bg/inverse → navy/950        bg/nav → navy/900
bg/brand → navy/800          bg/brand-subtle → navy/50    bg/accent → blue/500
bg/accent-subtle → blue/50   bg/highlight → orange/500    bg/highlight-subtle → orange/100
bg/nav-hover #0C2A5E         bg/nav-active #163C7A
text/primary → navy/950      text/secondary → grey/600    text/tertiary → grey/400
text/inverse → grey/0        text/brand → navy/700        text/link → blue/700
text/on-brand → grey/0       text/nav #B4C3DC             text/nav-muted #7389AE
border/subtle → grey/100     border/default → grey/200    border/strong → grey/400
border/focus → blue/500      border/nav #1A3769
action/primary → navy/700    action/accent → blue/500     action/dark → navy/950
status/observed → green/600      status/observed-bg → green/100      status/observed-text → green/800
status/missing → red/600         status/missing-bg → red/100         status/missing-text → red/800
status/late → amber/600          status/late-bg → amber/100          status/late-text → amber/800
status/review → violet/600       status/review-bg → violet/100       status/review-text → violet/800
status/obstructed → slate/600    status/obstructed-bg → slate/100    status/obstructed-text → slate/800
status/info → blue/500           status/info-bg → blue/50            status/info-text → blue/700
chart/observed #4A9F76   chart/missing #D32F3A   chart/late #D97A00   chart/review #6B4FD8
chart/track #EDF0F5      chart/axis #CED5DF
chart/1 → navy/700   chart/2 → blue/500   chart/3 → cyan/400   chart/4 → orange/500
```

### 3.4 Size tokens (`NV/Size`)

- Spacing: 4, 8, 12, 16, 20, 24, 32, 48, 64 (`--space-4` … `--space-64`)
- Radius: sm 6, md 8, lg 12, xl 16, 2xl 24, full 999

### 3.5 Text styles

| Style | Font | Weight | Size / line height | Letter spacing |
|---|---|---|---|---|
| NV/Display/XL | Poppins | 600 | 48 / 58 | -1.5% |
| NV/Display/L | Poppins | 600 | 36 / 46 | -1% |
| NV/Display/M | Poppins | 600 | 28 / 38 | -0.6% |
| NV/Display/S | Poppins | 600 | 22 / 30 | -0.3% |
| NV/Title/Page | Poppins | 600 | 26 / 34 | -0.5% |
| NV/Number/KPI | Poppins | 600 | 34 / 40 | -1% |
| NV/Number/KPI-S | Poppins | 600 | 22 / 28 | -0.5% |
| NV/Heading/1 | Inter | 600 | 20 / 28 | -0.4% |
| NV/Heading/2 | Inter | 600 | 17 / 24 | -0.2% |
| NV/Heading/3 | Inter | 600 | 15 / 22 | -0.1% |
| NV/Title/Panel | Inter | 600 | 16 / 22 | -0.2% |
| NV/Body/L | Inter | 400 | 16 / 24 | -0.1% |
| NV/Body/M | Inter | 400 | 14 / 21 | -0.1% |
| NV/Body/M Medium | Inter | 500 | 14 / 21 | -0.1% |
| NV/Body/S | Inter | 400 | 13 / 19 | 0 |
| NV/Body/S Medium | Inter | 500 | 13 / 19 | 0 |
| NV/Body/XS | Inter | 400 | 12 / 17 | 0 |
| NV/Label/M | Inter | 600 | 13 / 18 | 0 |
| NV/Label/S | Inter | 600 | 11 / 14 | 0.2% |
| NV/Number/L | Inter | 600 | 30 / 36 | -1% |
| NV/Number/M | Inter | 600 | 22 / 28 | -0.6% |
| NV/Mono/S | JetBrains Mono | 500 | 12 / 16 | 0 |
| NV/Mono/XS | JetBrains Mono | 400 | 11 / 14 | 0 |

Letter spacing in % means % of font size (for example -1% of 34 px = -0.34 px). Create one utility class per style in `src/styles/typography.css` (for example `.t-number-kpi`). Self-host the fonts with `@fontsource/poppins` (600), `@fontsource/inter` (400, 500, 600) and `@fontsource/jetbrains-mono` (400, 500). Enable `font-feature-settings: "tnum"` where Figma numbers line up in tables and timestamps.

### 3.6 Effects

- `NV/Shadow/XS`: 0 1px 2px 0 rgba(10,26,46,0.06)
- `NV/Shadow/Card`: 0 6px 16px -4px rgba(10,26,46,0.08)
- `NV/Shadow/Float`: 0 18px 44px -10px rgba(10,26,46,0.18)

Shadows are used only where Figma uses them (floating things: drawer, modal, toast, tooltip, hover states).

### 3.7 Icons

- Figma frame **"Icons — 1.75 stroke, 24 grid"** (node `17:2`) holds **97 line icons**, named `Icon/<name>`: home, grid, users, user, user-check, calendar, clock, search, bell, settings, shield, shield-check, shield-alert, alert, check, check-circle, x, x-circle, plus, minus, chevron-right, chevron-left, chevron-down, arrow-right, arrow-down, arrow-up-right, arrow-down-left, log-in, log-out, building, map-pin, monitor, message, file, pen, camera, camera-off, cctv, video, image, eye, eye-off, truck, droplets, egg, feather, factory, warehouse, gate, flame, chart-bar, chart-line, pie, list, filter, download, more, link, unlink, zap, sparkle, server, layers, book, play, pause, history, refresh, tag, flag, help, info, route, workflow, database, target, layout, clipboard, file-check, lock, maximize, zoom-in, sliders, mail, phone, sun, moon, hash, scan, vest, award, lightbulb, compass, puzzle, heart, smile, frown.
- **Export every icon as SVG from Figma** into `src/assets/icons/`, set `stroke="currentColor"`, keep the 24 px viewBox and 1.75 stroke width, and build one `<Icon name="truck" size={16} />` component with a typed name union. Sizes used in the screens are mostly 14, 16, 18 and 20 px; read each from Figma.
- Do not swap in a different icon library. Only if an export fails for one icon, use the closest `lucide-react` icon for that one and list it in the README.

### 3.8 Images

The camera photos are **illustrative, AI-generated images** stored in Figma frame `43:17` ("Evidence images — illustrative, AI-generated"):

| Node | Name | Used for |
|---|---|---|
| 43:12 | IMG/haze-spray-inward | TV-0412 disinfection frames (mist), evidence viewer |
| 43:13 | IMG/outward-exit-no-guard | TV-0419 outward inspection frames |
| 43:14 | IMG/camera-blocked | TV-0431 blocked spray camera |
| 43:15 | IMG/late-spray | TV-0427 late spray |
| 43:16 | IMG/two-trucks-guard | TV-0438 / TV-0439 two trucks, approach/inspection frames |

Export them at 2x (PNG or WebP) into `src/assets/images/evidence/`. The `Evidence photo` component in Figma crops these images in different ways (sizes XS/S/M/L) and overlays a mono timestamp pill and blue viewfinder corners. Read each instance's crop (image fill transform) from `get_design_context` and reproduce it with `object-fit` / `object-position`, so every thumbnail shows the same part of the image as Figma. Where Figma shows the "Illustrative image" label, keep it.

---

## 4. Screens to build (all 15 frames on "06 UI screens")

Each screen is 1440 px wide. Above each screen on the canvas there is a **caption frame** ("Caption · …"): it is a note for reviewers, **not UI**. Read it for intent, do not build it.

| # | Frame name | Node | Figma link | Route | Size |
|---|---|---|---|---|---|
| 01 | 01 · Management overview | 72:4249 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=72-4249 | `/overview` | 1440×1697 |
| 02 | 02 · GV-01 — Gate dashboard | 54:296 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=54-296 | `/gate` | 1440×2275 |
| 02b | 02b · GV-01 — Disinfection by hour | 90:6507 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=90-6507 | `/gate?chart=disinfection` | 1440×2275 |
| 03 | 03 · GV-01 — Drilled down to one hour | 70:3453 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=70-3453 | `/gate?hour=07` | 1440×2328 |
| 04 | 04 · SH-03 — Visit needs review | 68:2109 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=68-2109 | `/gate/visits/TV-0412` | 1440×1462 |
| 05 | 05 · SH-03 — Assign drawer | 68:3764 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=68-3764 | `/gate/visits/TV-0412/assign` | 1440×900 |
| 06 | 06 · SH-03 — Assigned, ready to close | 68:2657 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=68-2657 | `/gate/visits/TV-0412?demo=assigned` (also reached by the flow) | 1440×1462 |
| OV | OV · Close with reason (overlay) | 76:4953 (modal 68:4059) | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=76-4953 | `/gate/visits/TV-0412/close` (modal over the visit page) | 560×720 modal on a 1440×900 dim |
| 07 | 07 · SH-03 — Closed with a reason | 68:3214 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=68-3214 | `/gate/visits/TV-0412?demo=closed` (also reached by the flow) | 1440×1462 |
| 08 | 08 · SH-03 — Camera blocked, not a violation | 69:2535 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=69-2535 | `/gate/visits/TV-0431` | 1440×1544 |
| 09 | 09 · SH-03 — Outward, inspection not seen | 69:3087 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=69-3087 | `/gate/visits/TV-0419` | 1440×1317 |
| 10 | 10 · SH-03 — Which truck? Link needs review | 69:3539 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=69-3539 | `/gate/visits/TV-0438` | 1440×1465 |
| 11 | 11 · Evidence viewer | 73:4594 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=73-4594 | `/gate/visits/TV-0412/evidence/disinfection` | 1440×900 |
| 12 | 12 · Settings — SOP step order | 75:4687 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=75-4687 | `/settings/sop` | 1440×1498 |
| 13 | 13 · States — empty, offline, analysing, loading | 86:5032 | https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=86-5032 | `/states` | 1440×900 |

Also build a developer page **`/screens`**: a simple list of all 15 screens above with their number, name, route link and Figma link, plus a "Reset demo data" button. Style it with the same tokens; it is not in Figma, so keep it plain. `/` redirects to `/gate` (the main screen of the assignment).

### Prototype flows (Figma "flow starting points")

1. **Client test: review, assign and close a visit**: starts at 02.
2. **Management view to one unit**: starts at 01.
3. **Camera blocked visit (not a violation)**: starts at 08.

---

## 5. Screen-by-screen build notes

All app screens except 11 share the **App shell**:

- **Sidebar** (component `49:265`, 240 px wide, `bg/nav`): logo lockup; workspace switcher; "Overview"; group label "Modules" with GateView, FeedMill, BirdShed, EggStore; group label "Work" with Review list (badge "5"), Cameras, Reports, Settings; "Help and guides" pinned at the bottom. The active item uses `Nav item / State=Active`.
  - **The sidebar is sticky:** it stays fixed on the left while the page scrolls (`position: sticky; top: 0; height: 100vh`), with "Help and guides" at the bottom of the viewport. The navy column continues full height behind it. This matches the Figma prototype, where the sidebar is a fixed layer.
- **Top bar** (component `49:304`, 64 px high, in the main column): breadcrumb (changes per screen, read from Figma), search field "Search a visit ID, like TV-0412" with a "Ctrl K" key hint, camera status pill "5 cameras live · 1 partial view", bell with a dot, avatar "RM".
- **Main column**: 1200 px at a 1440 viewport, content padding 32 px (content width 1136), `bg/canvas`.

### 01 · Management overview (`72:4249`) · route `/overview`

Sections (node IDs):

- Top bar `72:4370`: breadcrumb "Sakku Group / Overview".
- Page header `72:4403`: "All farms, today", "Updated 14:28 · every 5 min", subtitle "All modules today, with Gate details for 3 units · Mon 23 Nov, 06:00–14:30", button "Export".
- Filters `72:4420`: Facility "All facilities", Date "Today, 23 Nov", Compare with "Last Monday".
- Modules `72:4451`: 4 × `Module tile` (component `81:5674`):
  - GateView "Vehicle checks at the gate" · Live · 214 visits today · 31 need review · 10 no owner · "Open GateView".
  - FeedMill "Grinding and sample checks" · 12 grinding runs · 2 · 1.
  - BirdShed "Daily routines in 18 sheds" · 52 routines done · 4 · 2.
  - EggStore "Egg stock and store hygiene" · 36 stock moves · 3 · 1.
- KPI strip `81:5506`: three labelled groups "Vehicle movement", "Check coverage", "Review" holding 6 `KPI card`s:
  - 118 inward (+9), 96 outward (+4), both "vs last Monday, same time".
  - 95% inward inspection "107 of 113 judged · 6 not seen · 5 not judged".
  - 96% outward "87 of 91 judged · 4 not seen · 5 not judged".
  - 92% entry disinfection "94 of 102 judged · 5 late · 3 not seen · 16 not judged".
  - 31 open review, "10 no owner" pill, "21 already have an owner", "Open review list".
- Panel "Compare facilities" `72:4638`: "Gate data only. Click a row to open that unit's Gate dashboard." Columns: Facility · Visits in · out · Inward inspection · Entry disinfection · Outward inspection · Needs review · Cameras.
  - Unit 1: 38 · 30 · 97% · 95% · 97% · 6 open, 1 no owner · 4 live.
  - Unit 2: 32 · 25 · 94% · 90% · 96% · 11 open, 4 no owner, "1 waiting over 24 h" · 4 live.
  - Unit 3: 48 · 41 · 93% · "% hidden" · 95% · 14 open, 5 no owner · 5 live · 1 partial.
  - Each row has "Open".
- Panel "Visits that needed a person, last 7 days" `72:4774`: 3-line chart (Unit 1/2/3), y axis 0/8/16/24, x axis Tue 17 … Today, end labels 7 / 13 / 22, plus the insight note about Unit 3 and the spray-arch camera. Read the line points from Figma and draw it as SVG.
- Panel "Waiting the longest" `72:4818`: TV-0388 (Unit 2 · Outward, 26 h, "Inspection not seen before exit", Not observed, No owner), TV-0412 (Unit 3 · Inward, 6 h), TV-0419 (Unit 3 · Outward, 6 h); footer link "Open review list · 31 open".

### 02 · GV-01 Gate dashboard (`54:296`) · route `/gate` (main screen)

- Top bar breadcrumb: "Overview / Unit 3 / GateView".
- Page header `54:437`: "Unit 3 gates, today" · "Updated 14:28 · every 5 min" · "Vehicle inspection and disinfection · Unit 3 · Mon 23 Nov, 06:00–14:30" · buttons "Export", "Open review list" (primary).
- Filters `54:459`: Facility "Unit 3" (Changed state), Gate "All gates", Date "Today, 23 Nov", segmented All / Inward / Outward, Use case "All use cases", "Reset filters".
- KPI strip `81:5218` (6 cards, exact brief order):
  1. Observed inward visits 48 (+6) with mini bars.
  2. Observed outward visits 41 (+3) with mini bars.
  3. Inward inspection coverage 93%, "42 of 45 judged", bar, "3 not seen · 3 not judged".
  4. Outward inspection coverage 95%, "36 of 38 judged", "2 not seen · 3 not judged".
  5. Entry-disinfection coverage, `Coverage hidden` variant: "% hidden" pill, big "31 sprayed before entry", "Only 34 of 48 visits could be judged".
  6. Visits needing review, `Review` variant (orange): "5 no owner", 14 open, "9 already have an owner", "Open review list".
- Row "hour + attention" `57:432`:
  - Panel "Results by hour" `57:433` (692 px): tabs Inspection / Disinfection (segmented), legend (Observed, Late, Not observed, Needs review), **mirrored stacked bar chart**: inward bars above the time line, outward below, hours 06:00–14:00, y labels 5/10. Footer "Busiest hour: 07:00–08:00, with 12 visits" and "Violet = could not judge. Never counted as not observed."
  - Panel "Needs attention" `57:524` (420 px): tabs No owner 5 / Assigned 9 / Closed today 8; items TV-0412 (07:41:56 thumb, "Inward · Main gate", 6 h, "Disinfection not clearly seen before entry", Needs review, No owner), TV-0419 (08:14:40, Outward, "Inspection not seen before exit", Not observed), TV-0431 (09:18:05, "Spray camera blocked by a parked truck", Camera blocked); link "See all 5 with no owner".
- Row "by gate" `57:652`: "Results by gate", legend, two gate cards:
  - Main gate: 30 in · 26 out · 3 cameras, "1 partial view" pill. Inward inspection 93% 26 of 28; Entry disinfection "% hidden" 17 of 30; Outward 96% 23 of 24. "AI checks: inspection validated · disinfection still being validated for this camera angle". Amber note "Spray-arch camera has a partial view since 06:00. 13 of 30 spray checks could not be judged." with "See camera".
  - Feed gate: 18 in · 15 out · 2 cameras, "Cameras clear". 94% 16 of 17; 94% 16 of 17; 93% 13 of 14. "AI checks: inspection and disinfection validated for these cameras". Note "Both cameras clear today. Last health check at 14:25."
- Row "visits table" `58:432`: "Vehicle visits" + description (mentions temporary IDs and Phase 2), Sort "Needs attention first", tabs All visits 89 / Needs a person 14 / Closed today 8 / No problems 67. `Table header` + 8 `Visit row`s + footer "Showing 8 of 89 visits" with pagination 1 2 3 … 12. Columns are exactly: Visit ID · Gate · Direction · Entry / exit time · Inspection time · result · Disinfection time · result · Evidence quality · Review status · Action.

  | Visit | Gate | Dir | Time | Inspection | Disinfection | Quality | Review | Action |
  |---|---|---|---|---|---|---|---|---|
  | TV-0412 | Main gate | Inward | 07:42 | 07:38 Observed | — Needs review | Low visibility | No owner | Review |
  | TV-0419 | Main gate | Outward | 08:15 | — Not observed | Not required | Good | No owner | Review |
  | TV-0427 | Feed gate | Inward | 09:05 | 09:01 Observed | 09:07 Late | Good | No owner | Review |
  | TV-0431 | Main gate | Inward | 09:20 | 09:16 Observed | — Needs review | Camera blocked | No owner | Review |
  | TV-0435 | Main gate | Inward | 09:48 | 09:44 Observed | — Needs review | Low visibility | No owner | Review |
  | TV-0438 | Main gate | Inward | 10:12 | 10:09 Needs review | 10:10 Observed | Partial | EC Emily C | Review |
  | TV-0440 | Feed gate | Outward | 10:31 | 10:27 Observed | Not required | Good | No review needed | View |
  | TV-0441 | Main gate | Inward | 10:44 | 10:40 Observed | 10:42 Observed | Good | No review needed | View |

  Rows with a thumbnail vs an empty viewfinder placeholder: copy Figma exactly.

### 02b · Disinfection by hour (`90:6507`) · route `/gate?chart=disinfection`

Same page as 02. Only the "Results by hour" panel changes: the Disinfection tab is selected, the subtitle reads "Inward visits only, because spraying is checked before the truck goes in. Click any bar to open those visits.", only inward bars are drawn, the outward side shows "Disinfection is not required for outward visits", the footer reads "Most unclear spray checks: 08:00–09:00, 3 visits" and "Violet = could not judge". Clicking the "Inspection" segment returns to 02 (`/gate`).

### 03 · Drilled down to one hour (`70:3453`) · route `/gate?hour=07`

Reached by clicking the 07:00 bar on 02.

- Date filter shows "Today, 07:00–08:00" (Changed state). Header subtitle ends "07:00–08:00". Use case filter "All".
- KPI cards switch to counts because there are fewer than 10 visits:
  - Observed inward 9, "Peak" tag, "Busiest hour of the day".
  - Observed outward 3, "Low" tag, "Quiet hour for outward".
  - Three coverage cards with "% hidden": 7 inspected before entry · 3 inspected before exit · 7 sprayed before entry, each "Fewer than 10 visits in this view".
  - Review card: 3 open, "2 no owner", "1 already has an owner".
- Chart: the 07:00 bar is highlighted with a "Selected hour" pill, the others dimmed; footer "Showing 07:00–08:00 · 12 visits".
- Needs attention: No owner 2 / Assigned 1 / Closed today 1; items TV-0412 and TV-0409 (07:21:30, "Inspection not seen before entry", Not observed); link "See all 3 in this hour".
- Results by gate: counts, not %: "Fewer than 10 visits per gate in this hour, so we show counts, not %." Main gate 6 in · 2 out (4 of 5, 4 of 4, 2 of 2, mist note "2 of 6 spray checks could not be judged"). Feed gate 3 in · 1 out (3 of 3, 3 of 3, 1 of 1).
- Table: tabs All visits 12 / Needs a person 3 / Closed today 1 / No problems 8, an "Hour: 07:00–08:00" filter chip with ×, and rows TV-0409, TV-0412, TV-0407, TV-0405, TV-0408, TV-0410, TV-0411, TV-0413 (read all values from Figma).
- The "Selected hour" pill and the hour chip "×" both return to `/gate`.

### 04 · SH-03 Visit needs review (`68:2109`) · route `/gate/visits/TV-0412`

Client test, step 1.

- Visit nav `68:2250`: "Back to Gate dashboard", "1 of 5 with no owner", previous/next buttons ("Next visit").
- Visit header `68:2268`: chips Inward visit · Main gate · "Mon 23 Nov · entry 07:42" · "SOP: Unit 3 · Inward v2" (clickable, goes to 12); title "TV-0412" in mono + "Needs review" chip; info line "Temporary visit ID · number plate (ANPR) and Focus PO / gate-pass checks come in Phase 2"; heading "Disinfection was not clearly seen before entry"; body "Mist on the spray-arch camera hid the spray between 07:38 and 07:42. The AI could not decide, so a person needs to watch the clip."; button "Share link".
- Panel "What happened, step by step" `68:2310` (736 px): vertical timeline of 4 steps, each with an icon node, title, status chip, mono time, description, camera line ("CAM 01 · Outside gate"), quality, and evidence photos with time pills.
  - Approach 07:36:10 Observed.
  - Security inspection 07:38:02 Observed, 2 photos 07:38:02 / 07:39:10, quality Good.
  - Disinfection 07:38 – 07:42 Needs review, CAM 02 · Spray arch, Low visibility. A "Camera recording 07:38–07:42 · 4 min" box with "Watch clip" and 4 frames (07:38:30, 07:39:40, 07:40:50, 07:41:56) and the note "Mist covers the spray arch in these frames. We show the camera recording for this time, never a made-up photo."
  - Entry 07:42:18 Observed, CAM 03 · Gate line.
- Side column `68:2534` (376 px):
  - "Review": Status Needs review, Owner No owner, Due Today 18:00, tip text, buttons "Assign" and "Close visit", History (07:43 AI flagged it…; 07:43 Added to "Needs attention"…).
  - "Which truck?": Link status Auto-matched, explanation, "Confirm link", "Flag wrong link".
  - "Cameras for this visit": CAM 01 Live, CAM 02 Partial view, CAM 03 Live, amber "AI check status" note.

### 05 · Assign drawer (`68:3764`) · route `/gate/visits/TV-0412/assign`

Client test, step 2. Screen 04 stays behind a dim layer (`68:3972`, full viewport), and a **460 px right drawer** (`68:3973`, full height, `Shadow/Float`) slides in:

- Title "Assign for review" with a close ×; context "TV-0412 · Inward · Main gate · disinfection needs review".
- Evidence summary: 07:41:56 thumbnail, "Disinfection not clearly seen before entry", "Camera recording 07:38–07:42 · low visibility".
- "Who should look at it?": 3 `Person option`s:
  - Emily C · QA reviewer · Unit 3 · 3 open (selected).
  - Dr Sarah J · Biosecurity lead · Group · 1 open.
  - Ryan M (you) · Facility manager · Unit 3 · 2 open.
- "Due by" filter "Today, 18:00".
- `Text area` "Note for the reviewer (optional)" with "Please check the spray clip from 07:38 to 07:42. Mist on CAM 02 again this morning."
- Checkbox "Send Emily an app and email alert" (checked).
- Footer: "Cancel", "Assign to Emily C" (primary).
- × and Cancel close the drawer back to 04. "Assign to Emily C" goes to 06. Esc also closes. Trap focus inside the drawer.

### 06 · Assigned, ready to close (`68:2657`)

Client test, step 3. Same as 04 except:

- Toast at the top centre: "Assigned to Emily C. She will get a notification." with "Undo". Auto-hide after about 6 s; keep it visible on the deep link `?demo=assigned`.
- Review panel: Owner "EC Emily C", buttons "Close visit" (primary) and "Reassign"; history adds "14:31 Ryan M assigned it to Emily C. Note: "Please check the spray clip.""
- "Close visit" opens the OV modal.

### OV · Close with reason (`76:4953`, modal `68:4059`) · route `/gate/visits/TV-0412/close`

Client test, step 3b. A 560 px modal centred over the current visit page with a dim backdrop:

- Title "Close visit TV-0412" with ×; "Pick the reason that matches what you saw. It is saved in the visit history and shows in reports."
- Six `Radio option`s:
  1. "Confirmed: activity observed on review" (selected, with helper "Disinfection will show as "Observed · confirmed by reviewer".").
  2. "Confirmed: activity not done — action taken".
  3. "Not evaluable: camera or visibility issue".
  4. "Incorrect association — re-linked".
  5. "Duplicate or false detection".
  6. "Other — note required".
- `Text area` "What did you see? (required)" with "Spray visible at 07:39 when zoomed in. Mist made it hard for the AI."
- Info box "After closing, Entry-disinfection coverage updates and the visit leaves the needs-attention list."
- Footer: "Cancel" and "Close visit" (primary).
- × / Cancel / Esc close the modal (go back). "Close visit" goes to 07.
- The title uses the visit ID of the page it opens on ("Close visit TV-0431" on 08). On 08 it opens with "Not evaluable: camera or visibility issue" pre-selected (that is the suggested reason on 08). From 11, "I can see spraying" opens it with reason 1 pre-selected.
- "Close visit" on TV-0412 goes to 07. On any other visit it closes that visit in local state and shows it with the same closed pattern as 07 (status chip, review panel, history, toast). Do not add any new UI for this.

### 07 · Closed with a reason (`68:3214`)

Client test, step 4. Same layout:

- Status chip "Closed · observed on review".
- Heading "Disinfection was seen on review, before entry" and body "Emily C watched the clip and saw the spray at 07:39. The visit is closed and the coverage numbers now include it."
- Disinfection step: "Observed · confirmed by reviewer" at 07:39:40, with "Confirmed by Emily C at 14:52", and the note "The AI could not decide because of mist. A reviewer watched the clip and saw spraying at 07:39, before entry."
- Review panel: Status Closed, Owner Emily C, Closed "Today, 14:52", "Reason: Confirmed: activity observed on review", the quoted note, "Reopen"; history 14:52 closed / 14:31 assigned / 07:43 flagged.
- Which truck?: "Confirmed by reviewer", "Emily C confirmed all four steps belong to TV-0412."
- A toast as in Figma. "Next visit" goes to 08.

### 08 · Camera blocked, not a violation (`69:2535`) · route `/gate/visits/TV-0431`

Client test 2.

- "4 of 5 with no owner". Entry 09:20. Chip "Needs review · camera blocked".
- Heading "The spray camera was blocked, so disinfection could not be judged", body about the parked truck in front of CAM 02 from 09:14 to 09:22, "This is a camera problem, not a violation, so it is left out of the coverage %."
- Banner in the timeline panel: "Not a violation" with "'Camera blocked' means the AI could not see. Nobody is blamed, and the visit stays out of the coverage % until a person decides."
- Steps: Approach 09:14:40; Security inspection 09:16:05; Disinfection 09:16 – 09:20 "Camera blocked" (recording 09:16–09:20, frames 09:16:30 / 09:17:40 / 09:18:50 / 09:19:55, note "Last clear frame from this camera: 09:13:52."); Entry 09:20:11.
- Review: suggested reason "Not evaluable: camera or visibility issue", buttons "Close visit" and "Report camera". History: "AI flagged it: spray camera blocked", "Camera health: CAM 02 blocked 09:14–09:22". Cameras: CAM 02 "Blocked 09:14–09:22".

### 09 · Outward, inspection not seen (`69:3087`) · route `/gate/visits/TV-0419`

- "2 of 5 with no owner". Outward visit, "exit 08:15", "SOP: Unit 3 · Outward v1", chip "Not observed".
- Heading "Inspection was not seen before exit", body "The camera had a clear view from 08:09 to 08:15. No person in the security vest came near the vehicle before it left."
- Steps: Security inspection 08:09 – 08:15 Not observed (CAM 01 · Inside gate, Good, recording 08:09–08:15 · 6 min, frames 08:10:05 / 08:11:30 / 08:13:00 / 08:14:40, note about the clear view and "not a made-up photo"); Exit 08:15:02 Observed (CAM 03).
- Note "Disinfection is not required for outward visits, so it is not checked here."
- Review: tip "If the guard checked the vehicle out of camera view, pick "Other" and add a note.", buttons Assign / Close visit. Cameras: CAM 01 Inside gate Live, CAM 03 Live.
- "Prev visit" goes to 04, "Next visit" goes to 08, "Assign" goes to 05.

### 10 · Which truck? Link needs review (`69:3539`) · route `/gate/visits/TV-0438`

- "1 of 9 assigned". Entry 10:12. Chip "Needs review · unclear link".
- Heading "The inspection may belong to another truck", body about two trucks at Main gate and one inspection at 10:09.
- Banner "Two trucks at the gate · TV-0438 and TV-0439 were both at Main gate between 10:05 and 10:13."
- Steps: Approach 10:05:30 ("behind another truck"); Security inspection 10:09:12 "Needs review · unclear link" (Partial, 2 photos 10:09:12 / 10:09:48); Disinfection 10:10:30 Observed (Good); Entry 10:12:05.
- Review: Owner Emily C, Close visit / Reassign; history 10:40 assigned, 10:13 flagged.
- "Which truck?": Link status "Unclear", "Pick the truck this inspection belongs to. The other visit will be checked again.", two truck options (TV-0438 entry 10:12 with 10:12:05 thumb; TV-0439 entry 10:13 with 10:13:40 thumb) and buttons "It is TV-0438" / "It is TV-0439". Selecting one switches the link status to "Confirmed by reviewer" (local state only).

### 11 · Evidence viewer (`73:4594`) · route `/gate/visits/TV-0412/evidence/disinfection`

Full-screen dark viewer, **no sidebar**, 1440×900, fills the viewport.

- Viewer bar `73:4595` (60 px): "Back to visit TV-0412" · "Disinfection · CAM 02 · Spray arch · Main gate" · "Low visibility" pill · icon buttons zoom-in, download, maximize.
- Video area `73:4618` (1080 px): large frame with overlay "CAM 02 · MAIN GATE · SPRAY ARCH", "23 NOV 2026 · 07:39:40", "ILLUSTRATIVE IMAGE".
  - Controls: play, current time "07:39:40 of 07:36:00 – 07:44:00", "Speed 1×", "← → one frame · Space to play".
  - Scrubber 07:36–07:44 with markers "Inspection 07:38", "Entry 07:42" and the shaded window "Spray should happen here".
  - Frame strip: 07:38:30, 07:39:05, 07:39:40 (selected), 07:40:15, 07:40:50, 07:41:56.
- Side `73:4749` (360 px): "What the AI saw" + text; facts (Step "Disinfection, before entry", Expected "07:38 – 07:42:18", Quality "Low visibility", Camera "Partial view since 06:00"); "What do you see?" with three answers "I can see spraying" / "No spraying" / "Still unclear"; helper text; footer note "Images are AI-generated for this design. Real clips come from Sakku's cameras. Faces and number plates are never read."
- Behaviour: "Back to visit" goes back. Clicking a frame or using ← / → changes the selected frame and the big image/time (local state, same image set). Play toggles a play/pause icon only; there is no real video. "I can see spraying" opens the OV modal with reason 1 selected.

### 12 · Settings — SOP step order (`75:4687`) · route `/settings/sop`

- Header "SOP step order" + description; buttons "Version history" and "Save as v3" (primary).
- Left `SOP list` `75:4854` (300 px): Unit 3 · Inward v2 · 4 steps · Active (selected); Unit 3 · Outward v1 · 2 steps; Unit 1 · Inward v3; Unit 1 · Outward v1; Unit 2 · Inward v2; Unit 2 · Outward v1; "New SOP".
- Editor `75:4927` (812 px): "Unit 3 · Inward visit", "Active · v2", "Changed 12 Nov by Dr Sarah J"; info box "Changes apply to new visits from tomorrow, 00:00. Old visits keep the version they were checked with, so past results never change."
  - "Steps, in the order the camera should see them": 4 step cards (1 Approach / 2 Security inspection "At least 30 s" / 3 Disinfection "After entry = Late" / 4 Entry "Reference time"), each with rule tags, a camera select and a "Required" `Toggle`. Then "Add a step".
  - "When to ask a person": 3 rules with toggles, plus a greyed "Match the visit with a Focus PO or gate pass" with a "Phase 2" chip.
- "Save as v3" navigates to 04, as in the Figma prototype. Toggles and the selected SOP in the list work as local state.

### 13 · States (`86:5032`) · route `/states`

A demo page in the app shell showing 4 states built from the `State` component (`86:363`):

- "While footage is still being checked": analysing banner "Footage from 14:15 to 14:30 is still being checked".
- "When a camera goes offline": banner "Feed gate camera is offline since 10:00" with "See camera health".
- "When nothing needs a person": the Needs attention panel with 0 / 0 / 6 tabs and "Nothing needs you right now · All 48 inward and 41 outward visits look fine so far today. New problems will show here." + "See all visits".
- "While data loads": skeleton cards in the KPI layout (subtle shimmer is fine).

Also make these states reusable components, so the Gate dashboard could render them later from data flags.

---

## 6. Prototype links to implement (taken from the Figma prototype)

| From | Element | Goes to |
|---|---|---|
| Sidebar (all app screens) | Overview | 01 `/overview` |
| Sidebar | GateView | 02 `/gate` |
| Sidebar | Settings | 12 `/settings/sop` |
| 01 | Unit 3 row, "Open" on Unit 3, "Open GateView" | 02 |
| 01 | Waiting-the-longest item TV-0412 | 04 |
| 02 / 02b | "Open review list" button, Needs-attention TV-0412, row TV-0412 | 04 |
| 02 / 02b | Needs-attention TV-0419, row TV-0419 | 09 |
| 02 / 02b | Needs-attention TV-0431, row TV-0431 | 08 |
| 02 / 02b | Row TV-0438 | 10 |
| 02 | "Disinfection" segment | 02b |
| 02b | "Inspection" segment | 02 |
| 02 | 07:00 bar | 03 |
| 03 | "Selected hour" pill, hour chip × | 02 |
| 03 | Needs-attention TV-0412, row TV-0412 | 04 |
| 04 | Back | 02 |
| 04 | Next visit | 09 |
| 04 | SOP chip | 12 |
| 04 / 06 | Watch clip | 11 |
| 04 / 09 | Review · Assign | 05 |
| 04 / 06 / 08 | Review · Close visit | OV (modal) |
| 05 | × and Cancel | 04 |
| 05 | Assign to Emily C | 06 |
| OV | × and Cancel | close modal |
| OV | Close visit | 07 |
| 07 | Next visit | 08 |
| 08 / 10 | Next visit | 02 |
| 09 | Prev visit | 04 |
| 09 | Next visit | 08 |
| 06 / 07 / 08 / 09 / 10 | Back | 02 |
| 11 | Back to visit | browser back |
| 11 | "I can see spraying" | OV (modal) |
| 12 | Save as v3 | 04 |

Elements with no link in Figma (FeedMill, BirdShed, EggStore, Review list, Cameras, Reports, Help, Export, Share link, pagination, other module tiles) stay as real buttons with hover and focus states but **do not navigate and do not open anything new**. Do not design new screens for them.

Make extra interactions only where Figma already shows the state:

- `Tab` / `Segment` selected states switch.
- Needs-attention item and Visit row `Hover` variants on hover.
- Chart bars show the `Chart tooltip` (component `51:418`) on hover.
- The radio, person, checkbox and toggle selected states work.

Every other bar on the hour chart (not 07:00) can link to `/gate?hour=HH` using the same 03 layout filled from mock data. Only 07:00 is checked against Figma.

---

## 7. Components to build (mirror the Figma components 1:1)

All are on "05 Design system", board **C-01 — Components** (`48:83`): https://www.figma.com/design/K7pIHObtQV7R11Y4Mt2Vpm/Untitled?node-id=48-83. Build each with the same variant props as typed React props. Build all variants, even ones not used on a screen.

| Figma component | Node | Variants / props → React props |
|---|---|---|
| Avatar | 48:110 | Size S/M/L, Initials |
| Button | 48:145 | Type Primary/Secondary/Ghost, Size M/S, Label, Show icon, Icon |
| Icon button | 48:159 | Type Ghost/Outline, Icon |
| Status chip | 48:212 | Status: Observed, Not observed, Late, Needs review, Low visibility, Camera blocked, Not required, Phase 2 |
| Review tag | 48:234 | Review: No owner, Assigned, Closed, None; Name |
| Evidence quality | 48:263 | Quality: Good, Partial, Low visibility, Camera blocked |
| Legend item | 48:283 | Series: Observed, Late, Not observed, Needs review |
| Nav item | 49:139 | State Default/Active, Label, Icon, Show badge, Count |
| Sidebar | 49:265 | active item prop |
| Top bar | 49:304 | breadcrumb items |
| Filter | 49:328 | State Default/Changed, Label, Value, Icon |
| Segment / Segmented · 3 | 49:335 / 49:343 | Selected, Label / options + value |
| Tab | 49:358 | Selected, Label, Count |
| KPI card | 81:395 | Type: Count, Coverage, Coverage hidden, Review |
| Module tile | 81:5674 | module data |
| Evidence photo | 51:328 | Size XS/S/M/L, Time, Camera, image + crop |
| Needs-attention item | 51:394 | State Default/Hover, ID, Meta, Age, Title + chips |
| Chart tooltip | 51:418 | content |
| Table header | 53:270 | columns |
| Visit row | 53:369 | State Default/Hover + visit data |
| Radio option | 67:352 | Selected, Label, Helper, Show helper |
| Person option | 67:371 | Selected, Name, Role, Open |
| Checkbox | 67:382 | Checked, Label |
| Text area | 67:387 | label, value, required |
| Toggle | 75:315 | On |
| State | 86:363 | Nothing needs you, Camera offline, Still analysing, Loading |

Plus composite pieces you will need: `AppShell`, `Panel` (white card, radius, border, header with title + description), `PageHeader`, `FilterBar`, `KpiGroup` (label above a set of cards), `TimelineStep`, `CameraRecordingBox`, `ReviewPanel`, `WhichTruckPanel`, `CamerasPanel`, `Drawer`, `Modal`, `Toast`, `InfoLine`, `Banner`.

**Charts:** draw them yourself with SVG/CSS so they match Figma exactly. Do **not** use a chart library (Recharts, Chart.js and others change the look).

- `MirroredHourChart`: stacked bars above and below a time axis; segments Observed / Late / Not observed / Needs review with the chart colours; hover tooltip; selected/dimmed states for 03.
- `MiniBars`: the small 7-bar sparkline inside the count KPI cards.
- `CoverageBar`: the thin segmented bar inside coverage cards and gate rows.
- `TrendLineChart`: the 3-line, 7-day chart on 01.

Build a developer page **`/components`** that renders every component and variant on one page, so it can be compared side by side with board C-01.

---

## 8. Mock data (no APIs)

Put all data in `src/data/` as typed TypeScript modules, with types in `src/types/domain.ts`: `Unit`, `Gate`, `Camera`, `Visit`, `VisitStep`, `Evidence`, `ReviewState`, `Person`, `Sop`, `KpiSet`, `HourBucket`. Screens must read from these modules. **No numbers or copy hard-coded inside page components**, except fixed UI labels.

Use exactly the values shown in Figma (section 5 lists most of them; read the rest from the nodes). Key datasets:

- **Unit 3 today (06:00–14:30):**
  - Inward 48 (Main 30, Feed 18), outward 41 (Main 26, Feed 15).
  - Inward inspection: 42 observed, 3 not observed, 3 needs review (42 of 45 judged → 93%).
  - Outward inspection: 36 / 2 / 3 (36 of 38 → 95%).
  - Entry disinfection: 31 before entry, 2 late, 1 not seen, 14 could not judge (34 of 48 judged = 71% → % hidden).
  - Review: 14 open (5 no owner, 9 assigned), 8 closed today. Visit tabs: 89 all / 14 / 8 / 67.
- **Visits per hour 06–14:** inward totals [4, 9, 8, 6, 5, 5, 4, 4, 3], outward totals [1, 3, 5, 6, 6, 5, 6, 6, 3]. Read the per-outcome stack heights of the inspection chart from Figma (panel `57:433`).
- **Disinfection per hour 06–14** (observed, late, not observed, needs review): [2,0,0,2], [7,0,0,2], [4,1,0,3], [3,1,0,2], [3,0,1,1], [4,0,0,1], [3,0,0,1], [3,0,0,1], [2,0,0,1].
- **All 3 units:** 118 in, 96 out, 95% (107/113), 96% (87/91), 92% (94/102), 31 open, 10 no owner, 21 owned. Facility rows as in 01.
- **Visits:** TV-0412, TV-0419, TV-0427, TV-0431, TV-0435, TV-0438, TV-0439, TV-0440, TV-0441, plus the 07:00 hour visits TV-0405, TV-0407, TV-0408, TV-0409, TV-0410, TV-0411, TV-0413, and TV-0388 (Unit 2). Full step details exist for TV-0412, TV-0431, TV-0419 and TV-0438 (screens 04–10).
- **People:** Ryan M (RM, facility manager Unit 3, current user, 2 open), Emily C (EC, QA reviewer Unit 3, 3 open), Dr Sarah J (SJ, biosecurity lead Group, 1 open), David B (management).
- **Cameras:** Unit 3 Main gate: CAM 01 Outside gate (Live), CAM 02 Spray arch (Partial view; blocked 09:14–09:22), CAM 03 Gate line (Live), CAM 01 Inside gate (used on outward). Feed gate: 2 cameras, clear.
- **SOPs:** as listed in 12.
- **Close reasons:** the 6 reasons in OV.

**Review state** (`src/store/`): use React Context + `useReducer` (or Zustand, if you prefer one small dependency). TV-0412 moves `needs_review (no owner)` → `assigned (Emily C)` → `closed (reason, note, 14:52)`; TV-0438 link `unclear` → `confirmed`. Persist to `sessionStorage` (wrapped in try/catch) so a refresh keeps the demo state. "Reset demo data" on `/screens` clears it. Deep links `?demo=assigned` and `?demo=closed` seed TV-0412 into that state so screens 06 and 07 can be opened directly.

Keep the dashboards (01, 02, 02b, 03) exactly as designed. Do not recompute them after review actions; the review flow only changes the visit pages and toasts.

---

## 9. Tech stack

- **Vite + React 18 + TypeScript** (strict mode).
- **React Router** (v6 data router or v7 library mode) for routes, nested routes for the drawer and modal over the visit page.
- **CSS Modules + CSS custom properties** from `tokens.css`. No Tailwind, no UI kit (no MUI, Ant Design, Chakra, Bootstrap), because they fight the exact design.
- `clsx` for class names. Fonts via `@fontsource/*`. Nothing else unless needed.
- ESLint + Prettier. `npm run build` must pass with zero TypeScript errors.
- Visual QA: `@playwright/test` + `pixelmatch` + `pngjs` (dev dependencies).

---

## 10. Folder structure

```
gateview-ui/
├─ README.md                      # how to run, screen map, routes, Figma links
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ .eslintrc.cjs / .prettierrc
├─ public/
│  └─ favicon.svg
├─ qa/
│  ├─ figma/                      # Figma screenshots of each frame (baseline)
│  ├─ app/                        # app screenshots
│  └─ diff/                       # pixel diffs + report.md
├─ tests/
│  └─ visual.spec.ts              # Playwright: screenshot every route at 1440 and compare
└─ src/
   ├─ main.tsx
   ├─ app/
   │  ├─ App.tsx
   │  ├─ router.tsx               # all routes from section 4
   │  └─ providers.tsx
   ├─ styles/
   │  ├─ reset.css
   │  ├─ tokens.css               # section 3 tokens as CSS variables
   │  ├─ typography.css           # one class per text style
   │  └─ globals.css
   ├─ assets/
   │  ├─ logo/nava-logo.svg
   │  ├─ icons/*.svg              # 97 icons from Figma
   │  └─ images/evidence/*.webp   # 5 evidence images
   ├─ components/
   │  ├─ ui/                      # Avatar, Button, IconButton, StatusChip, ReviewTag, EvidenceQuality,
   │  │                           # LegendItem, Segment, SegmentedControl, Tab, Filter, Checkbox,
   │  │                           # RadioOption, PersonOption, TextArea, Toggle, Toast, Modal, Drawer, Tooltip
   │  ├─ icons/Icon.tsx
   │  ├─ layout/                  # AppShell, Sidebar, NavItem, TopBar, PageHeader, Panel, FilterBar
   │  ├─ data/                    # KpiCard, KpiGroup, ModuleTile, TableHeader, VisitRow, VisitTable,
   │  │                           # NeedsAttentionItem, NeedsAttentionList, EvidencePhoto, StateBlock, Skeleton
   │  └─ charts/                  # MirroredHourChart, MiniBars, CoverageBar, TrendLineChart, ChartTooltip
   ├─ features/
   │  ├─ overview/                # 01 page + sections
   │  ├─ gate/                    # 02, 02b, 03: GateDashboardPage + KpiStrip, ResultsByHour,
   │  │                           # NeedsAttentionPanel, ResultsByGate, VisitsTablePanel
   │  ├─ visit/                   # 04–10 + OV: VisitDetailPage, VisitHeader, Timeline, TimelineStep,
   │  │                           # ReviewPanel, WhichTruckPanel, CamerasPanel, AssignDrawer, CloseVisitModal
   │  ├─ evidence/                # 11 EvidenceViewerPage
   │  ├─ settings/                # 12 SopSettingsPage
   │  ├─ states/                  # 13 StatesPage
   │  └─ dev/                     # /screens and /components pages
   ├─ data/                       # mock data modules (section 8)
   ├─ store/                      # review state
   ├─ lib/                        # coverage.ts, format.ts, time.ts
   └─ types/domain.ts
```

Put each component in its own folder (`Button/Button.tsx`, `Button.module.css`, `index.ts`).

---

## 11. Build order (do it in this order, commit after each step)

Work on a git branch `feature/gateview-ui` and make one commit per step.

1. **Read Figma.** Open every frame in section 4 and board C-01. Save `get_screenshot` of all 15 frames into `qa/figma/<number>-<name>.png` at 1440 px width (1x). Write a short `docs/figma-notes.md` with anything you notice that this prompt does not cover.
2. **Scaffold** the Vite + React + TS project, ESLint/Prettier, router with placeholder pages for all routes, `/screens` page.
3. **Tokens + fonts + global styles** (section 3). Check them against `get_variable_defs`.
4. **Assets:** logo SVG, 97 icon SVGs, 5 evidence images. Build `<Icon>`.
5. **Components** (section 7) with all variants + the `/components` page. Compare each against C-01 before moving on.
6. **App shell:** sticky sidebar, top bar, main column.
7. **Screens**, in this order:
   1. 02 (the main screen; get it perfect first).
   2. 02b, then 03.
   3. 01.
   4. 04, then 05, 06, OV, 07.
   5. 08, 09, 10.
   6. 11, 12, 13.
8. **Prototype wiring:** all links in section 6, the demo state, toasts, focus management.
9. **Visual QA loop** (section 12) until every screen passes.
10. **Final pass:** README, lint, build, no console errors, accessibility checks.

---

## 12. Visual QA: how to prove "100% same"

1. Run the app (`npm run dev`).
2. `tests/visual.spec.ts` (Playwright, Chromium):
   - Viewport 1440×900, `deviceScaleFactor: 1`, fonts loaded (`document.fonts.ready`), animations disabled.
   - Visit each route from section 4, including `?demo=` states and the drawer/modal routes.
   - Take a full-page screenshot; for 05, OV, 11 and 13 take the viewport only.
3. Compare each app screenshot with the matching `qa/figma/*.png` using `pixelmatch` (threshold 0.1). Write the diff image to `qa/diff/` and the mismatch % per screen to `qa/diff/report.md`.
4. **Target: under 2% mismatched pixels per screen**, and no visible difference when the two images are placed side by side. Font anti-aliasing can cause tiny differences; layout, size, colour or copy differences cannot.
5. When a screen fails, zoom into the diff, fix spacing, sizes, line heights or colours, and run again. Do not lower the threshold to make it pass.
6. Also compare `/components` against board C-01 by eye.

Also check that the page height of each scrolling screen matches the Figma frame height within a few pixels (for example 02 = 2275 px).

---

## 13. Layout and responsive rules

- Pixel-exact at a **1440 px** wide viewport (the Figma width).
- Between 1280 and 1920 px the main column stays fluid: the content area keeps 32 px padding, two-column rows keep the Figma ratio (692 : 420 on the dashboard, 736 : 376 on visit pages) using CSS grid `fr` units, and KPI groups keep their proportions. At 1440 the result must still be pixel-exact.
- Below 1280 px, set `min-width: 1280px` on the app and allow horizontal scroll. Mobile is out of scope.
- Use Figma auto-layout values directly: direction → flex direction, gap → `gap`, padding → `padding`, "fill" → `flex: 1` / `width: 100%`, "hug" → `auto`.
- Never position things with absolute coordinates unless Figma uses absolute positioning (toasts, dim layer, drawer, viewfinder corners, timestamp pills).

---

## 14. Accessibility and quality

- Semantic HTML: `nav`, `main`, `header`, `table` (real `<table>` for visits), `button` for actions, `a` for navigation.
- Visible keyboard focus using `border/focus`. Esc closes the drawer and modal, focus is trapped inside them and returns to the trigger.
- `aria-label`s on icon buttons; `alt` text on evidence images (for example "CAM 02 spray arch at 07:39:40, mist").
- Status is never shown by colour alone (chips always have text, as in Figma).
- Respect `prefers-reduced-motion` for drawer, modal and toast transitions (keep them short: 150–200 ms).
- No console errors or warnings. No unused code. No TODOs left in the final build.

---

## 15. Do not

- Do not call any API or add a backend, auth, analytics or tracking.
- Do not add screens, panels, fields, buttons, charts or copy that are not in Figma.
- Do not change any text, number, name, time or ID from Figma.
- Do not use person names other than the ones in Figma.
- Do not show number plates or faces.
- Do not use the words "verified", "passed" or "violation" except where Figma uses them ("Not a violation").
- Do not use a UI kit or a chart library.
- Do not hot-link Figma image URLs.
- Do not edit the Figma file.

---

## 16. Definition of done

- [ ] All 15 frames built and reachable at the routes in section 4; `/screens` lists them all with working links.
- [ ] Every prototype link in section 6 works, including drawer, modal, toasts and back navigation.
- [ ] Sidebar is sticky on all app screens; screen 11 has no sidebar.
- [ ] Tokens, text styles, shadows, icons, logo and images all come from Figma.
- [ ] All Figma components exist as React components with all variants; `/components` matches board C-01.
- [ ] Visual QA report shows every screen under 2% mismatch, with diffs saved in `qa/diff/`.
- [ ] All data comes from `src/data/`; no hard-coded numbers in page components.
- [ ] `npm run lint` and `npm run build` pass; no console errors.
- [ ] README explains how to install, run, run the visual QA, and maps each screen to its route and Figma link.
- [ ] Work is committed on branch `feature/gateview-ui`, one commit per build step.

When you finish, reply with: the list of routes, the visual QA table (screen → mismatch %), anything you could not match exactly and why, and how to run the app.
