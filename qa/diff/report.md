# Visual QA report

Viewport 1440×900 · deviceScaleFactor 1 · pixelmatch threshold 0.1 · target < 2% mismatched pixels.

| Screen | Name | Mismatch % | App height | Figma height | Result |
|---|---|---|---|---|---|
| 01 | Management overview | 1.19 | 1697 | 1697 | pass |
| 02 | GV-01 — Gate dashboard | 1.63 | 2275 | 2275 | pass |
| 02b | GV-01 — Disinfection by hour | 1.64 | 2275 | 2275 | pass |
| 03 | GV-01 — Drilled down to one hour | 1.59 | 2328 | 2328 | pass |
| 04 | SH-03 — Visit needs review | 1.43 | 1462 | 1462 | pass |
| 05 | SH-03 — Assign drawer | 1.80 | 900 | 900 | pass |
| 06 | SH-03 — Assigned, ready to close | 1.52 | 1462 | 1462 | pass |
| OV | Close with reason (overlay) | 1.98 (560×720 modal; whole frame 20.23) | 900 | 900 | pass |
| 07 | SH-03 — Closed with a reason | 1.54 | 1462 | 1462 | pass |
| 08 | SH-03 — Camera blocked, not a violation | 1.50 | 1544 | 1544 | pass |
| 09 | SH-03 — Outward, inspection not seen | 1.45 | 1317 | 1317 | pass |
| 10 | SH-03 — Which truck? Link needs review | 1.44 | 1465 | 1465 | pass |
| 11 | Evidence viewer | 0.97 | 900 | 900 | pass |
| 12 | Settings — SOP step order | 1.28 | 1498 | 1498 | pass |
| 13 | States — empty, offline, analysing, loading | 1.53 | 900 | 900 | pass |

OV is scored on the 560×720 modal: Figma draws it on a plain dim fill, while the app shows it over the
visit page (as the build prompt asks), so the dimmed page behind it differs by design.
