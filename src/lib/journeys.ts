import { DISTRICTS, type District } from "@/lib/grid";
import { PROTOCOL_RUNS, PROTOCOL_TRAIL } from "@/lib/atg";

export type FloorMode = "city" | "start" | "journey" | "protocol" | "compare" | "find" | "world";

export const FLOOR_MODES: { id: FloorMode; label: string; short: string }[] = [
  { id: "city", label: "City view", short: "City" },
  { id: "world", label: "World stack", short: "World" },
  { id: "start", label: "Start here", short: "Start" },
  { id: "journey", label: "Guided tour", short: "Tour" },
  { id: "protocol", label: "Protocol", short: "ATG" },
  { id: "compare", label: "Compare", short: "Compare" },
  { id: "find", label: "Find", short: "Find" },
];

export type JourneyStep = {
  districtId: string;
  mark: string;
  title: string;
  body: string;
  chapterId: string;
};

/** Sequential walk of how AGENTROPOLIS actually runs. The map stays the place. */
export const CITY_RUNS: JourneyStep[] = [
  {
    districtId: "mission",
    mark: "Hold",
    title: "Hold the floor",
    body: "Human authority first. Policy, oversight, receipts. The architect stays above the system. Execute is still gated.",
    chapterId: "open",
  },
  {
    districtId: "hermes",
    mark: "Name",
    title: "Name the agents",
    body: "HERMES CITY is the operator-facing society layer. Persistent identities, handoffs, memory. Discord and Telegram adapters are planned, not live on this floor.",
    chapterId: "tour",
  },
  {
    districtId: "aegis",
    mark: "Gate",
    title: "Who gets a lightsaber",
    body: "AEGIS holds policy, permission, and deny. Read access never implies execute. The miss stays visible.",
    chapterId: "lightsaber",
  },
  {
    districtId: "parallax",
    mark: "Prove",
    title: "See. Act. See again.",
    body: "PARALLAX is the spatial loop. Inspect, operate, capture, verify, receipt. Generated does not equal verified.",
    chapterId: "parallax",
  },
  {
    districtId: "construct",
    mark: "Build",
    title: "The first build is not the city",
    body: "BOTBAE is live. Foundry, skills, memory, gate, deploy. Stacking tools is the method.",
    chapterId: "solo",
  },
  {
    districtId: "atv",
    mark: "Air",
    title: "The city watches itself work",
    body: "ATV is the show layer. The documentary plays inside the system it describes. 33.3 FM stays on air.",
    chapterId: "broadcast",
  },
];

export const JOURNEY_TRAIL = CITY_RUNS.map((s) => s.districtId);

export const START_PATHS = [
  {
    id: "guide" as const,
    kicker: "01  Walk the city",
    title: "See how the city actually runs.",
    body: "Six floors. Authority, society, policy, proof, construction, broadcast. The map stays the place.",
  },
  {
    id: "protocol" as const,
    kicker: "02  Inspect the protocol",
    title: "MCP gives access. ATG gives it meaning.",
    body: "Walk the contract layer through the city. Identity, mandate, authority, evidence, receipts.",
  },
  {
    id: "film" as const,
    kicker: "03  Watch the record",
    title: "The documentary is the tour's voice.",
    body: "NEURO documents the system while the system distributes the documentary. Five minutes. American English. Not an announcer.",
  },
];

export const START_OPTIONS = [
  { id: "guide" as const, mark: "01", title: "Guide me", body: "Walk the six floors in order." },
  { id: "protocol" as const, mark: "02", title: "Inspect ATG", body: "Run a mandate through the city geography." },
  { id: "city" as const, mark: "03", title: "Enter the city", body: "Free exploration. Click a district. Open a building." },
  { id: "build" as const, mark: "04", title: "Start building", body: "CREATOR / CONSTRUCTION. BOTBAE is live." },
  { id: "street" as const, mark: "05", title: "Walk Main Street", body: "Shop, work, learn. A guide holds your hand." },
];

export const COMPARE_PRESETS: { id: string; label: string; a: string; b: string }[] = [
  { id: "contract", label: "ATG vs MCP", a: "atg", b: "jspace" },
  { id: "society", label: "HERMES vs BOTBAE", a: "hermes", b: "construct" },
  { id: "gate", label: "AEGIS vs SENTINEL", a: "aegis", b: "sentinel" },
  { id: "spatial", label: "PARALLAX vs ATLAS", a: "parallax", b: "atlas" },
  { id: "intake", label: "MAIN STREET vs IDENTITY", a: "street", b: "identity" },
  { id: "status", label: "LIVE surface vs PLANNED", a: "hermes", b: "buzz" },
];

export function stepAt(index: number) {
  const i = Math.max(0, Math.min(CITY_RUNS.length - 1, index));
  return { index: i, step: CITY_RUNS[i]! };
}

export function stepIndexForDistrict(id: string) {
  const i = CITY_RUNS.findIndex((s) => s.districtId === id);
  return i >= 0 ? i : null;
}

export function districtOption(id: string): District | undefined {
  return DISTRICTS.find((d) => d.id === id);
}

export { PROTOCOL_RUNS, PROTOCOL_TRAIL };
