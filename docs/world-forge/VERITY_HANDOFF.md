# VERITY handoff — WORLD FORGE PR #1

VERITY has NOT independently reviewed or certified this branch, the spatial prototype, the header remediation, or any production claim. Preparing this note is not a review and it is not a certification.

- PR: https://github.com/AGENTROPOLIS-CITY-OF-AGENTS/NEURO-BUILDING-AGENTROPOLIS/pull/3
- Branch: `feat/world-forge-spatial-slice`
- Base: `feat/world-stack`
- Parent of the slice: `a98a4ae92b6fb92af5ec2ac8271780378e9f6c1e`
- Header fix commit: `dd8eefebc0e05e20333eb1f9912b93ab6510a8a5`
- Evidence record commit: `0c7987ce6a7ee739e75ad21d427bcee98c1baf44`
- Measured head, and the commit the first fresh Codex request saw: `64e1e874c6c3c413caf1c74e7db9be4680cb6231`
- SHA under review: that commit plus this documentation line. The PR head after this file lands is the tree Codex should review. Header behavior was measured at `64e1e874c6c3c413caf1c74e7db9be4680cb6231`.
- VERITY has NOT independently reviewed or certified anything. Until VERITY replies, nothing here is accepted.

## What is in the branch

A removable orbit prototype of a static district. CityWorld stays the default. `?forge=1` and the Forge control open the slice. Minimum compute does not import it (canvas count 0). The latest remediation compacts the header below 1280px into a Forge button plus a Menu disclosure (`aria-expanded`, `aria-controls="os-header-tools"`, Escape returns focus, outside pointer closes). The 1440px header cluster is the original row.

Orchestrator name, where this repo names one: GrokFleet (interim orchestrator; Hermes pending install, interfaces simulated).

## Open findings and remaining risks

- Codex reviewed `278dbfca1b0fcb739cd03e520822964127e307fc` and left P2 review comment 4301865040 (mobile header overflow). The remediation is evidenced in `docs/world-forge/PR1_EVIDENCE.md`. A fresh Codex review is requested after the push. Until that review finishes, its result is unknown. Copilot's earlier review was a quota failure with no code findings.
- No CI checks were reported on the PR at the time of the remediation (`statusCheckRollup` empty).
- `npm test` still fails the same 16 pre-existing script tests (27, 28, 29, 79, 89, 101, 105, 106, 107, 109, 110, 113, 178, 180, 184, 194). They are not skipped. The `&&` chain does not reach the auth tests when those 16 fail; a separate run of those files passed 45 / 0.
- Lint is still exit 1 with 3 errors and 7 warnings. The city-os warning is the pre-existing missing `view` dependency.
- SwiftShader only. The 12 s header remeasure is not a phone or discrete-GPU result. The ~30 s ceiling run remains the framing evidence, taken before this header edit, on software GL.
- The floor dock still scrolls horizontally inside its own box. That is pre-existing and is not the header P2.
- The interactive city is not complete. No vehicles, physics, navmesh, CityDrive, autonomous navigation, live ATG, governance execution, or WORLDQ. ATG is the agent language, not decoration.
- Merge is not authorized. This handoff is not a GO.

## Evidence

`docs/world-forge/PR1_EVIDENCE.md` and `/opt/cursor/artifacts/pr1/`. Before/after header stills are under `/opt/cursor/artifacts/screenshots/header-before-*.png` and `header-after-*.png`. Recordings: `/opt/cursor/artifacts/recordings/header-mobile-nav.webm` and `header-spatial-walkthrough.webm`.
