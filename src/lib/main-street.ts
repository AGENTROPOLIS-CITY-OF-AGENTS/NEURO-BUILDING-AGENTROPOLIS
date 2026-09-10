export type MsMode = "web2" | "hybrid" | "web3";
export type MsPlace = "look" | "save" | "work" | "claim" | "city";
export type MsIntent = "shop" | "work" | "create" | "learn" | "explore";
export type MsRegionId =
  | "plaza"
  | "commerce"
  | "creator"
  | "work"
  | "learn"
  | "play"
  | "services"
  | "own";

export type MsRegion = {
  id: MsRegionId;
  name: string;
  short: string;
  intent?: MsIntent;
  lead: string;
  next: string;
  actions: { id: string; label: string; sensitive?: boolean; deny?: boolean }[];
  explain: string;
  later?: boolean;
  color: string;
  pad: string;
  shape: "plaza" | "shop" | "atelier" | "hall" | "library" | "marquee" | "civic" | "vault";
  position: [number, number, number];
  size: [number, number, number];
};

export const MS_STORE = "agentropolis-main-street-v1";

export const MS_MODES: { id: MsMode; label: string; note: string }[] = [
  { id: "web2", label: "Web2", note: "Shops. No wallet." },
  { id: "hybrid", label: "Bridge", note: "Same street. Both rails." },
  { id: "web3", label: "Web3", note: "Ownership available. Not forced." },
];

export const MS_PLACES: { id: MsPlace; label: string; plain: string }[] = [
  { id: "look", label: "Visitor", plain: "Look around" },
  { id: "save", label: "Resident", plain: "Save my place" },
  { id: "work", label: "Worker", plain: "Work or create" },
  { id: "claim", label: "Owner", plain: "Claim what is mine" },
  { id: "city", label: "Citizen", plain: "Enter the wider city" },
];

export const MS_INTENTS: { id: MsIntent; label: string; region: MsRegionId; line: string }[] = [
  { id: "shop", label: "Shop", region: "commerce", line: "Commerce Row is the shops. I can take you there." },
  { id: "work", label: "Work", region: "work", line: "Work Exchange is for tasks. I can take you there." },
  { id: "create", label: "Create", region: "creator", line: "Creator Boulevard is for making things." },
  { id: "learn", label: "Learn", region: "learn", line: "Learning Quarter. One lesson at a time." },
  { id: "explore", label: "Explore", region: "plaza", line: "We can walk the boulevard. I will keep it simple." },
];

