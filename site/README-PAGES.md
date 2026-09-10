# AGENTROPOLIS: MAIN STREET

**Web2 outside. Web3 underneath. Ownership when ready.**

Public 3D onboarding district of Agentropolis.

**Live:** https://agentropolis-city-of-agents.github.io/AGENTROPOLIS-MAIN-STREET/

## What you see

A clean 3D commercial boulevard. A Navigator meets you at Welcome Plaza and offers one next step at a time:

- Shop
- Work
- Create
- Learn
- Explore

The city is the interface. The Navigator is the guide.

## Regions

1. Welcome Plaza
2. Commerce Row
3. Creator Boulevard
4. Work Exchange
5. Learning Quarter
6. Entertainment Promenade
7. Services Square
8. Ownership Terminal (further down the street — not first)

## How to walk it

1. Open the public URL.
2. Follow the Navigator, or click a building.
3. First click looks. **Enter this building** goes inside.
4. Do one thing. Read the receipt.
5. You do not need a wallet.

Orbit to look around. There is no WASD. On a low-power phone the same street is a 2.5D map.

## Build / deploy

Public files live in `site/`.

```text
site/index.html
site/styles.css
site/app.js
site/assets/
```

GitHub Pages is deployed by `.github/workflows/pages.yml` from this branch. The workflow uploads `site/` as the Pages artifact.

Local preview: serve the `site/` folder as the web root (any static server). Asset paths are relative.

## Truth on this floor

- No live agents, balances, jobs, or telemetry.
- Receipts are local session records.
- Wallet connect is denied.
- Navigator guidance is not permission.

See [GROK-BUILD.md](GROK-BUILD.md), [District Charter](DISTRICT-CHARTER.md), [Architecture](ARCHITECTURE.md), [Live Contextual Guidance](LIVE-CONTEXTUAL-GUIDANCE.md), and [DEPLOYMENT.md](DEPLOYMENT.md).
