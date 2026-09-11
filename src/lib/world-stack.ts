/** Canonical World Stack. Layers are not interchangeable. */

export type StackLayer = "orbit" | "atlas" | "grid" | "city" | "worldq";

export const STACK_LAYERS: {
  id: StackLayer;
  mark: string;
  name: string;
  line: string;
  knows: string;
}[] = [
  { id: "orbit", mark: "01", name: "ORBITAL INTELLIGENCE", line: "See what moves above us.", knows: "satellites · constellations · launch · space weather" },
  { id: "atlas", mark: "02", name: "ATLAS", line: "Know where.", knows: "earth · geography · routes · spatial provenance" },
  { id: "grid", mark: "03", name: "WORLD GRID", line: "Know who governs there.", knows: "jurisdictions · agencies · treaties · policy domains" },
  { id: "city", mark: "04", name: "AGENTROPOLIS WORLD", line: "See what is happening inside the city-state.", knows: "districts · buildings · agents · civic state" },
  { id: "worldq", mark: "05", name: "WORLDQ", line: "Stream and reconstruct the world at the fidelity required.", knows: "LOD · streaming · reconstruction · spatial packaging" },
];

export const STACK_BY_ID = Object.fromEntries(STACK_LAYERS.map((l) => [l.id, l])) as Record<StackLayer, (typeof STACK_LAYERS)[number]>;

export const STACK_INTRO = "FROM CITY STREETS TO ORBITAL SPACE";
export const STACK_SECONDARY = "AGENTROPOLIS is being built as one connected intelligence civilization.";
export const STACK_RAIL: { id: StackLayer; label: string }[] = [
  { id: "orbit", label: "ORBIT" },
  { id: "atlas", label: "GLOBE" },
  { id: "grid", label: "GOVERNANCE" },
  { id: "city", label: "CITY" },
  { id: "worldq", label: "WORLDQ" },
];

export type StackMeta = {
  source: string;
  observed_at: string;
  retrieved_at: string;
  expires_at: string;
  confidence: "low" | "medium" | "high";
  precision: string;
  provider: string;
  provider_status: "DEMO" | "SIMULATED";
  is_estimated: true;
};

const META: StackMeta = {
  source: "AGENTROPOLIS World Stack prototype",
  observed_at: "2026-09-10T00:00:00Z",
  retrieved_at: "2026-09-10T00:00:00Z",
  expires_at: "2026-09-10T06:00:00Z",
  confidence: "low",
  precision: "regional",
  provider: "NEURO BUILDS · DEMO",
  provider_status: "DEMO",
  is_estimated: true,
};

export function stackMeta(): StackMeta {
  return META;
}

export type StackRegion = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  kind: "region" | "city";
  note: string;
};

export const STACK_REGIONS: StackRegion[] = [
  { id: "americas", name: "Americas", lat: 15, lon: -90, kind: "region", note: "SIMULATED region. ATLAS read plane." },
  { id: "emea", name: "Eurasia", lat: 48, lon: 20, kind: "region", note: "SIMULATED region. ATLAS read plane." },
  { id: "africa", name: "Africa", lat: 2, lon: 22, kind: "region", note: "SIMULATED region. ATLAS read plane." },
  { id: "apac", name: "APAC", lat: 18, lon: 110, kind: "region", note: "SIMULATED region. ATLAS read plane." },
  {
    id: "agentropolis",
    name: "AGENTROPOLIS",
    lat: 38.58,
    lon: -121.49,
    kind: "city",
    note: "City-state pin. Descent enters the existing AGENTROPOLIS world.",
  },
];

export type GovNode = {
  id: string;
  regionId: string;
  name: string;
  kind: string;
  lat: number;
  lon: number;
};

export const STACK_GOV: GovNode[] = [
  { id: "gov-us", regionId: "americas", name: "Modeled US civic", kind: "sovereign", lat: 38.9, lon: -77 },
  { id: "gov-ca", regionId: "americas", name: "Modeled CA jurisdiction", kind: "state", lat: 38.58, lon: -121.49 },
  { id: "gov-eu", regionId: "emea", name: "Modeled EU policy domain", kind: "bloc", lat: 50.8, lon: 4.3 },
  { id: "gov-un", regionId: "emea", name: "Modeled treaty desk", kind: "treaty", lat: 46.2, lon: 6.1 },
  { id: "gov-au", regionId: "africa", name: "Modeled AU desk", kind: "bloc", lat: 9.0, lon: 38.7 },
  { id: "gov-asean", regionId: "apac", name: "Modeled ASEAN desk", kind: "bloc", lat: 1.3, lon: 103.8 },
];

export type SatNode = {
  id: string;
  name: string;
  plane: number;
  phase: number;
  alt: number;
};

export const STACK_SATS: SatNode[] = [
  { id: "sat-01", name: "Constellation A", plane: 0, phase: 0.0, alt: 2.35 },
  { id: "sat-02", name: "Constellation A", plane: 0, phase: 0.25, alt: 2.35 },
  { id: "sat-03", name: "Constellation A", plane: 0, phase: 0.5, alt: 2.35 },
  { id: "sat-04", name: "Constellation A", plane: 0, phase: 0.75, alt: 2.35 },
  { id: "sat-05", name: "Constellation B", plane: 1, phase: 0.08, alt: 2.62 },
  { id: "sat-06", name: "Constellation B", plane: 1, phase: 0.33, alt: 2.62 },
  { id: "sat-07", name: "Constellation B", plane: 1, phase: 0.58, alt: 2.62 },
  { id: "sat-08", name: "Constellation B", plane: 1, phase: 0.83, alt: 2.62 },
  { id: "sat-09", name: "Relay C", plane: 2, phase: 0.12, alt: 2.9 },
  { id: "sat-10", name: "Relay C", plane: 2, phase: 0.45, alt: 2.9 },
  { id: "sat-11", name: "Relay C", plane: 2, phase: 0.7, alt: 2.9 },
  { id: "sat-12", name: "Weather desk", plane: 2, phase: 0.92, alt: 3.15 },
];

export const STACK_CAM: Record<StackLayer, { pos: [number, number, number]; look: [number, number, number]; fov: number }> = {
  orbit: { pos: [0.2, 1.6, 8.8], look: [0, 0, 0], fov: 42 },
  atlas: { pos: [2.4, 1.5, 5.2], look: [0, 0, 0], fov: 38 },
  grid: { pos: [1.15, 0.85, 3.4], look: [0.35, 0.15, 0.05], fov: 36 },
  city: { pos: [0.62, 0.42, 2.05], look: [0.38, 0.18, 0.02], fov: 32 },
  worldq: { pos: [0.15, -2.05, 2.6], look: [0, -0.35, 0], fov: 40 },
};

export const EARTH_R = 1.62;

export function latLonToVec(lat: number, lon: number, r = EARTH_R): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
}

export function layerIndex(id: StackLayer) {
  return STACK_LAYERS.findIndex((l) => l.id === id);
}

export function layerByIndex(i: number): StackLayer {
  const n = STACK_LAYERS.length;
  const k = ((i % n) + n) % n;
  return STACK_LAYERS[k]!.id;
}
