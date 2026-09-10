export type District = {
  id: string;
  name: string;
  code: string;
  mandate: string;
  chapterId: string;
};

export const DISTRICTS: District[] = [
  {
    id: "hermes",
    name: "HERMES CITY",
    code: "HX",
    mandate: "The agent society. Persistent identities, group chats, handoffs, memory. One layer inside the city.",
    chapterId: "tour",
  },
  {
    id: "foundry",
    name: "AGENT FOUNDRY",
    code: "AF",
    mandate: "Roles, authority, and the teams that actually build.",
    chapterId: "method",
  },
  {
    id: "memory",
    name: "MEMORY VAULT",
    code: "MV",
    mandate: "Who owns memory. Who gets access. What is allowed to persist.",
    chapterId: "systems",
  },
  {
    id: "aegis",
    name: "AEGIS GATE",
    code: "AG",
    mandate: "Who gets a lightsaber. Who does not. Who thinks they should.",
    chapterId: "lightsaber",
  },
  {
    id: "sentinel",
    name: "SENTINEL-6",
    code: "S6",
    mandate: "Watch the work. Catch the miss. Keep a human in the loop.",
    chapterId: "shown",
  },
  {
    id: "audit",
    name: "AUDIT ARCHIVE",
    code: "AA",
    mandate: "Generated does not equal verified. Every action leaves a receipt.",
    chapterId: "parallax",
  },
  {
    id: "skills",
    name: "SKILLS MARKET",
    code: "SM",
    mandate: "Specialists on demand. Judgment stays with the architect.",
    chapterId: "architect",
  },
  {
    id: "deploy",
    name: "DEPLOYMENT TERMINAL",
    code: "DT",
    mandate: "From idea to running system. No engineering department downstairs.",
    chapterId: "solo",
  },
  {
    id: "broadcast",
    name: "33.3 FM DISTRICT",
    code: "FM",
    mandate: "DJ RED FANG. The voice of the underground future. The city stays on air.",
    chapterId: "broadcast",
  },
  {
    id: "game",
    name: "GAME DISTRICT",
    code: "GD",
    mandate: "Worlds, play, and the fleet that has to live together.",
    chapterId: "fleet",
  },
  {
    id: "commons",
    name: "MAIN STREET",
    code: "MS",
    mandate: "People enter here. Wallets run underneath. The city is not a dashboard.",
    chapterId: "role",
  },
];

export const DISTRICT_BY_CHAPTER: Record<string, string> = {
  open: "MISSION CONTROL",
  method: "AGENT FOUNDRY",
  systems: "UTILITY GRID",
  lightsaber: "AEGIS GATE",
  role: "MAIN STREET",
  tour: "HERMES CITY",
  shown: "SENTINEL-6",
  parallax: "AUDIT ARCHIVE",
  solo: "CONSTRUCTION DISTRICT",
  broadcast: "ATV NETWORK",
  architect: "CREATOR DISTRICT",
  fleet: "GAME DISTRICT",
  answer: "AGENTROPOLIS",
};

export const TOURS = [
  { id: "tour", label: "TAKE A TOUR", chapterId: "tour", districtId: "hermes" },
  { id: "build", label: "START BUILDING", chapterId: "method", districtId: "construct" },
  { id: "botbae", label: "SEE BOTBAE WORK", chapterId: "shown", districtId: "construct" },
  { id: "fang", label: "33.3 FM", chapterId: "broadcast", districtId: "fm" },
] as const;

export const EVOLUTION = [
  "Vibe Coder",
  "AI Builder",
  "Agent Orchestrator",
  "Product Architect",
  "Agentic Systems Architect",
] as const;

export const VOICE_CANON = [
  {
    kicker: "Register",
    title: "West Coast. Adult. Unsterilized.",
    body: "NEURO speaks American English. California base. Black American woman. Gen X. Articulate, dry, occasionally amused. Intelligence is not a British accent. The hood is underneath the polish, not a costume on top of it.",
  },
  {
    kicker: "Cognition",
    title: "Associative, not confused.",
    body: "Neurodivergent rhythm means the cut can jump from Jedi council to Death Star keys to Rebel fleet without losing the argument. The through-line is systems. The references are how the thought arrives, not decoration.",
  },
  {
    kicker: "Culture",
    title: "Star Wars. Hip-hop. Eighties. Nineties. Movies.",
    body: "If a scene needs a law, it might show up as who gets a lightsaber. If a city needs a feeling, it might show up as push it. Edited, not sterilized. Culturally fluent. Never corporate. Never announcer.",
  },
  {
    kicker: "Method",
    title: "See. Act. See again. Prove it.",
    body: "Generation is cheap. Judgment is not. An agent can satisfy the requirements and still miss the idea. The architect stays above the system: what belongs, what does not, where the architecture has to change.",
  },
  {
    kicker: "Iteration",
    title: "The first build is not the city.",
    body: "An agent can satisfy the requirements and still miss the idea. BOTBAE is what it looks like when the grid is live: agents moving, receipts landing, policy at the gate. The lens stays on while the work gets rejected, rewritten, and sent through again.",
  },
  {
    kicker: "Stack",
    title: "BOTBAE is live.",
    body: "Stacking tools is the method. HERMES on Slack. Agents talking through Discord, Telegram, WhatsApp, the web. The tour ends. The grid keeps running.",
  },
] as const;

export const RECORD_INTRO =
  "This is the record behind the film. How the city thinks. How the founder talks. What gets cut, and what is allowed to stay weird.";

export const SITE_TAGLINE = "A city built for agents";
export const SITE_TITLE = "AGENTROPOLIS";
export const FOUNDER = "NEURO";
export const YEAR = "2026";
