export type AtralClass =
  | "identity"
  | "intent"
  | "authority"
  | "mandate"
  | "capability"
  | "evidence"
  | "receipt"
  | "protocol";

export type ProtocolStep = {
  id: string;
  districtId: string;
  mark: string;
  title: string;
  kicker: string;
  body: string;
  screen: string;
  glyph: AtralClass;
  fields: string[];
  chapterId: string;
};

export const ATG_TITLE = "ATG";
export const ATG_NAME = "AGENT TRANSACTION GRAMMAR";
export const ATG_SUBTITLE = "THE SEMANTIC CONTRACT LAYER FOR AUTONOMOUS AGENTS";
export const ATG_THESIS =
  "MCP gives access. ATG gives access meaning, limits, and proof.";
export const ATG_HERO =
  "MCP gives agents tools. ATG tells those tools what the agent is allowed to do, under what mandate, with what evidence, and what proof must come back.";

export const ATG_STACK = [
  {
    id: "grid",
    name: "AGENTROPOLIS",
    role: "The Intelligence Grid.",
  },
  {
    id: "atg",
    name: "ATG",
    role: "Agent Transaction Grammar. The open protocol. The semantic contract layer.",
  },
  {
    id: "atranic",
    name: "ATRANIC",
    role: "The semantic agent language carried inside ATG messages.",
  },
  {
    id: "atral",
    name: "ATRAL SCRIPT",
    role: "The visual glyph layer for Atranic. Machine identity and intent, not decoration.",
  },
  {
    id: "atralith",
    name: "ATRALITH",
    role: "The reference Agent Kit that implements ATG.",
  },
  {
    id: "mcp",
    name: "AGENTROPOLIS MCP",
    role: "The governed execution layer. Access with authority. Execution with proof.",
  },
] as const;

export const ATG_WHY = [
  "identity",
  "authority",
  "capabilities",
  "mandates",
  "scope",
  "deadlines",
  "cost",
  "evidence",
  "receipts",
  "reputation",
  "settlement",
  "failure boundaries",
  "interoperability",
] as const;

export const ATG_QUESTIONS = [
  "WHO is acting",
  "WHAT capability is being requested",
  "WHY the action is authorized",
  "WHAT the mandate permits",
  "WHAT limits apply",
  "WHAT proof is required",
  "WHAT happened",
  "WHAT evidence exists",
  "WHO verified it",
  "WHAT receipt was produced",
] as const;

export const ATG_WHY_BODY =
  "The agent internet needs a contract layer. Different agents, runtimes, MCP servers, tools, models, and organizations can all speak technically while meaning different things by authority, scope, completion, proof, cost, failure, identity, and receipt. ATG exists to make those exchanges machine-readable. Interoperability, not branding.";

export const ATRANIC_CYCLE = [
  { phase: "DECLARE", fields: ["capability_declaration", "mandate"] },
  { phase: "NEGOTIATE", fields: ["offer", "acceptance"] },
  { phase: "EXECUTE", fields: ["status", "result", "receipt"] },
] as const;

export const ATRANIC_FIELDS = [
  "capability_declaration",
  "mandate",
  "offer",
  "acceptance",
  "status",
  "result",
  "receipt",
] as const;

export const ATRAL_CLASSES: { id: AtralClass; label: string; meaning: string }[] = [
  { id: "identity", label: "IDENTITY", meaning: "Who is acting." },
  { id: "intent", label: "INTENT", meaning: "What they mean to do." },
  { id: "authority", label: "AUTHORITY", meaning: "What they are allowed to do." },
  { id: "mandate", label: "MANDATE", meaning: "The compiled contract." },
  { id: "capability", label: "CAPABILITY", meaning: "The requested ability." },
  { id: "evidence", label: "EVIDENCE", meaning: "What proves the result." },
  { id: "receipt", label: "RECEIPT", meaning: "What survives after execution." },
  { id: "protocol", label: "PROTOCOL", meaning: "The grammar itself." },
];

export const ATRALITH_KIT = [
  "MCP server",
  "TypeScript SDK",
  "Python SDK",
  "validator",
  "mandate builder",
  "receipt engine",
  "CLI",
  "ecosystem adapters",
] as const;

export const ATRALITH_LINE =
  "ATG defines how agents communicate. ATRANIC defines what the messages mean. ATRALITH implements the standard. MCP executes the governed action.";

export const MCP_TITLE = "AGENTROPOLIS MCP";
export const MCP_SUBTITLE = "GOVERNED EXECUTION FOR AUTONOMOUS AGENTS";
export const MCP_ASK =
  "Most MCP demos answer: can the model call the tool? AGENTROPOLIS asks: should this agent call this tool, under this mandate, with this authority, and can we prove what happened afterward?";
export const MCP_FLOW = ["DISCOVER", "DECLARE", "AUTHORIZE", "EXECUTE", "VERIFY", "RECEIPT"] as const;
export const MCP_CLOSE = [
  "An MCP server can give an agent access.",
  "Access is easy. Authority is harder.",
  "AGENTROPOLIS MCP puts governed execution between intent and action.",
] as const;
export const MCP_FINAL = "ACCESS WITH AUTHORITY. EXECUTION WITH PROOF.";

export const AGENT_ECONOMY = [
  { id: "earn", name: "EARN", body: "Complete paid mandates." },
  { id: "protect", name: "PROTECT", body: "Reduce security, governance, and execution risk." },
  { id: "prove", name: "PROVE", body: "Issue receipts that build portable reputation." },
  { id: "settle", name: "SETTLE", body: "Bind payment to verified results and policy gates." },
] as const;

