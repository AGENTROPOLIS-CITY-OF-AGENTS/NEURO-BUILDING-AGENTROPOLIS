import type { ComputeWeight, ResponseSceneKind } from "@/lib/design-system";

/** Optional spatial capabilities. None of these ship a dataset or a model. */
export type SpatialCapability =
  | "webgl"
  | "webgpu"
  | "splat"
  | "photogrammetry"
  | "procedural"
  | "cinematic";

export const SPATIAL_STATUS: Record<SpatialCapability, { bundled: boolean; note: string }> = {
  webgl: { bundled: true, note: "Default city / campus / street worlds. Lazy-loaded." },
  webgpu: { bundled: false, note: "Capability. Not required for this floor." },
  splat: { bundled: false, note: "3DGS is optional. Not in the publish bundle." },
  photogrammetry: { bundled: false, note: "Generative reconstruction is a runtime, not a page." },
  procedural: { bundled: true, note: "Existing district geometry. No extra payload." },
  cinematic: { bundled: true, note: "Film stills already on disk. No new media." },
};

export type SpatialLayer = "html" | "webgl" | "webgpu" | "none";

export function spatialLayerFor(weight: ComputeWeight): SpatialLayer {
  if (weight === "minimum") return "html";
  if (weight === "lite" || weight === "adaptive" || weight === "full") return "webgl";
  return "html";
}

export type ResponsePayload = {
  kind: ResponseSceneKind;
  title: string;
  claim: string;
  evidence: string[];
};

/** Map a district/agent event to a response scene. Never visualizes hidden reasoning. */
export function sceneFor(input: {
  status: string;
  gated?: boolean;
  failed?: boolean;
}): ResponseSceneKind {
  if (input.failed) return "RISK";
  if (input.gated) return "DECISION";
  if (input.status === "OFFLINE" || input.status === "MISSING") return "THREAT MAP";
  if (input.status === "LIVE") return "AGENT STATUS";
  return "SYSTEM MAP";
}