export const MS_REGIONS: MsRegion[] = [
  {
    id: "plaza",
    name: "Welcome Plaza",
    short: "Plaza",
    lead: "You are at the start of Main Street.",
    next: "Want to shop, work, learn, create, or explore?",
    actions: [
      { id: "shop", label: "Shop" },
      { id: "work", label: "Work" },
      { id: "create", label: "Create" },
      { id: "learn", label: "Learn" },
      { id: "explore", label: "Explore" },
    ],
    explain: "Main Street is the easy way into the city. You can look around without a wallet.",
    color: "#00ffff",
    pad: "#082028",
    shape: "plaza",
    position: [0, 0, 0],
    size: [8.4, 2.2, 8.4],
  },
  {
    id: "commerce",
    name: "Commerce Row",
    short: "Shop",
    intent: "shop",
    lead: "You are in the shops.",
    next: "Pick one thing. Prices are plain. No money leaves this floor.",
    actions: [
      { id: "browse", label: "See goods" },
      { id: "buy-pin", label: "Get the pin", sensitive: true },
      { id: "buy-note", label: "Get the notebook", sensitive: true },
    ],
    explain: "A shop here works like a normal store. A receipt shows what happened. Nothing is charged.",
    color: "#00e8ff",
    pad: "#0a2430",
    shape: "shop",
    position: [12.5, 0, -8.2],
    size: [7.2, 4.6, 5.2],
  },
  {
    id: "creator",
    name: "Creator Boulevard",
    short: "Create",
    intent: "create",
    lead: "You are on Creator Boulevard.",
    next: "Make something, publish it here, or ask for help.",
    actions: [
      { id: "make", label: "Make something" },
      { id: "publish", label: "Publish", sensitive: true },
      { id: "help", label: "Get help" },
    ],
    explain: "Create first. Ownership talk comes later. Publish on this floor stays local.",
    color: "#ff00ff",
    pad: "#241028",
    shape: "atelier",
    position: [12.5, 0, 8.2],
    size: [7.2, 4.8, 5.4],
  },
  {
    id: "work",
    name: "Work Exchange",
    short: "Work",
    intent: "work",
    lead: "You are at the Work Exchange.",
    next: "There are no live jobs here. You can still try a sample task.",
    actions: [
      { id: "find", label: "Find work" },
      { id: "sample", label: "Try a sample", sensitive: true },
      { id: "receipts", label: "See my receipts" },
    ],
    explain: "A real job would pay through the city. This floor only shows the shape of the work.",
    color: "#39ff14",
    pad: "#102410",
    shape: "hall",
    position: [24.5, 0, -8.2],
    size: [7.6, 5.2, 5.6],
  },
  {
    id: "learn",
    name: "Learning Quarter",
    short: "Learn",
    intent: "learn",
    lead: "You are in the Learning Quarter.",
    next: "One lesson. Then we stop.",
    actions: [
      { id: "lesson-street", label: "What is this street?" },
      { id: "lesson-receipt", label: "What is a receipt?" },
      { id: "lesson-wallet", label: "What is a wallet?" },
    ],
    explain: "I teach one idea at a time. You stay in control.",
    color: "#7ad7ff",
    pad: "#102030",
    shape: "library",
    position: [24.5, 0, 8.2],
    size: [7.4, 5.8, 5.4],
  },
  {
    id: "play",
    name: "Entertainment Promenade",
    short: "Play",
    lead: "You are on the Promenade.",
    next: "Browse or play a local preview. No live show is on this floor.",
    actions: [
      { id: "browse", label: "Browse" },
      { id: "play", label: "Play preview" },
    ],
    explain: "This is the fun side of the street. Previews stay local. Nothing streams in.",
    color: "#ff7ad2",
    pad: "#241018",
    shape: "marquee",
    position: [36.5, 0, -8.2],
    size: [7.4, 5.4, 5.4],
  },
  {
    id: "services",
    name: "Services Square",
    short: "Help",
    lead: "You are in Services Square.",
    next: "I can save your place on this device, or explain the street.",
    actions: [
      { id: "help", label: "Help" },
      { id: "save", label: "Save my place", sensitive: true },
      { id: "account", label: "My place" },
    ],
    explain: "Saving your place writes to this device only. It is not a city account.",
    color: "#9aa8ff",
    pad: "#141830",
    shape: "civic",
    position: [36.5, 0, 8.2],
    size: [7.2, 4.8, 5.2],
  },
  {
    id: "own",
    name: "Ownership Terminal",
    short: "Own",
    later: true,
    lead: "You are at the Ownership Terminal.",
    next: "I will explain first. No wallet is connected on this floor.",
    actions: [
      { id: "wallet", label: "What is a wallet?" },
      { id: "custody", label: "Who holds it?" },
      { id: "fees", label: "Fees" },
      { id: "withdraw", label: "Withdraw" },
      { id: "connect", label: "Connect a wallet", sensitive: true, deny: true },
    ],
    explain:
      "A wallet is a key to things you own. Custody means who holds that key. Fees are what you pay to move value. Withdrawal is how you take it out. None of that is live on this floor.",
    color: "#ff3131",
    pad: "#2a1014",
    shape: "vault",
    position: [48.5, 0, 0],
    size: [6.4, 6.2, 6.4],
  },
];

