import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { DISTRICTS } from "../grid.ts";
import {
  FACE_X,
  FACE_Z,
  aabbOf,
  buildLayout,
  doorOf,
  overlaps,
  slabAabb,
  wallHeight,
  windowBays,
  type Footprint,
} from "./layout.ts";

function streetFace(building: Footprint): number {
  switch (building.doorFace) {
    case "s":
      return building.z + building.d / 2;
    case "n":
      return building.z - building.d / 2;
    case "e":
      return building.x + building.w / 2;
    case "w":
      return building.x - building.w / 2;
  }
}

describe("git-city layout", () => {
  it("does not import three", () => {
    const src = readFileSync(new URL("./layout.ts", import.meta.url), "utf8");
    assert.equal(/\bfrom\s+["']three["']/.test(src), false);
    assert.equal(src.includes("@react-three"), false);
  });

  it("is deterministic for the same seed", () => {
    assert.deepEqual(buildLayout(), buildLayout());
  });

  it("covers every district id exactly once and keeps origins on the id", () => {
    const layout = buildLayout();
    const ids = layout.buildings.map((building) => building.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.deepEqual([...ids].sort(), DISTRICTS.map((district) => district.id).sort());
    assert.notDeepEqual(ids, [...ids].sort());
    for (const building of layout.buildings) {
      assert.deepEqual(layout.originById[building.id], { x: building.x, z: building.z });
    }
    assert.equal(layout.originById.mission?.x, 0);
    assert.ok((layout.originById.mission?.z ?? 0) < -FACE_Z);
    assert.ok((layout.originById.hermes?.x ?? 0) < 0);
    assert.ok((layout.originById.dock?.x ?? 0) > 0);
    assert.equal(layout.buildings.find((building) => building.id === "mission")?.silhouette, "spire");
    assert.equal(layout.buildings.find((building) => building.id === "aegis")?.silhouette, "bunker");
    assert.equal(layout.buildings.find((building) => building.id === "holofoil")?.silhouette, "fins");
  });

  it("keeps a closed street loop with sidewalks outside the roadway", () => {
    const layout = buildLayout();
    assert.equal(layout.roads.length, 4);
    assert.equal(layout.sidewalks.length, 4);
    const northRoad = layout.roads.find((slab) => slab.id === "road-n");
    const southRoad = layout.roads.find((slab) => slab.id === "road-s");
    const eastRoad = layout.roads.find((slab) => slab.id === "road-e");
    const westRoad = layout.roads.find((slab) => slab.id === "road-w");
    assert.ok(northRoad && southRoad && eastRoad && westRoad);
    const north = slabAabb(northRoad);
    const south = slabAabb(southRoad);
    const east = slabAabb(eastRoad);
    const west = slabAabb(westRoad);
    assert.ok(Math.abs(east.z1 - north.z2) < 1e-6);
    assert.ok(Math.abs(east.z2 - south.z1) < 1e-6);
    assert.ok(Math.abs(west.z1 - north.z2) < 1e-6);
    assert.ok(Math.abs(north.x2 - east.x2) < 1e-6 || north.x2 >= east.x1);

    for (const walk of layout.sidewalks) {
      const box = slabAabb(walk);
      for (const road of layout.roads) {
        assert.equal(overlaps(box, slabAabb(road)), false, `${walk.id} overlaps ${road.id}`);
      }
    }

    const northWalk = slabAabb(layout.sidewalks.find((slab) => slab.id === "walk-n")!);
    const southWalk = slabAabb(layout.sidewalks.find((slab) => slab.id === "walk-s")!);
    const eastWalk = slabAabb(layout.sidewalks.find((slab) => slab.id === "walk-e")!);
    const westWalk = slabAabb(layout.sidewalks.find((slab) => slab.id === "walk-w")!);
    assert.ok(northWalk.z2 <= north.z1 + 1e-6);
    assert.ok(southWalk.z1 >= south.z2 - 1e-6);
    assert.ok(eastWalk.x1 >= east.x2 - 1e-6);
    assert.ok(westWalk.x2 <= west.x1 + 1e-6);
  });

  it("keeps footprints off the roadway and off the sidewalk", () => {
    const layout = buildLayout();
    for (const building of layout.buildings) {
      const box = aabbOf(building);
      for (const road of layout.roads) {
        assert.equal(overlaps(box, slabAabb(road)), false, `${building.id} overlaps ${road.id}`);
      }
      for (const walk of layout.sidewalks) {
        assert.equal(overlaps(box, slabAabb(walk)), false, `${building.id} overlaps ${walk.id}`);
      }
      for (const other of layout.buildings) {
        if (other.id === building.id) continue;
        assert.equal(overlaps(box, aabbOf(other)), false, `${building.id} overlaps ${other.id}`);
      }
      const face = streetFace(building);
      if (building.doorFace === "n" || building.doorFace === "s") {
        assert.ok(Math.abs(Math.abs(face) - FACE_Z) < 1e-6, building.id);
      } else {
        assert.ok(Math.abs(Math.abs(face) - FACE_X) < 1e-6, building.id);
      }
      assert.ok(wallHeight(building) > building.floors);
    }
  });

  it("gives every building a door and window bays that are not the whole facade", () => {
    const layout = buildLayout();
    for (const cols of [2, 3, 4]) {
      for (const building of layout.buildings) {
        const door = doorOf(building);
        assert.equal(door.face, building.doorFace);
        assert.ok(door.w < building.w && door.h < wallHeight(building));
        const bays = windowBays(building, cols, cols > 2);
        assert.ok(bays.length >= building.floors, `${building.id} cols ${cols}`);
        for (const bay of bays) {
          assert.ok(bay.w < (bay.face === "n" || bay.face === "s" ? building.w : building.d) * 0.8);
          assert.ok(bay.h < wallHeight(building) * 0.5);
          if (bay.face === door.face) {
            const vertical = Math.min(bay.y + bay.h / 2, door.y + door.h / 2) - Math.max(bay.y - bay.h / 2, door.y - door.h / 2);
            const alongBay = bay.face === "n" || bay.face === "s" ? bay.x - building.x : bay.z - building.z;
            const horizontal = Math.min(alongBay + bay.w / 2, door.w / 2) - Math.max(alongBay - bay.w / 2, -door.w / 2);
            assert.ok(!(vertical > 0.02 && horizontal > 0.02), `${bay.id} covers the door`);
          }
        }
      }
    }
  });
});
