# PR #1 evidence — Spatial Foundation

Prototype, simulated, not production. Not merged. Not deployed.

Parent: `a98a4ae92b6fb92af5ec2ac8271780378e9f6c1e` on `feat/world-stack`.
Branch: `feat/world-forge-spatial-slice`.
Implementation commit: `50244ca971d61bc82d8252053dc8a8804aac7f48`.
Evidence document commit: `dbc2e8ab4c39d7b1bb7641f46c0011ad6b17d61e` (SHA line written in `278dbfc`).
`git log --oneline a98a4ae92b6fb92af5ec2ac8271780378e9f6c1e..HEAD` is the full list.

The interactive city is not complete. This slice is an orbit of a static district massing. It has no vehicles, physics, navmesh, walkers, CityDrive, autonomous agents, live ATG, governance execution, or WORLDQ.

## Framing follow-up

The first desktop after-orbit still failed the visual bar: the orbit target sat on the north roadway, pan was enabled, and `minDistance` was 8, so a drag clipped into two facades and left a black field with stray road lines. Mobile was closer to a street view.

The camera now opens on an elevated three-quarter view of the district. The orbit target is the block (`[0, 2.4, 0]` on desktop, `[0, 3.2, -6]` on a portrait frame). Pan is off, so arrow keys orbit instead of sliding the target into empty space. Distance and polar angle are clamped so the camera stays outside the buildings and keeps the ground in frame. The ground plane and a district pad read darker than the clear color, lane markings are thicker, and a fogged skyline sits outside the orbit clamp. CineLights still runs; its 22–110 fog is widened to 84–176 so the whole block is not swallowed.

SwiftShader remeasure, same ceilings, same Chrome flags, `/?forge=1`, 2026-10-17. Renderer remains `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)`. These are software-rendering regression checks, not phone or discrete-GPU numbers.

| Gate | Ceiling | Desktop 1440×900 adaptive | Mobile 390×844 lite, touch, dsf 2 |
| --- | --- | --- | --- |
| Navigation → first GL | 4986 / 3552 ms | 2195 ms | 1291 ms |
| FPS | min 2.98 / 15.51 | 3.694 | 20.084 |
| Frame p50 / p95 / p99 | 375/725/825 and 75/125/175 ms | 266.7 / 516.7 / 616.7 | 50 / 99.9 / 116.7 |
| `performance.memory` after orbit | 127,780,119 / 121,110,065 | 81,456,243 | 78,624,480 |
| CDP heap after orbit | 79,388,166 / 72,728,820 | 49,252,572 | 46,461,648 |
| WebGL2 lose / restore | required on both | lost, `defaultPrevented`, restored, canvas stayed mounted | same |

Keyboard orbit delta 32.9. Pointer orbit delta 30.2 desktop, 30.1 mobile. `full` still one antialiased WebGL2 canvas. `minimum` + `?forge=1` canvas count 0 and no `git-city` request.

Regenerated stills (initial and after orbit):

- `/opt/cursor/artifacts/screenshots/pr1-desktop-1440x900.png`
- `/opt/cursor/artifacts/screenshots/pr1-desktop-after-orbit.png`
- `/opt/cursor/artifacts/screenshots/pr1-mobile-390x844.png`
- `/opt/cursor/artifacts/screenshots/pr1-mobile-after-orbit.png`

Walkthroughs replaced in place:

- `/opt/cursor/artifacts/recordings/pr1-desktop-walkthrough.webm`
- `/opt/cursor/artifacts/recordings/pr1-mobile-walkthrough.webm`

Commands after the framing edit: typecheck exit 0 (6.194s), lint exit 1 with the same 3 errors and 7 warnings (2.256s), `npm test` exit 1 with layout 6/6 then 179 pass / 16 fail / 0 skipped (0.639s), build exit 0 (2.188s). `city-world` chunk 16,672 bytes. `git-city-world` chunk 19,567 bytes. `cine-lights` chunk 890,424 bytes. Migrate skipped.

The numbers in the earlier browser table are the pre-fix run. This section is the one that matches the stills.

## Changed files

| Path | Change |
| --- | --- |
| `src/lib/git-city/layout.ts` | New. 382 lines. Seeded loop, sidewalks, 21 id-keyed footprints, doors, window bays. No `three` import. |
| `src/lib/git-city/layout.test.ts` | New. 141 lines. 6 tests. |
| `src/components/git-city/parts.tsx` | New. 406 lines. Street, sidewalk, facades, doors, window bays, district silhouettes. |
| `src/components/git-city/git-city-world.tsx` | New. 121 lines. R3F canvas, orbit, context-loss overlay. |
| `src/components/city-os.tsx` | Lazy import and `?forge=1` / Forge button. CityWorld stays the default. |
| `package.json` | Test script prepends `src/lib/git-city/layout.test.ts`. No dependency changes. |

