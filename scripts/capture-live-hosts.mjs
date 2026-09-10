#!/usr/bin/env node
/**
 * Capture the actual UI of every LIVE host into /public/media/stills/live.
 * Host containers must show these shots — never cinematic / random video.
 *
 *   node scripts/capture-live-hosts.mjs
 *
 * Re-run whenever a live site UI changes.
 */
import { mkdirSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public/media/stills/live");
const MANIFEST = join(ROOT, "src/lib/live-hosts.json");
const PAGES = "https://agentropolis-city-of-agents.github.io";

const HOSTS = [
  { id: "host-agentropolis", url: "https://agentropolis.dev", label: "AGENTROPOLIS" },
  { id: "studio-online", url: "https://neurometax.online", label: "N3" },
  { id: "studio-com", url: "https://neurometax.com", label: "NEURO STUDIO" },
  { id: "studio-store", url: "https://neurometax.store", label: "NEURO STORE" },
  { id: "host-wiredchaos", url: "https://wiredchaos.xyz", label: "WIRED CHAOS" },
  { id: "host-gmn", url: "https://getmoneynews.online", label: "GMN" },
  { id: "host-nmxai", url: "https://nmxai.xyz", label: "NMX AI" },
  { id: "host-neteru", url: "https://neteru.xyz", label: "NETERU" },
  { id: "botbae-pages", url: `${PAGES}/AGENTROPOLIS-BOTBAE/`, label: "BOTBAE builder" },
  { id: "hermes-pages", url: `${PAGES}/HERMES-CITY/`, label: "HERMES CITY" },
  { id: "hermes-community", url: `${PAGES}/HERMES-CITY/community/`, label: "HERMES Community" },
  { id: "hermes-social", url: `${PAGES}/HERMES-CITY/social/`, label: "HERMES Social Grid" },
  { id: "atg-pages", url: `${PAGES}/AGENTROPOLIS-ATG/`, label: "ATG" },
  { id: "mcp-pages", url: `${PAGES}/AGENTROPOLIS-AGENT-MCP/`, label: "AGENT MCP" },
  { id: "parallax-pages", url: `${PAGES}/AGENTROPOLIS-PARALLAX-SPATIAL-MCP/`, label: "PARALLAX" },
  { id: "world-pages", url: `${PAGES}/AGENTROPOLIS-WORLD/`, label: "AGENTROPOLIS WORLD" },
  { id: "aquaduct-pages", url: `${PAGES}/AGENTROPOLIS-AQUADUCT/`, label: "AQUADUCT" },
  { id: "webmcp-pages", url: `${PAGES}/AGENTROPOLIS-WEBMCP-CHALLENGE/`, label: "WebMCP Challenge" },
  { id: "chaos-rank", url: `${PAGES}/AGENTROPOLIS-CHAOS-RANK/`, label: "CHAOS RANK" },
  { id: "creator-pages", url: `${PAGES}/AGENTROPOLIS-CREATOR/`, label: "CREATOR" },
];

const ALIASES = {
  "gate-botbae": "botbae-pages",
  "atralith-kit": "atg-pages",
};

mkdirSync(OUT_DIR, { recursive: true });

const CONCURRENCY = 3;
const NAV_MS = 22000;

async function captureOne(browser, host) {
  const file = join(OUT_DIR, `${host.id}.jpg`);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 810 },
    deviceScaleFactor: 1,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    locale: "en-US",
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const started = Date.now();
  try {
    const response = await page.goto(host.url, { waitUntil: "domcontentloaded", timeout: NAV_MS });
    const status = response?.status() ?? 0;
    await page.waitForTimeout(1800);
    await page.screenshot({
      path: file,
      type: "jpeg",
      quality: 72,
      fullPage: false,
    });
    await context.close();
    return {
      id: host.id,
      label: host.label,
      url: host.url,
      ok: existsSync(file) && status < 400,
      status,
      file: `/media/stills/live/${host.id}.jpg`,
      ms: Date.now() - started,
    };
  } catch (err) {
    await context.close().catch(() => undefined);
    return {
      id: host.id,
      label: host.label,
      url: host.url,
      ok: existsSync(file),
      status: 0,
      error: String(err?.message ?? err).slice(0, 180),
      file: existsSync(file) ? `/media/stills/live/${host.id}.jpg` : null,
      ms: Date.now() - started,
    };
  }
}

async function runPool(browser, items) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const host = items[i++];
      const row = await captureOne(browser, host);
      results.push(row);
      const mark = row.ok ? "ok" : "FAIL";
      console.log(`[capture] ${mark} ${host.id} ${row.status ?? ""} ${row.error ?? ""}`.trim());
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  return results;
}

const browser = await chromium.launch({
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});

let results = [];
try {
  results = await runPool(browser, HOSTS);
} finally {
  await browser.close();
}

for (const [alias, source] of Object.entries(ALIASES)) {
  const src = results.find((r) => r.id === source);
  if (src) {
    const from = join(OUT_DIR, `${source}.jpg`);
    const to = join(OUT_DIR, `${alias}.jpg`);
    if (existsSync(from)) copyFileSync(from, to);
    results.push({ ...src, id: alias, aliasOf: source, file: `/media/stills/live/${alias}.jpg` });
  }
}

const manifest = {
  capturedAt: new Date().toISOString(),
  rule: "LIVE containers show captured screenshots of the live URL. Never cinematic or random video. Recapture when a host UI changes.",
  construction: "Working build. Under construction. Host UI updates must refresh these stills.",
  hosts: results.sort((a, b) => a.id.localeCompare(b.id)),
};

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
writeFileSync(join(ROOT, "public/media/live-hosts.json"), JSON.stringify(manifest, null, 2) + "\n");

const ok = results.filter((r) => r.ok).length;
const fail = results.filter((r) => !r.ok).length;
console.log(`[capture] wrote ${ok} stills, ${fail} failed. ${MANIFEST}`);
if (ok === 0) process.exit(1);
