<!-- Test double. Three hand-overs the write-atomic checker accepts. Not a recovered skill. -->

# Hand-over

node scripts/write-atomic.mjs /workspace/.grok/og.jpg.tmp public/og.jpg

node scripts/write-atomic.mjs /workspace/.grok/x-banner.jpg.tmp public/x-banner.jpg

node scripts/write-atomic.mjs /workspace/.grok/site.json.tmp src/lib/og/site.json