Not changed: `src/routes/**`, `src/routeTree.gen.ts`, `src/lib/auth/**`, `src/lib/grid.ts`, `src/components/city-world.tsx`, `.grok/app-env.json` (not created).

Undo: delete `src/lib/git-city/` and `src/components/git-city/`, remove the forge import and button from `city-os.tsx`, and remove the extra test path from `package.json`.

## Commands versus the a98a4ae baseline

Same machine, same scripts. Baseline figures are from the Phase 0 pass on this tree (typecheck 0 in 9.948s, lint exit 1 in 3.271s with 3 errors and 7 warnings, `npm test` exit 1 in 0.689s with 179 pass / 16 fail / 0 skipped of 195, build exit 0 in 3.431s, `city-world` chunk 16,672 bytes, `cine-lights` chunk 890,424 bytes).

This pass, after the slice, timed on 2026-10-17:

| Command | Exit | Seconds | Result |
| --- | --- | --- | --- |
| `npx tsc --noEmit --pretty false` | 0 | 6.345 | Clean. |
| `npx eslint .` | 1 | 2.359 | 3 errors, 7 warnings. Same files and rules as the baseline. No new error. |
| `npm test` | 1 | 0.624 | Layout file: 6 pass, 0 fail, 0 skipped. Then the existing script tests: 195 tests, 179 pass, 16 fail, 0 skipped. Same 16 names (27, 28, 29, 79, 89, 101, 105, 106, 107, 109, 110, 113, 178, 180, 184, 194). |
| `npm run build` | 0 | 2.238 | `city-world-BWfMz53P.js` is 16,672 bytes. `git-city-world-yRrwgJC9.js` is 17,070 bytes. `cine-lights-xNyAGFyN.js` is 890,424 bytes. `db:migrate` skipped because `DATABASE_URL` is unset. |

Logs: `/opt/cursor/artifacts/pr1/`.

The 16 failures are the pre-existing gitignored-fixture and PWA cwd failures. They are not skipped. The auth-off fixture fix is not in this branch.

## Browser evidence

Software rendering. Chrome headless, `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`. Renderer string on both profiles:

`ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)`

WebGL 2.0 (OpenGL ES 3.0 Chromium). These numbers are a same-VM regression check against the approved ceilings. They are not a phone result and not a discrete-GPU result.

Server: `VITE_AUTH_ENABLED=false` on the dev process only. No `.grok/app-env.json`.

Route: `/?forge=1`. Measured 2026-10-17. Raw JSON: `/opt/cursor/artifacts/pr1/BENCHMARK.json`. Harness: `/opt/cursor/artifacts/pr1/forge-evidence.mjs`.

| Gate | Ceiling | Desktop 1440×900, adaptive, antialias on | Mobile 390×844, touch, dsf 2, lite, antialias off, buffer 390×844 |
| --- | --- | --- | --- |
| Navigation → first GL | 4986 / 3552 ms | 2327 ms | 1612 ms |
| FPS | min 2.98 / 15.51 | 4.438 | 22.028 |
| Frame p50 / p95 / p99 | 375/725/825 and 75/125/175 ms | 216.7 / 466.6 / 583.3 | 49.9 / 83.4 / 116.6 |
| `performance.memory` after orbit | 127,780,119 / 121,110,065 | 81,501,933 | 77,886,457 |
| CDP heap after orbit | 79,388,166 / 72,728,820 | 49,316,216 | 45,745,488 |
| WebGL2 | required | yes | yes |

Nearest-rank percentile, same method as the sibling baseline, over a ~30 s orbit.

Stills:

- `/opt/cursor/artifacts/screenshots/pr1-desktop-1440x900.png`
- `/opt/cursor/artifacts/screenshots/pr1-mobile-390x844.png`
- `/opt/cursor/artifacts/screenshots/pr1-desktop-after-orbit.png`
- `/opt/cursor/artifacts/screenshots/pr1-mobile-after-orbit.png`
- `/opt/cursor/artifacts/screenshots/pr1-full-1440x900.png`
- `/opt/cursor/artifacts/screenshots/pr1-minimum.png`

Walkthroughs (the orbit is inside the clip):

- `/opt/cursor/artifacts/recordings/pr1-desktop-walkthrough.webm` (1440×900, 44.8 s)
- `/opt/cursor/artifacts/recordings/pr1-mobile-walkthrough.webm` (390×844, 38.4 s)

Camera: desktop arrow keys moved the camera by 0.46 units with the canvas focused. The desktop orbit moved it by 31.8 units. The mobile touch orbit moved it by 26.7 units.

