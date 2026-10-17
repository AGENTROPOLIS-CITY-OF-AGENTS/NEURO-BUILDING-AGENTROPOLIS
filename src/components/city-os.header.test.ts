import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const src = readFileSync(new URL("./city-os.tsx", import.meta.url), "utf8");

function sliceBetween(start: string, end: string): string {
  const from = src.indexOf(start);
  const to = src.indexOf(end, from + start.length);
  assert.ok(from >= 0 && to > from, `missing region ${start} … ${end}`);
  return src.slice(from, to);
}

describe("city header mobile disclosure", () => {
  it("keeps the desktop cluster intact and hidden below xl", () => {
    const desktop = sliceBetween('data-header-desktop className="', "</div>");
    assert.match(desktop, /hidden items-center gap-2 xl:flex/);
    assert.match(desktop, /ComputeDock/);
    assert.match(desktop, /StudioRail/);
    assert.match(desktop, /data-forge-open/);
    assert.match(desktop, /data-ambient/);
    assert.match(desktop, /data-film-header/);
    assert.match(desktop, /data-command/);
  });

  it("exposes Forge and an expanded disclosure below xl", () => {
    const mobile = sliceBetween('data-header-mobile className="', "</div>");
    assert.match(mobile, /xl:hidden/);
    assert.match(mobile, /data-forge-open/);
    assert.match(mobile, /aria-expanded=\{headerTools\}/);
    assert.match(mobile, /aria-controls="os-header-tools"/);
    assert.match(mobile, /data-header-tools/);
  });

  it("puts compute, ambient, film, and find in the wrapping panel", () => {
    const panel = sliceBetween('id="os-header-tools"', "</div>");
    assert.match(panel, /role="region"/);
    assert.match(panel, /aria-label="Header controls"/);
    assert.match(panel, /hidden=\{!headerTools\}/);
    assert.match(panel, /flex-wrap/);
    assert.match(panel, /xl:hidden/);
    assert.match(panel, /<ComputeDock/);
    assert.match(panel, /StudioRail/);
    assert.match(panel, /data-dest="host-agentropolis"/);
    assert.match(panel, /\{DATA_MODE\}/);
    assert.match(panel, /Ambient/);
    assert.match(panel, /Film/);
    assert.match(panel, /Find/);
  });

  it("returns focus to the disclosure on Escape", () => {
    assert.match(src, /if \(headerTools\) \{[\s\S]*headerToolsButton\.current\?\.focus\(\)/);
  });
});
