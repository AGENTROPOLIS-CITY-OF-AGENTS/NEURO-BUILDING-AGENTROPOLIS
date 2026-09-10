export const FILM_DURATION = 308.16;
export const VO_END = 299.91;
export const VO_SRC = "/media/web/vo.mp3";
export const VOICE_ID = "ursa";
export const VOICE_LANG = "en-US";
export const CROSSFADE_MS = 320;

export type Shot = {
  id: string;
  start: number;
  end: number;
  src: string;
  poster: string;
  loop: boolean;
  inPoint: number;
  kind?: "picture" | "black" | "title";
  captionLift?: boolean;
};
export type Caption = { start: number; end: number; text: string };
export type Chapter = { id: string; label: string; start: number };

export const SHOTS: Shot[] = [
  { id: "open-city", start: 0.0, end: 5.78, src: "/media/web/px-neuro-cinematic.mp4", poster: "/media/stills/px-lockup.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "vibe-wait", start: 5.78, end: 11.21, src: "/media/web/px-vibe.mp4", poster: "/media/stills/px-vibe.jpg", loop: true, inPoint: 0.4, kind: "picture" },
  { id: "method-chibi", start: 11.21, end: 15.27, src: "/media/web/neuro-promo.mp4", poster: "/media/stills/neuro-oracle.jpg", loop: true, inPoint: 5.0, kind: "picture" },
  { id: "method-direct", start: 15.27, end: 25.56, src: "/media/web/hermes-neuro.mp4", poster: "/media/stills/hermes-neuro.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "systems-grid", start: 25.56, end: 35.44, src: "/media/web/neuropet.mp4", poster: "/media/stills/neuropet.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "systems-auth", start: 35.44, end: 46.85, src: "/media/web/hermes-receipt.mp4", poster: "/media/stills/hermes-receipt.jpg", loop: true, inPoint: 0.2, kind: "picture" },
  { id: "systems-ctrl", start: 46.85, end: 51.76, src: "/media/web/px-world-01.mp4", poster: "/media/stills/px-world-01.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "jedi", start: 51.76, end: 60.54, src: "/media/web/hood.mp4", poster: "/media/stills/hood.jpg", loop: true, inPoint: 1.0, kind: "picture" },
  { id: "became", start: 60.54, end: 64.76, src: "/media/web/city-overview.mp4", poster: "/media/stills/city-overview.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "hats", start: 64.76, end: 74.99, src: "/media/web/studio.mp4", poster: "/media/stills/studio.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "teams", start: 74.99, end: 84.16, src: "/media/web/botbae-hud2.mp4", poster: "/media/stills/botbae-hud2.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "hermes", start: 84.16, end: 90.54, src: "/media/web/hermes-neuro.mp4", poster: "/media/stills/hermes-neuro.jpg", loop: true, inPoint: 2.0, kind: "picture" },
  { id: "above", start: 90.54, end: 97.17, src: "/media/web/botbae-fly.mp4", poster: "/media/stills/botbae-fly.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "expertise", start: 97.17, end: 102.67, src: "/media/web/px-world-03.mp4", poster: "/media/stills/px-world-03.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "shown", start: 102.67, end: 116.9, src: "/media/web/botbae-hud.mp4", poster: "/media/stills/botbae-hud.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "miss", start: 116.9, end: 120.96, src: "/media/web/px-verify.mp4", poster: "/media/stills/px-verify.jpg", loop: true, inPoint: 0.3, kind: "picture" },
  { id: "act3", start: 120.96, end: 133.03, src: "/media/web/botbae-tour.mp4", poster: "/media/stills/botbae-tour.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "direction", start: 133.03, end: 136.31, src: "/media/web/px-imagine.mp4", poster: "/media/stills/px-imagine.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "px-pull", start: 136.31, end: 145.81, src: "/media/web/px-world-04.mp4", poster: "/media/stills/px-world-04.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "px-direct", start: 145.81, end: 153.81, src: "/media/web/px-spatial.mp4", poster: "/media/stills/px-spatial.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "px-body", start: 153.81, end: 163.5, src: "/media/web/px-neuro-cinematic.mp4", poster: "/media/stills/px-operator.jpg", loop: true, inPoint: 4.2, kind: "picture" },
  { id: "px-loop", start: 163.5, end: 170.01, src: "/media/web/px-loop.mp4", poster: "/media/stills/px-loop.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "verified", start: 170.01, end: 175.03, src: "/media/web/px-verify.mp4", poster: "/media/stills/px-verify.jpg", loop: true, inPoint: 1.0, kind: "picture" },
  { id: "keys", start: 175.03, end: 185.44, src: "/media/web/wallet.mp4", poster: "/media/stills/wallet.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "solo", start: 185.44, end: 189.32, src: "/media/web/neuro-promo.mp4", poster: "/media/stills/neuro-oracle.jpg", loop: true, inPoint: 8.2, kind: "picture" },
  { id: "org", start: 189.32, end: 203.32, src: "/media/web/aqueduct2.mp4", poster: "/media/stills/aqueduct2.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "coord", start: 203.32, end: 217.14, src: "/media/web/redfang-booth.mp4", poster: "/media/stills/redfang-booth.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "title-role", start: 217.14, end: 231.25, src: "/media/web/hermes-neuro.mp4", poster: "/media/stills/hermes-neuro.jpg", loop: true, inPoint: 3.5, kind: "picture" },
  { id: "roles", start: 231.25, end: 242.18, src: "/media/web/px-neuro2.mp4", poster: "/media/stills/px-neuro2.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "learning", start: 242.18, end: 247.68, src: "/media/web/redfang.mp4", poster: "/media/stills/redfang.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "nextgen", start: 247.68, end: 256.08, src: "/media/web/redcyan.mp4", poster: "/media/stills/redcyan.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "models", start: 256.08, end: 267.62, src: "/media/web/agent2-mid.mp4", poster: "/media/stills/agent2-mid.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "fleet", start: 267.62, end: 277.92, src: "/media/web/higgs.mp4", poster: "/media/stills/higgs.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "operate", start: 277.92, end: 285.34, src: "/media/web/botbae-keep.mp4", poster: "/media/stills/botbae-keep.jpg", loop: true, inPoint: 0.0, kind: "picture" },
  { id: "answer", start: 285.34, end: 293.71, src: "/media/web/botbae-hero.mp4", poster: "/media/stills/botbae-hero.jpg", loop: true, inPoint: 0.0, kind: "picture", captionLift: true },
  { id: "close-logo", start: 293.71, end: 299.91, src: "/media/web/neuro-promo.mp4", poster: "/media/stills/neuro-promo.jpg", loop: true, inPoint: 3.1, kind: "title" },
  { id: "credits", start: 299.91, end: 308.16, src: "", poster: "", loop: true, inPoint: 0.0, kind: "black" },
];

export const CAPTIONS: Caption[] = [
  { start: 0.14, end: 4.0, text: "A year ago, I called myself a vibe coder, and technically" },
  { start: 4.24, end: 8.19, text: "I still vibe code, which, wait, terrible name for what this" },
  { start: 8.33, end: 10.75, text: "actually is. But that's where I started." },
  { start: 11.21, end: 14.31, text: "I don't sit down and manually write every line of software" },
  { start: 14.39, end: 18.21, text: "I build. I work with AI, I give agents problems, I" },
  { start: 18.25, end: 21.88, text: "direct them, I inspect what they produce, I reject a lot" },
  { start: 21.89, end: 25.04, text: "of it, I change the architecture, and we build again." },
  { start: 25.56, end: 28.02, text: "But somewhere along the way, the problems changed." },
  { start: 28.44, end: 31.5, text: "I stopped asking how do I build this app, and" },
  { start: 31.56, end: 34.94, text: "started asking: How should all of these systems work together?" },
  { start: 35.44, end: 36.48, text: "Who owns the memory?" },
  { start: 36.98, end: 38.45, text: "Which agent gets access?" },
  { start: 38.89, end: 40.87, text: "How does one agent hand work to another?" },
  { start: 41.35, end: 43.49, text: "How do I know an action actually happened?" },
  { start: 43.95, end: 46.33, text: "What stops an agent from exceeding its authority?" },
  { start: 46.85, end: 48.95, text: "And what does a human need to see to remain in" },
  { start: 49.01, end: 53.72, text: "control? That last one, that's the Jedi Council problem: Who gets" },
  { start: 53.76, end: 55.34, text: "a lightsaber? Who doesn't?" },
  { start: 55.68, end: 56.64, text: "Who thinks they should?" },
  { start: 57.14, end: 60.0, text: "Anyway, those weren't vibe coding problems anymore." },
  { start: 60.54, end: 64.28, text: "They were systems problems, and solving them became Agentropolis." },
  { start: 64.76, end: 67.42, text: "My role changed too; I don't need to be the best" },
  { start: 67.48, end: 72.97, text: "Python programmer, Rust engineer, product designer, and 3D developer simultaneously." },
  { start: 73.45, end: 74.47, text: "That's not how I work." },
  { start: 74.99, end: 79.03, text: "I build teams of intelligence around the problem: one agent researches," },
  { start: 79.41, end: 83.7, text: "another implements, another reviews, another challenges the assumptions." },
  { start: 84.16, end: 86.96, text: "Hermes provides persistent agents and coordination." },
  { start: 87.44, end: 90.0, text: "Coding agents work directly against repositories." },
  { start: 90.54, end: 94.38, text: "And I stay above the system, deciding what belongs, what doesn't," },
  { start: 94.72, end: 96.62, text: "and where the architecture needs to change." },
  { start: 97.17, end: 101.41, text: "AI doesn't eliminate expertise, it changes where the human expertise has" },
  { start: 101.47, end: 104.61, text: "to be applied. This is another part of working with AI" },
  { start: 104.67, end: 105.95, text: "that doesn't get shown enough." },
  { start: 106.45, end: 110.29, text: "An agent can satisfy the requirements and still completely miss the" },
  { start: 110.45, end: 115.22, text: "idea. This version technically worked, the information was there, the interface" },
  { start: 115.3, end: 118.2, text: "rendered, the deployment worked, and I hated it." },
  { start: 118.68, end: 120.0, text: "It looked like an enterprise app." },
  { start: 120.96, end: 123.44, text: "This was the part in the movie where everybody else thinks" },
  { start: 123.46, end: 126.52, text: "the machine is working fine, and I'm yelling at the screen" },
  { start: 126.56, end: 128.47, text: "because I can already see act three." },
  { start: 129.09, end: 132.99, text: "Agentropolis wasn't supposed to feel like an enterprise dashboard, so the" },
  { start: 133.03, end: 135.71, text: "problem wasn't code, the problem was direction." },
  { start: 136.31, end: 139.79, text: "I pulled Parallax back up as the visual reference, rewrote the" },
  { start: 139.83, end: 144.14, text: "design canon, changed the acceptance criteria, and sent the system through" },
  { start: 144.16, end: 147.92, text: "another iteration. That's what directing AI actually looks like." },
  { start: 148.34, end: 150.0, text: "Generation is cheap. Judgment" },
  { start: 150.32, end: 155.13, text: "isn't. Parallax came from the same philosophy: never confuse generation with" },
  { start: 155.19, end: 158.65, text: "proof. An agent can tell me something is finished, I want" },
  { start: 158.67, end: 162.64, text: "the system to inspect the result, verify the objective, and leave" },
  { start: 162.74, end: 166.04, text: "evidence. See. Act. See again. Prove it." },
  { start: 166.54, end: 169.97, text: "That idea started with spatial environments, but it became one of" },
  { start: 170.01, end: 174.61, text: "my principles for agentic systems: generated doesn't equal verified." },
  { start: 175.03, end: 177.79, text: "You don't hand somebody the Death Star and skip asking who" },
  { start: 177.87, end: 181.28, text: "has the keys. I also didn't build this inside a research" },
  { start: 181.34, end: 184.96, text: "laboratory. There wasn't an engineering department waiting downstairs." },
  { start: 185.44, end: 186.44, text: "I'm a solo founder." },
  { start: 186.94, end: 191.44, text: "That constraint forced a different question: how much organizational capability can" },
  { start: 191.6, end: 193.38, text: "one person assemble using agents?" },
  { start: 193.86, end: 199.17, text: "Research. Architecture, code, design, documentation, testing, operations," },
  { start: 199.27, end: 204.65, text: "creative production, not by pretending I personally possess every specialization, but" },
  { start: 204.69, end: 207.47, text: "by learning how to coordinate machines that increasingly do." },
  { start: 208.19, end: 211.51, text: "At that point it was basically push it, except I was" },
  { start: 211.59, end: 214.12, text: "pushing agents across the entire architecture." },
  { start: 214.66, end: 216.58, text: "Agentropolis became the experiment." },
  { start: 217.14, end: 219.44, text: "So what do I actually call what I do now?" },
  { start: 219.96, end: 224.34, text: "Probably agentic systems architecture with a lot of creative technology mixed" },
  { start: 224.34, end: 227.81, text: "in. I work between the idea and the implementation." },
  { start: 228.37, end: 232.65, text: "I turn emerging capabilities into systems, I design agent roles and" },
  { start: 232.67, end: 236.95, text: "authority boundaries, I decide what gets delegated to machines and what" },
  { start: 237.03, end: 240.84, text: "stays under human control, then I use agents to help execute" },
  { start: 240.85, end: 245.34, text: "the architecture. I'm still learning, the technology is still changing, but" },
  { start: 245.36, end: 247.18, text: "that's also why I'm building this now." },
  { start: 247.68, end: 250.6, text: "I'm not convinced the next generation of software will look like" },
  { start: 250.62, end: 254.48, text: "today's applications. I think we're moving towards systems populated by" },
  { start: 254.54, end: 259.77, text: "persistent agents, different models, different machines, different owners, different" },
  { start: 259.81, end: 263.01, text: "levels of authority, working together across environments." },
  { start: 263.51, end: 267.11, text: "So now I've got agents talking to agents across machines, and" },
  { start: 267.19, end: 270.56, text: "I'm sitting there thinking, okay, this is starting to look less" },
  { start: 270.62, end: 272.7, text: "like an app and more like the rebel fleet." },
  { start: 273.18, end: 276.46, text: "If that's where we're going, the hard problem isn't simply making" },
  { start: 276.48, end: 280.36, text: "the agents smarter, it's designing the systems they operate inside." },
  { start: 280.8, end: 282.38, text: "That's the problem I'm interested in." },
  { start: 282.84, end: 284.38, text: "That's what I've spent this year learning how to solve." },
  { start: 284.4, end: 288.23, text: "How to build an agentropolis is my working answer, not a" },
  { start: 288.31, end: 291.85, text: "finished answer, a system that's alive enough to keep changing as" },
  { start: 291.89, end: 295.73, text: "the technology changes. I started this as a vibe coder, I" },
  { start: 295.83, end: 299.23, text: "ended up becoming an architect of agent systems, and I'm just" },
  { start: 299.27, end: 299.91, text: "getting started." },
];

export const CHAPTERS: Chapter[] = [
  { id: "open", label: "Open", start: 0.0 },
  { id: "method", label: "Method", start: 11.21 },
  { id: "systems", label: "Systems", start: 25.56 },
  { id: "lightsaber", label: "Lightsaber", start: 51.76 },
  { id: "role", label: "Role", start: 64.76 },
  { id: "tour", label: "Tour", start: 90.54 },
  { id: "shown", label: "Shown", start: 102.67 },
  { id: "parallax", label: "Parallax", start: 136.31 },
  { id: "solo", label: "Solo", start: 185.44 },
  { id: "broadcast", label: "33.3 FM", start: 203.32 },
  { id: "architect", label: "Architect", start: 217.14 },
  { id: "fleet", label: "Fleet", start: 267.62 },
  { id: "answer", label: "Answer", start: 285.34 },
];

export function shotAt(t: number): Shot {
  const s = SHOTS.find((x) => t >= x.start && t < x.end);
  return s ?? SHOTS[SHOTS.length - 1]!;
}

export function captionAt(t: number): Caption | null {
  const s = shotAt(t);
  if (s.kind === "black" || s.kind === "title") return null;
  return CAPTIONS.find((c) => t >= c.start && t < c.end) ?? null;
}

export function chapterAt(t: number): Chapter {
  let cur = CHAPTERS[0]!;
  for (const c of CHAPTERS) {
    if (t >= c.start) cur = c;
  }
  return cur;
}

export function formatTimecode(t: number): string {
  const x = Math.max(0, t);
  const m = Math.floor(x / 60);
  const s = Math.floor(x % 60);
  const f = Math.floor((x % 1) * 24);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
}

export function chapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}