export const MS_REGION_BY_ID = Object.fromEntries(MS_REGIONS.map((r) => [r.id, r])) as Record<
  MsRegionId,
  MsRegion
>;

export const MS_GOODS = [
  {
    id: "pin",
    name: "City pin",
    price: "6",
    get: "A local pin mark on this floor.",
    own: "Nothing on a chain.",
    withdraw: "Nothing to withdraw.",
  },
  {
    id: "note",
    name: "Street notebook",
    price: "12",
    get: "A local notebook mark on this floor.",
    own: "Nothing on a chain.",
    withdraw: "Nothing to withdraw.",
  },
] as const;

export type MsReceipt = {
  id: string;
  at: string;
  region: MsRegionId;
  action: string;
  title: string;
  mode: MsMode;
  observed: string;
  verified: string;
  paid: string;
  received: string;
  owned: string;
  withdraw: string;
  note: string;
};

export type MsState = {
  place: MsPlace;
  mode: MsMode;
  seen: MsRegionId[];
  receipts: MsReceipt[];
  artifact: string | null;
  saved: boolean;
};

const EMPTY: MsState = {
  place: "look",
  mode: "web2",
  seen: ["plaza"],
  receipts: [],
  artifact: null,
  saved: false,
};

export function loadMs(): MsState {
  if (typeof window === "undefined") return { ...EMPTY, seen: ["plaza"] };
  try {
    const raw = window.localStorage.getItem(MS_STORE);
    if (!raw) return { ...EMPTY, seen: ["plaza"] };
    const parsed = JSON.parse(raw) as Partial<MsState>;
    return {
      place: parsed.place ?? "look",
      mode: parsed.mode ?? "web2",
      seen: Array.isArray(parsed.seen) && parsed.seen.length ? parsed.seen : ["plaza"],
      receipts: Array.isArray(parsed.receipts) ? parsed.receipts : [],
      artifact: parsed.artifact ?? null,
      saved: Boolean(parsed.saved),
    };
  } catch {
    return { ...EMPTY, seen: ["plaza"] };
  }
}

export function saveMs(state: MsState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MS_STORE, JSON.stringify(state));
}

export function msReceipt(partial: Omit<MsReceipt, "id" | "at">): MsReceipt {
  const now = new Date();
  const id = `MS-RCP-${now.getTime().toString(36).toUpperCase()}`;
  return {
    id,
    at: now.toISOString(),
    ...partial,
  };
}

export function bumpPlace(current: MsPlace, next: MsPlace): MsPlace {
  const order: MsPlace[] = ["look", "save", "work", "claim", "city"];
  return order.indexOf(next) > order.indexOf(current) ? next : current;
}

export const NAV_WELCOME = "Main Street. Web2 shops. Web3 across the bridge. I walk with you.";
export const NAV_ROLE = "NEURO. Guide, not permission.";
export const NAV_NO_WALLET = "No wallet yet.";
export const NAV_APPROVE = "Needs your yes.";
export const NAV_DENY = "Not on this floor.";
export const NAV_LATER = "Later.";
export const NAV_RECEIPT = "Receipt.";

export const MS_LESSONS: Record<string, { title: string; body: string }> = {
  "lesson-street": {
    title: "What is this street?",
    body: "Main Street is the easy door into AGENTROPOLIS. Shop, work, learn, and create like a normal app. The city handles the hard rails underneath when you need them.",
  },
  "lesson-receipt": {
    title: "What is a receipt?",
    body: "A receipt is a plain record. It says what you asked for, what was allowed, what you paid, what you got, and what you can take out. If a number is missing, it did not happen.",
  },
  "lesson-wallet": {
    title: "What is a wallet?",
    body: "A wallet holds keys to things you own. You do not need one to walk this street. When you want to claim something, the Ownership Terminal explains custody, fees, and withdrawal first.",
  },
};

export const MS_STATION = {
  name: "Main Street Station",
  position: [-16.5, 0, 0] as [number, number, number],
};