Context loss, both profiles: `loseContext()` set `isContextLost()` true, the event was cancelable and `defaultPrevented`, the obsidian overlay `[data-gl-lost]` was visible, the canvas stayed mounted (count 1), `restoreContext()` cleared the lost flag, the overlay hid, the context was still WebGL2, and the prototype label was visible again.

- `/opt/cursor/artifacts/screenshots/pr1-desktop-context-lost.png`
- `/opt/cursor/artifacts/screenshots/pr1-desktop-context-restore.png`
- `/opt/cursor/artifacts/screenshots/pr1-mobile-context-lost.png`
- `/opt/cursor/artifacts/screenshots/pr1-mobile-context-restore.png`

Tiers:

- `full` (localStorage): one canvas, WebGL2, antialias on, compute `full`.
- `adaptive`: the desktop profile above.
- `lite`: the mobile profile above. DPR cap 1, antialias off.
- `minimum` with `/?forge=1`: canvas count 0, `data-forge-scene` absent, no request URL containing `git-city`. The HTML city stage remained.

Default without `?forge=1`: after Enter, one canvas and no forge scene. The Forge button mounts the slice. The City button returns to a canvas that is not the forge scene.

Tier density is window columns (4 / 3 / 2), not 220 / 110 / 48 fill cubes. Those cubes fail the visual bar. Antialias and the DPR cap still follow CityWorld.

## Orchestrator

Neuro confirmed the orchestrator of record: GrokFleet (interim orchestrator; Hermes pending install, interfaces simulated).

## Per-task receipts

Approved method: the proposed per-task record in `RFP_CBA_GATE.md`, for this PR only. Approver: Neuro, 2026-10-16. Reviewer of evidence: VERITY. No organizational RFP template was found, and none was invented here.

Actual effort is the diff, not a calendar estimate. Token estimates in the gate were not metered.

| Task | What landed | Check |
| --- | --- | --- |
| T1 | `layout.ts` plus 6 passing tests. Closed 4-slab loop. Sidewalks outside the roadway. Footprints off the road and off the sidewalk. | `npm test` runs this file first. It passes. The 16 older failures still fail. |
| T2 | `parts.tsx` and `git-city-world.tsx` on the existing R3F 9 / three 0.185 path. Colors from `GRID_COLORS`. `CineLights` reused. No new package. No second Three chunk (`cine-lights` still 890,424 bytes). | Typecheck 0. Build emits `city-world` and one new scene chunk. |
| T3 | Podium, shaft, cornice, separate door frame and dark door panel, separate window bays, pinned silhouettes (spire, crown, crane, bunker, fins, mast) and codes MC, HX, DK, AG, HF, S6. | Stills above. Not a texture wrapped on one cube. |
| T4 | Origins are an id-keyed table. `originById.mission.x` is 0. The building order is not alphabetical. Covered ids match `DISTRICTS`. `grid.ts` was not edited. The new scene does not call `enterBuilding`, so `utility` / `street` / `holofoil` are not given a new enter path. Selecting one still uses the existing district select. | Layout tests. |
| T5 | drei `OrbitControls`, `touchAction: "none"`, canvas `tabIndex` 0. Pan is disabled. Arrow keys orbit the district target inside the polar and distance clamps, because drei's `keyEvents` prop only calls `connect` and the stock key handler pans. | Framing follow-up stills and walkthroughs. Keyboard delta 32.9, pointer deltas about 30. |
| T6 | Import runs only when forge is open and compute is not `minimum` and mode is not `start` or `world`. The `alive` flag drops a late resolution. | Four loads above. Minimum made zero `git-city` requests. |
| T7 | `webglcontextlost` calls `preventDefault`. Overlay while lost. Canvas stays mounted. Restore hides the overlay. | Both profiles in `BENCHMARK.json`. |
| T8 | Test path appended in front of the existing script so a layout failure stops the run, and the old 16 failures still print. Evidence harness is an artifact, not a CI workflow. | This document. |

## VERITY review request

Please review this branch against `PROTOTYPE_ACCEPTANCE_SPEC.md` and the T1–T8 rows. In particular:

1. Do the desktop and mobile stills show a street loop, sidewalks, facades, doors, and window bays, with district differences, in `#05070A` / `#19E6E6` / `#FF2A2A`? Abstract cubes should not pass.
2. Do the SwiftShader numbers stay inside the approved ceilings, labeled as software rendering?
3. Do both profiles lose and restore the WebGL2 context with the canvas still mounted?
4. Does minimum stay at canvas count 0, including when `?forge=1` is present?
5. Are the 16 test failures still the same 16, with no skips, and is lint still 3 errors and 7 warnings?
6. Are auth, routes, and `VITE_AUTH_ENABLED` untouched, with no `.grok/app-env.json`?
7. Is CityWorld still the default when forge is closed?

This is not a request to merge or deploy. The orbit prototype is not a finished interactive city.
