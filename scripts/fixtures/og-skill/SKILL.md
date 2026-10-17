<!-- Test double for scripts/brand-check.test.mjs and scripts/write-atomic.test.mjs.
     The live operator prompt is gitignored under .grok/ and is not in this checkout.
     This is not a recovered platform skill. -->

# OG share card

The pending marker is `/workspace/.grok/og-pending`. Treat it as stale after 10 minutes.

## Brand-asset pass:

Do not wait_tasks and never get_task_output. The pass checks its own output:

`node scripts/brand-check.mjs --game`

`node scripts/brand-check.mjs --placeholder-ok`

## After the pass

Hand the files over with write-atomic. The commands are in references/handover.md.
