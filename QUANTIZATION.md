# AGENTROPOLIS QUANTIZATION RECEIPT

Measured 2026-09-10 against the Grok Publish Vercel artifact.

Snapshot: `q0-source-preservation`

## BEFORE

| Gate | Measure |
| --- | --- |
| Total publish artifact | 18 MB |
| Static media | 14 MB |
| Static JS | 1.7 MB |
| Film / VO in artifact | 38 mp4 + vo.mp3 (2.4 MB) |
| Largest JS | OrbitControls / Three 884 KB (240 KB gzip) |
| Largest image | city-overview.jpg 764 KB |
| 3D on server | stubbed |
| Initial HTML | 200 |

## AFTER

| Gate | Measure |
| --- | --- |
| Total publish artifact | **9.5 MB** |
| Static media | **5.8 MB** |
| Static JS | 1.7 MB (split) |
| Film / VO in artifact | **0 mp4 · 0 mp3** |
| Largest JS | OrbitControls 884 KB — **deferred until CITY** |
| Largest image | octane/asphalt.jpg 308 KB |
| 3D on server | none |
| Initial compressed JS (shell) | **~172 KB gzip** (index 126 + routes 37 + utils 9) |
| Nonessential 3D/media before intent | **0 bytes 3D · 0 bytes film** |
| SSR `/` | 200 · 14 KB HTML |

Target check: initial compressed JS **<= 350 KB** — PASS.

## DEFERRED (load after intent)

- CITY 3D world (`city-world` + Three / OrbitControls)
- Holofoil campus + world
- Main Street + world
- Utility campus + world
- Film player + captions
- ATG interior
- Journey / protocol / compare tours
- OS views (agents, MCP, destinations)
- Agent dock / district drawer expansion

## EXCLUDED FROM PRODUCTION (source preserved)

- `.grok/film-web/` — 8.9 MB film masters (mp4)
- `.grok/source-media/` — 8.5 MB film posters, unused stills, vo.mp3
- Tests, `.vercel` cache, screenshots, Imagine artifacts — never in the artifact

Not deleted. Not flattened. Not in the published shell.

## PRESERVED

- Full city source
- All districts
- 3D worlds (client-only)
- Unfinished systems (ATG, Parallax, Holofoil, Main Street, film)
- Design system, corridor, compute/info quantization
- Integrations / live host stills used by interiors

## PUBLISH STATUS

**PASS** (artifact 9.5 MB, shell quantized, 3D/film after intent)

Grok Publish has failed previously around **~25–27 MB** total output and **drei/Three on the serverless HTML path**. This build is **9.5 MB**, **no Three on the server**, **no film in the artifact**.
