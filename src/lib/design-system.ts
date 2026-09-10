/** Canonical AGENTROPOLIS Intelligence Grid design system.
 *  The application consumes these contracts. It does not redefine them. */

export const GRID_COLORS = {
  obsidian: "#05070A",
  cyan: "#19E6E6",
  red: "#FF2A2A",
} as const;

export const CORRIDOR = [
  "IDENTITY",
  "MANDATE",
  "PLAN",
  "POLICY",
  "EXECUTE",
  "RECEIPT",
  "AUDIT",
] as const;

export type CorridorStep = (typeof CORRIDOR)[number];

export const COMPUTE_WEIGHTS = ["full", "adaptive", "lite", "minimum"] as const;
export type ComputeWeight = (typeof COMPUTE_WEIGHTS)[number];

export const COMPUTE_LABEL: Record<ComputeWeight, string> = {
  full: "FULL",
  adaptive: "ADAPT",
  lite: "LITE",
  minimum: "MIN",
};

export const COMPUTE_NOTE: Record<ComputeWeight, string> = {
  full: "Compute · visuals · models · information — full density. Same authority.",
  adaptive: "Compute · visuals · models · information — reduced together.",
  lite: "Compute · visuals · models · information — lightweight together.",
  minimum: "Compute · visuals · models · information — essential meaning. Same authority.",
};

/** Four axes drop together. Never quantize one and leave the others fat. */
export const QUANTIZE_AXES = ["compute", "visuals", "models", "information"] as const;
export type QuantizeAxis = (typeof QUANTIZE_AXES)[number];

export const QUANTIZE_LAW =
  "AGENTROPOLIS quantizes compute, visuals, models, and information density together.";

export type ModelProfile = "LOCAL" | "REMOTE" | "EDGE" | "HIGH COMPUTE" | "FALLBACK" | "UNAVAILABLE";

export const MODEL_FOR_WEIGHT: Record<ComputeWeight, ModelProfile> = {
  full: "HIGH COMPUTE",
  adaptive: "REMOTE",
  lite: "EDGE",
  minimum: "FALLBACK",
};

export const HIERARCHY = ["GRID", "DISTRICT", "BUILDING", "AGENT", "TASK", "EXECUTION", "RECEIPT"] as const;
export type HierarchyLevel = (typeof HIERARCHY)[number];

export type AgentRuntimeState =
  | "IDLE"
  | "PLANNING"
  | "EXECUTING"
  | "WAITING"
  | "TOOL RUNNING"
  | "HANDOFF"
  | "COMPLETE"
  | "FAILED"
  | "QUARANTINED";

export type SandboxBound =
  | "FILESYSTEM ALLOWED"
  | "FILESYSTEM DENIED"
  | "NETWORK ALLOWED"
  | "NETWORK DENIED"
  | "TOOL APPROVED"
  | "TOOL BLOCKED"
  | "PRODUCTION LOCKED"
  | "APPROVAL REQUIRED";

export type RuntimeSurface = "HERMES" | "NEMOCLAW" | "NEMOTRON";

export type GateKind = "path" | "barrier" | "approval" | "locked" | "receipt";

export type ResponseSceneKind =
  | "EXPLAIN"
  | "COMPARE"
  | "RISK"
  | "DECISION"
  | "AUDIT"
  | "AGENT STATUS"
  | "RESEARCH"
  | "COMMERCE"
  | "SIMULATION"
  | "SYSTEM MAP"
  | "THREAT MAP"
  | "TREASURY FLOW";

export const GATE_COPY: Record<GateKind, string> = {
  path: "Authorized movement",
  barrier: "Blocked or denied",
  approval: "Human approval required",
  locked: "Capability unavailable",
  receipt: "Verified execution evidence",
};

/** Map existing roster verbs onto canonical runtime states. Representation only. */
export function agentStateOf(status: string): AgentRuntimeState {
  switch (status) {
    case "directing":
      return "PLANNING";
    case "active":
    case "on-air":
      return "EXECUTING";
    case "gated":
      return "WAITING";
    case "idle":
    default:
      return "IDLE";
  }
}

export function gateForAgent(status: string): GateKind {
  if (status === "gated") return "approval";
  if (status === "idle") return "locked";
  return "path";
}

export function gateForStatus(status: string): GateKind {
  switch (status) {
    case "LIVE":
      return "path";
    case "AVAILABLE":
    case "PREVIEW":
      return "receipt";
    case "OFFLINE":
    case "MISSING":
      return "barrier";
    case "PLANNED":
      return "locked";
    default:
      return "locked";
  }
}
