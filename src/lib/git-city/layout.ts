/**
 * Seeded plan for the World Forge spatial slice.
 * Pure data: this module must not import three, React, or a renderer.
 * Origins are keyed by district id. Adding a district means adding a row.
 * Sorting ids is not the layout.
 */

export const LAYOUT_SEED = "world-forge-spatial-v1";

export const ROAD = {
  halfX: 16,
  halfZ: 20,
  width: 6,
  sidewalk: 2.6,
  setback: 1.2,
} as const;

/** Street-facing wall line, outside the outer sidewalk. */
export const FACE_X = ROAD.halfX + ROAD.width / 2 + ROAD.sidewalk + ROAD.setback;
export const FACE_Z = ROAD.halfZ + ROAD.width / 2 + ROAD.sidewalk + ROAD.setback;

export const FLOOR_H = 0.92;
export const LOBBY_H = 2.55;

export type Face = "n" | "s" | "e" | "w";
export type Accent = "cyan" | "red";
export type Silhouette = "spire" | "crown" | "crane" | "bunker" | "fins" | "mast" | "step" | "slab";

export type Footprint = {
  id: string;
  code: string;
  x: number;
  z: number;
  /** World X extent. */
  w: number;
  /** World Z extent. */
  d: number;
  floors: number;
  accent: Accent;
  silhouette: Silhouette;
  doorFace: Face;
};

export type Slab = {
  id: string;
  kind: "road" | "sidewalk" | "plaza" | "lane";
  x: number;
  z: number;
  w: number;
  d: number;
  accent?: Accent;
};

export type Opening = {
  id: string;
  buildingId: string;
  face: Face;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  depth: number;
};

export type CityLayout = {
  seed: string;
  roads: Slab[];
  sidewalks: Slab[];
  plaza: Slab;
  lanes: Slab[];
  buildings: Footprint[];
  originById: Record<string, { x: number; z: number }>;
};

type Pin = {
  id: string;
  code: string;
  /** Position along the street (x for north/south, z for east/west). */
  along: number;
  /** Extent parallel to the street. */
  front: number;
  /** Extent perpendicular to the street. */
  depth: number;
  accent: Accent;
  floors?: number;
  silhouette?: Silhouette;
};

const NORTH: Pin[] = [
  { id: "jspace", code: "JS", along: -17.6, front: 4.6, depth: 6, accent: "cyan" },
  { id: "hermes", code: "HX", along: -10.6, front: 5.6, depth: 6.2, accent: "cyan", floors: 14, silhouette: "crown" },
  { id: "mission", code: "MC", along: 0, front: 6.6, depth: 6.4, accent: "cyan", floors: 18, silhouette: "spire" },
  { id: "buzz", code: "BZ", along: 7.4, front: 4.6, depth: 5.8, accent: "red" },
  { id: "construct", code: "CT", along: 13.2, front: 5, depth: 6, accent: "cyan" },
  { id: "dock", code: "DK", along: 19, front: 4.8, depth: 6.2, accent: "cyan", floors: 9, silhouette: "crane" },
];

const SOUTH: Pin[] = [
  { id: "street", code: "MS", along: -18, front: 4.4, depth: 5.6, accent: "cyan" },
  { id: "utility", code: "UT", along: -12, front: 4.4, depth: 5.6, accent: "cyan" },
  { id: "identity", code: "ID", along: -6, front: 4.4, depth: 5.4, accent: "red" },
  { id: "fm", code: "FM", along: 0, front: 4.6, depth: 5.6, accent: "cyan" },
  { id: "film", code: "FL", along: 6, front: 4.4, depth: 5.4, accent: "red" },
  { id: "civic", code: "CV", along: 12, front: 4.4, depth: 5.6, accent: "cyan" },
  { id: "atv", code: "TV", along: 18, front: 4.4, depth: 5.4, accent: "red" },
];

const EAST: Pin[] = [
  { id: "sentinel", code: "S6", along: -15, front: 5.2, depth: 5.2, accent: "red", floors: 12, silhouette: "mast" },
  { id: "t54", code: "54", along: -5, front: 4.8, depth: 5.2, accent: "cyan" },
  { id: "atlas", code: "AT", along: 5, front: 5, depth: 5.2, accent: "cyan" },
  { id: "aegis", code: "AG", along: 15.5, front: 6.6, depth: 5.4, accent: "red", floors: 4, silhouette: "bunker" },
];

const WEST: Pin[] = [
  { id: "atg", code: "ATG", along: -15, front: 5, depth: 5.2, accent: "red" },
  { id: "parallax", code: "PX", along: -5, front: 4.8, depth: 5.2, accent: "cyan" },
  { id: "asimov", code: "AS", along: 5, front: 5, depth: 5.2, accent: "red" },
  { id: "holofoil", code: "HF", along: 15.5, front: 6.2, depth: 5.4, accent: "cyan", floors: 11, silhouette: "fins" },
];

