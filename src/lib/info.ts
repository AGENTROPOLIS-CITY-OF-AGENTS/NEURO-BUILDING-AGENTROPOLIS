import type { ComputeWeight } from "@/lib/design-system";
import type { Agent, FloorLine } from "@/lib/grid";

/** Information density follows compute weight. Visuals and models drop with it. */
export const INFO_DEPTHS = ["summary", "inspect", "expand", "deep"] as const;
export type InfoDepth = (typeof INFO_DEPTHS)[number];

export function infoDepthFor(weight: ComputeWeight): InfoDepth {
  switch (weight) {
    case "minimum":
      return "summary";
    case "lite":
      return "inspect";
    case "adaptive":
      return "expand";
    case "full":
      return "deep";
  }
}

export const INFO_LABEL: Record<InfoDepth, string> = {
  summary: "SUMMARY",
  inspect: "INSPECT",
  expand: "EXPAND",
  deep: "DEEP DIVE",
};

export type InfoCaps = {
  agents: number;
  activity: number;
  surfaces: number;
  neighbors: number;
  posters: boolean;
  collective: boolean;
  skills: boolean;
  apps: boolean;
  response: boolean;
  sandbox: boolean;
  chat: boolean;
  tickerMs: number | null;
};

export const INFO_CAPS: Record<InfoDepth, InfoCaps> = {
  summary: {
    agents: 2,
    activity: 1,
    surfaces: 1,
    neighbors: 0,
    posters: false,
    collective: false,
    skills: false,
    apps: false,
    response: false,
    sandbox: false,
    chat: false,
    tickerMs: null,
  },
  inspect: {
    agents: 4,
    activity: 2,
    surfaces: 2,
    neighbors: 2,
    posters: false,
    collective: false,
    skills: false,
    apps: true,
    response: true,
    sandbox: false,
    chat: false,
    tickerMs: 8000,
  },
  expand: {
    agents: 8,
    activity: 3,
    surfaces: 4,
    neighbors: 4,
    posters: true,
    collective: true,
    skills: true,
    apps: true,
    response: true,
    sandbox: true,
    chat: true,
    tickerMs: 2800,
  },
  deep: {
    agents: 99,
    activity: 99,
    surfaces: 99,
    neighbors: 99,
    posters: true,
    collective: true,
    skills: true,
    apps: true,
    response: true,
    sandbox: true,
    chat: true,
    tickerMs: 2800,
  },
};

export function nextDepth(depth: InfoDepth): InfoDepth | null {
  return INFO_DEPTHS[INFO_DEPTHS.indexOf(depth) + 1] ?? null;
}

/** Attention first: gated → executing → idle. Governance never sorted away. */
export function rankAgents(agents: Agent[]): Agent[] {
  const rank = (status: Agent["status"]) => {
    if (status === "gated") return 0;
    if (status === "active" || status === "on-air" || status === "directing") return 1;
    return 2;
  };
  return [...agents].sort((a, b) => rank(a.status) - rank(b.status) || a.name.localeCompare(b.name));
}

export function take<T>(items: T[], n: number): T[] {
  return n >= items.length ? items : items.slice(0, n);
}

const ATTN = /denied|gated|approval|blocked|receipt|execute is still|waiting/i;

export function attentionFloor(lines: FloorLine[]): FloorLine[] {
  const hit = lines.filter((l) => ATTN.test(l.text));
  return hit.length ? hit : lines.slice(0, 3);
}

export function deeperLabel(depth: InfoDepth): string | null {
  const next = nextDepth(depth);
  return next ? INFO_LABEL[next] : null;
}