export const ATG_STANDARD = [
  "open protocol",
  "transport-independent",
  "implementation-neutral",
  "receipt-driven",
] as const;

export const ATG_CTAS = [
  { id: "build", label: "BUILD AGAINST ATG", action: "atg" as const },
  { id: "implement", label: "IMPLEMENT WITH ATRALITH", action: "atg" as const },
  { id: "execute", label: "EXECUTE WITH AGENTROPOLIS MCP", action: "mcp" as const },
] as const;

export const ATG_SECONDARY = [
  { id: "grid", label: "ENTER THE GRID", action: "city" as const },
  { id: "inspect", label: "INSPECT THE PROTOCOL", action: "protocol" as const },
  { id: "mandate", label: "RUN A MANDATE", action: "protocol" as const },
  { id: "receipt", label: "VIEW A RECEIPT", action: "parallax" as const },
] as const;

/** Protocol journey through existing city geography. Not a new map. */
export const PROTOCOL_RUNS: ProtocolStep[] = [
  {
    id: "intent",
    districtId: "mission",
    mark: "Intent",
    title: "Human intent",
    kicker: "Mission Control",
    body: "An agent receives human intent. The architect stays above the system. Nothing silent gets through.",
    screen: "Agents can already call tools. That is not the hard part.",
    glyph: "intent",
    fields: ["principal", "objective"],
    chapterId: "open",
  },
  {
    id: "mandate",
    districtId: "atg",
    mark: "Mandate",
    title: "ATG compiles the contract",
    kicker: "Agent Transaction Grammar",
    body: "ATG is the open protocol. It names who is acting, what capability is requested, why it is authorized, what the mandate permits, and what proof must come back.",
    screen: "Who is acting? What are they allowed to do?",
    glyph: "mandate",
    fields: ["principal", "capability", "mandate", "scope", "deadline", "cost"],
    chapterId: "systems",
  },
  {
    id: "atranic",
    districtId: "hermes",
    mark: "Meaning",
    title: "Atranic carries the meaning",
    kicker: "HERMES Exchange",
    body: "Atranic is the semantic language inside ATG messages. HERMES carries them. DECLARE, then NEGOTIATE, then EXECUTE. The path is a protocol journey, not arbitrary animation.",
    screen: "capability_declaration. mandate. offer. acceptance. status. result. receipt.",
    glyph: "protocol",
    fields: ["capability_declaration", "mandate", "offer", "acceptance"],
    chapterId: "tour",
  },
  {
    id: "kit",
    districtId: "construct",
    mark: "Kit",
    title: "ATRALITH implements the standard",
    kicker: "Reference Agent Kit",
    body: "ATG defines the rules. ATRALITH provides the machinery: MCP server, TypeScript SDK, Python SDK, validator, mandate builder, receipt engine, CLI, adapters. The first build is not the city.",
    screen: "ATG defines how agents communicate. ATRALITH implements the standard.",
    glyph: "capability",
    fields: ["validator", "mandate_builder", "receipt_engine"],
    chapterId: "solo",
  },
  {
    id: "gate",
    districtId: "aegis",
    mark: "Gate",
    title: "Access is not authority",
    kicker: "AEGIS",
    body: "The tool pauses here. AEGIS evaluates the mandate, the authority, the limits. Read access never implies execute. Lightsaber not issued.",
    screen: "But access is not authority.",
    glyph: "authority",
    fields: ["authority", "policy", "deny"],
    chapterId: "lightsaber",
  },
  {
    id: "execute",
    districtId: "jspace",
    mark: "Execute",
    title: "Governed MCP execution",
    kicker: "AGENTROPOLIS MCP",
    body: "Should this agent call this tool, under this mandate, with this authority? AGENTROPOLIS MCP puts governed execution between intent and action. No live tool endpoint is wired into this floor.",
    screen: "Access is easy. Authority is harder.",
    glyph: "capability",
    fields: ["discover", "declare", "authorize", "execute"],
    chapterId: "systems",
  },
  {
    id: "verify",
    districtId: "sentinel",
    mark: "Evidence",
    title: "SENTINEL-6 verifies",
    kicker: "Independent review",
    body: "What evidence proves the result? SENTINEL-6 watches the miss. An agent can satisfy the requirements and still miss the idea. Generated does not equal verified.",
    screen: "What evidence proves the result?",
    glyph: "evidence",
    fields: ["evidence", "verifier", "verdict"],
    chapterId: "shown",
  },
  {
    id: "receipt",
    districtId: "parallax",
    mark: "Receipt",
    title: "What survives after execution",
    kicker: "Audit Archive",
    body: "The receipt enters the record. Result, evidence, authorization path, economic accounting. See. Act. See again. Prove it.",
    screen: "What survives after execution?",
    glyph: "receipt",
    fields: ["result", "evidence", "receipt", "audit"],
    chapterId: "parallax",
  },
];

export const PROTOCOL_TRAIL = PROTOCOL_RUNS.map((s) => s.districtId);

export const PROTOCOL_FINAL = {
  title: "ATG",
  dek: "OPEN AGENT TRANSACTION GRAMMAR",
  marks: ["IDENTITY", "MANDATE", "AUTHORITY", "EVIDENCE", "RECEIPTS"],
  line: "Build against ATG. Implement it with ATRALITH. Execute through governed MCP.",
} as const;

export function protocolStepAt(index: number) {
  const i = Math.max(0, Math.min(PROTOCOL_RUNS.length - 1, index));
  return { index: i, step: PROTOCOL_RUNS[i]! };
}

export function protocolIndexForDistrict(id: string) {
  const i = PROTOCOL_RUNS.findIndex((s) => s.districtId === id);
  return i >= 0 ? i : null;
}