export function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function floorsFor(pin: Pin): number {
  if (pin.floors) return pin.floors;
  return 6 + (hashId(pin.id) % 7);
}

function silhouetteFor(pin: Pin): Silhouette {
  if (pin.silhouette) return pin.silhouette;
  return hashId(pin.id) % 2 === 0 ? "step" : "slab";
}

function fromNorth(pin: Pin): Footprint {
  return {
    id: pin.id,
    code: pin.code,
    x: pin.along,
    z: -(FACE_Z + pin.depth / 2),
    w: pin.front,
    d: pin.depth,
    floors: floorsFor(pin),
    accent: pin.accent,
    silhouette: silhouetteFor(pin),
    doorFace: "s",
  };
}

function fromSouth(pin: Pin): Footprint {
  return {
    id: pin.id,
    code: pin.code,
    x: pin.along,
    z: FACE_Z + pin.depth / 2,
    w: pin.front,
    d: pin.depth,
    floors: floorsFor(pin),
    accent: pin.accent,
    silhouette: silhouetteFor(pin),
    doorFace: "n",
  };
}

function fromEast(pin: Pin): Footprint {
  return {
    id: pin.id,
    code: pin.code,
    x: FACE_X + pin.depth / 2,
    z: pin.along,
    w: pin.depth,
    d: pin.front,
    floors: floorsFor(pin),
    accent: pin.accent,
    silhouette: silhouetteFor(pin),
    doorFace: "w",
  };
}

function fromWest(pin: Pin): Footprint {
  return {
    id: pin.id,
    code: pin.code,
    x: -(FACE_X + pin.depth / 2),
    z: pin.along,
    w: pin.depth,
    d: pin.front,
    floors: floorsFor(pin),
    accent: pin.accent,
    silhouette: silhouetteFor(pin),
    doorFace: "e",
  };
}

export function wallHeight(building: Footprint): number {
  return LOBBY_H + building.floors * FLOOR_H;
}

function loopSlabs(): { roads: Slab[]; sidewalks: Slab[] } {
  const outerX = ROAD.halfX + ROAD.width / 2;
  const outerZ = ROAD.halfZ + ROAD.width / 2;
  const innerZ = ROAD.halfZ - ROAD.width / 2;
  const roadSpanX = outerX * 2;
  const roadSpanZ = innerZ * 2;
  const walkOuterX = outerX + ROAD.sidewalk;
  const walkOuterZ = outerZ + ROAD.sidewalk;
  const sw = ROAD.sidewalk;

  const roads: Slab[] = [
    { id: "road-n", kind: "road", x: 0, z: -ROAD.halfZ, w: roadSpanX, d: ROAD.width },
    { id: "road-s", kind: "road", x: 0, z: ROAD.halfZ, w: roadSpanX, d: ROAD.width },
    { id: "road-e", kind: "road", x: ROAD.halfX, z: 0, w: ROAD.width, d: roadSpanZ },
    { id: "road-w", kind: "road", x: -ROAD.halfX, z: 0, w: ROAD.width, d: roadSpanZ },
  ];

  const sidewalks: Slab[] = [
    { id: "walk-n", kind: "sidewalk", x: 0, z: -(outerZ + sw / 2), w: walkOuterX * 2, d: sw },
    { id: "walk-s", kind: "sidewalk", x: 0, z: outerZ + sw / 2, w: walkOuterX * 2, d: sw },
    { id: "walk-e", kind: "sidewalk", x: outerX + sw / 2, z: 0, w: sw, d: walkOuterZ * 2 },
    { id: "walk-w", kind: "sidewalk", x: -(outerX + sw / 2), z: 0, w: sw, d: walkOuterZ * 2 },
  ];

  return { roads, sidewalks };
}

function lanes(): Slab[] {
  const spanX = ROAD.halfX * 2 - 4;
  const spanZ = (ROAD.halfZ - ROAD.width / 2) * 2 - 2;
  const shift = 0.42;
  return [
    { id: "lane-n-c", kind: "lane", x: 0, z: -ROAD.halfZ - shift, w: spanX, d: 0.08, accent: "cyan" },
    { id: "lane-n-r", kind: "lane", x: 0, z: -ROAD.halfZ + shift, w: spanX, d: 0.08, accent: "red" },
    { id: "lane-s-c", kind: "lane", x: 0, z: ROAD.halfZ - shift, w: spanX, d: 0.08, accent: "cyan" },
    { id: "lane-s-r", kind: "lane", x: 0, z: ROAD.halfZ + shift, w: spanX, d: 0.08, accent: "red" },
    { id: "lane-e-c", kind: "lane", x: ROAD.halfX - shift, z: 0, w: 0.08, d: spanZ, accent: "cyan" },
    { id: "lane-e-r", kind: "lane", x: ROAD.halfX + shift, z: 0, w: 0.08, d: spanZ, accent: "red" },
    { id: "lane-w-c", kind: "lane", x: -ROAD.halfX + shift, z: 0, w: 0.08, d: spanZ, accent: "cyan" },
    { id: "lane-w-r", kind: "lane", x: -ROAD.halfX - shift, z: 0, w: 0.08, d: spanZ, accent: "red" },
  ];
}

