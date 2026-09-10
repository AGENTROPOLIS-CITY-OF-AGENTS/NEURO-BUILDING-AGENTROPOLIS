# Deployment receipt — AGENTROPOLIS MAIN STREET

**Date:** 2026-09-08  
**Source path:** `site/` on branch `grok/main-street-spatial-public-build`  
**Workflow:** `.github/workflows/pages.yml`  
**Public URL:** https://agentropolis-city-of-agents.github.io/AGENTROPOLIS-MAIN-STREET/  
**Base path:** `/AGENTROPOLIS-MAIN-STREET/`

## What shipped

- Public 3D Main Street (Welcome Plaza + seven regions + Ownership Terminal)
- Persistent Navigator / Agent Dock (`Show me`, `Take me there`, `Explain`, `Not now`)
- Figma tokens and patterns: ChipCard, TraceButton, AgentDock, QuestWidget, ModeToggle (Web2 | Hybrid | Web3)
- Local session receipts only. No live wallets, balances, jobs, or telemetry
- Reduced-motion and low-power fallback (2.5D map of the same street)
- Orbit orbit-to-building. No WASD. Click to look. Enter to go inside.

## Known limitations

- This is a working public build. It is not a live payment rail.
- Checkout, publish, and sample work write **local receipts** on this device. Nothing is charged or settled.
- Wallet connect is **DENY**. Custody, fees, and withdrawal are explained, not executed.
- GitHub Pages must use GitHub Actions as the source. Enable Pages on the repository if the first workflow run is skipped.
- Heavy 3D loads after the HTML shell. If WebGL is missing, the 2.5D map is the street.

## Verify

1. Open the public URL.
2. Hear the Navigator: “Welcome to Main Street. I can show you around.”
3. Choose Shop / Work / Create / Learn / Explore.
4. Enter a building. Complete one action. Read the receipt.