export function buildLayout(): CityLayout {
  const buildings = [
    ...NORTH.map(fromNorth),
    ...EAST.map(fromEast),
    ...SOUTH.map(fromSouth),
    ...WEST.map(fromWest),
  ];
  const originById: CityLayout["originById"] = {};
  for (const building of buildings) originById[building.id] = { x: building.x, z: building.z };
  const { roads, sidewalks } = loopSlabs();
  const innerX = ROAD.halfX - ROAD.width / 2;
  const innerZ = ROAD.halfZ - ROAD.width / 2;
  return {
    seed: LAYOUT_SEED,
    roads,
    sidewalks,
    plaza: {
      id: "plaza",
      kind: "plaza",
      x: 0,
      z: 0,
      w: innerX * 2 - 3,
      d: innerZ * 2 - 3,
    },
    lanes: lanes(),
    buildings,
    originById,
  };
}

function facePoint(building: Footprint, face: Face, along: number, y: number, out: number) {
  switch (face) {
    case "s":
      return { x: building.x + along, y, z: building.z + building.d / 2 + out };
    case "n":
      return { x: building.x + along, y, z: building.z - building.d / 2 - out };
    case "e":
      return { x: building.x + building.w / 2 + out, y, z: building.z + along };
    case "w":
      return { x: building.x - building.w / 2 - out, y, z: building.z + along };
  }
}

export function doorOf(building: Footprint): Opening {
  const h = 2.3;
  const w = Math.min(1.28, (building.doorFace === "n" || building.doorFace === "s" ? building.w : building.d) * 0.34);
  const point = facePoint(building, building.doorFace, 0, h / 2, 0.07);
  return {
    id: `${building.id}-door`,
    buildingId: building.id,
    face: building.doorFace,
    x: point.x,
    y: point.y,
    z: point.z,
    w,
    h,
    depth: 0.16,
  };
}

function intervalsOverlap(a0: number, a1: number, b0: number, b1: number): boolean {
  return Math.min(a1, b1) - Math.max(a0, b0) > 0.02;
}

function adjacentFaces(face: Face): Face[] {
  if (face === "n" || face === "s") return ["e", "w"];
  return ["n", "s"];
}

/** Window bays are openings on the wall, not a texture stretched over the mass. */
export function windowBays(building: Footprint, cols: number, sides: boolean): Opening[] {
  const safeCols = Math.max(1, Math.floor(cols));
  const faces: Face[] = [building.doorFace];
  if (sides) faces.push(...adjacentFaces(building.doorFace));
  const door = doorOf(building);
  const bays: Opening[] = [];
  const bh = 0.62;
  for (const face of faces) {
    const span = face === "n" || face === "s" ? building.w : building.d;
    const margin = 0.42;
    const usable = Math.max(0.8, span - margin * 2);
    const cell = usable / safeCols;
    const bw = Math.min(0.7, cell * 0.62);
    for (let row = 0; row < building.floors; row++) {
      const y = LOBBY_H + 0.18 + row * FLOOR_H;
      for (let col = 0; col < safeCols; col++) {
        const along = -usable / 2 + cell * (col + 0.5);
        const point = facePoint(building, face, along, y, 0.09);
        if (face === door.face) {
          const vertical = intervalsOverlap(y - bh / 2, y + bh / 2, door.y - door.h / 2, door.y + door.h / 2);
          const horizontal = intervalsOverlap(along - bw / 2, along + bw / 2, -door.w / 2, door.w / 2);
          if (vertical && horizontal) continue;
        }
        bays.push({
          id: `${building.id}-${face}-${row}-${col}`,
          buildingId: building.id,
          face,
          x: point.x,
          y: point.y,
          z: point.z,
          w: bw,
          h: bh,
          depth: 0.08,
        });
      }
    }
  }
  return bays;
}

export function aabbOf(building: Footprint) {
  return {
    x1: building.x - building.w / 2,
    x2: building.x + building.w / 2,
    z1: building.z - building.d / 2,
    z2: building.z + building.d / 2,
  };
}

export function slabAabb(slab: Slab) {
  return {
    x1: slab.x - slab.w / 2,
    x2: slab.x + slab.w / 2,
    z1: slab.z - slab.d / 2,
    z2: slab.z + slab.d / 2,
  };
}

/** Positive-area overlap. Edge contact is not overlap. */
export function overlaps(a: { x1: number; x2: number; z1: number; z2: number }, b: { x1: number; x2: number; z1: number; z2: number }): boolean {
  const ix = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
  const iz = Math.min(a.z2, b.z2) - Math.max(a.z1, b.z1);
  return ix > 1e-6 && iz > 1e-6;
}
