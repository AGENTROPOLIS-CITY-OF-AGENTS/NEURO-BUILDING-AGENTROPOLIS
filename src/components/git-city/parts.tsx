import { useLayoutEffect, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { GRID_COLORS } from "@/lib/design-system";
import {
  LOBBY_H,
  buildLayout,
  doorOf,
  wallHeight,
  windowBays,
  type Face,
  type Footprint,
  type Opening,
} from "@/lib/git-city/layout";

const OBSIDIAN = GRID_COLORS.obsidian;
const CYAN = GRID_COLORS.cyan;
const RED = GRID_COLORS.red;

function yaw(face: Face): number {
  if (face === "e") return Math.PI / 2;
  if (face === "w") return -Math.PI / 2;
  if (face === "n") return Math.PI;
  return 0;
}

function paintInstances(mesh: THREE.InstancedMesh, openings: Opening[]) {
  const dummy = new THREE.Object3D();
  openings.forEach((opening, index) => {
    dummy.position.set(opening.x, opening.y, opening.z);
    dummy.rotation.set(0, yaw(opening.face), 0);
    dummy.scale.set(opening.w, opening.h, 1);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  });
  mesh.count = openings.length;
  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingSphere();
}

function BayField({
  openings,
  color,
  thickness,
  onPick,
}: {
  openings: Opening[];
  color: string;
  thickness: number;
  onPick?: (id: string) => void;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    paintInstances(mesh, openings);
  }, [openings]);
  if (openings.length === 0) return null;
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, openings.length]}
      frustumCulled={false}
      onClick={(event) => {
        event.stopPropagation();
        const opening = openings[event.instanceId ?? -1];
        if (opening && onPick) onPick(opening.buildingId);
      }}
    >
      <boxGeometry args={[1, 1, thickness]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </instancedMesh>
  );
}

export function StreetBlock() {
  const layout = useMemo(() => buildLayout(), []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow={false}>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial color={OBSIDIAN} roughness={0.92} metalness={0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[layout.plaza.x, 0.012, layout.plaza.z]}>
        <planeGeometry args={[layout.plaza.w, layout.plaza.d]} />
        <meshStandardMaterial color="#10151c" roughness={0.7} metalness={0.24} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.1, 3.28, 40]} />
        <meshBasicMaterial color={CYAN} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.021, 0]}>
        <circleGeometry args={[0.7, 3]} />
        <meshBasicMaterial color={RED} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {layout.roads.map((slab) => (
        <mesh key={slab.id} rotation={[-Math.PI / 2, 0, 0]} position={[slab.x, 0.025, slab.z]}>
          <planeGeometry args={[slab.w, slab.d]} />
          <meshStandardMaterial color="#0b1016" roughness={0.55} metalness={0.48} emissive={OBSIDIAN} emissiveIntensity={0.4} />
        </mesh>
      ))}
      {layout.sidewalks.map((slab) => (
        <mesh key={slab.id} rotation={[-Math.PI / 2, 0, 0]} position={[slab.x, 0.055, slab.z]}>
          <planeGeometry args={[slab.w, slab.d]} />
          <meshStandardMaterial color="#1b232e" roughness={0.78} metalness={0.16} />
        </mesh>
      ))}
      {layout.lanes.map((slab) => (
        <mesh key={slab.id} rotation={[-Math.PI / 2, 0, 0]} position={[slab.x, 0.04, slab.z]}>
          <planeGeometry args={[slab.w, slab.d]} />
          <meshBasicMaterial color={slab.accent === "red" ? RED : CYAN} toneMapped={false} />
        </mesh>
      ))}
      <Crosswalk x={0} z={-20} axis="z" />
      <Crosswalk x={0} z={20} axis="z" />
      <Crosswalk x={16} z={0} axis="x" />
      <Crosswalk x={-16} z={0} axis="x" />
      <Lamps />
    </group>
  );
}

function Crosswalk({ x, z, axis }: { x: number; z: number; axis: "x" | "z" }) {
  return (
    <group>
      {[0, 1, 2, 3, 4].map((index) => {
        const offset = (index - 2) * 0.72;
        const position: [number, number, number] = axis === "z" ? [x + offset, 0.045, z] : [x, 0.045, z + offset];
        const args: [number, number, number] = axis === "z" ? [0.34, 0.01, 4.4] : [4.4, 0.01, 0.34];
        return (
          <mesh key={index} position={position}>
            <boxGeometry args={args} />
            <meshBasicMaterial color={CYAN} toneMapped={false} transparent opacity={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

function Lamps() {
  const posts: [number, number][] = [
    [-20.6, -24.6],
    [0, -24.8],
    [20.6, -24.6],
    [20.8, 0],
    [20.6, 24.6],
    [0, 24.8],
    [-20.6, 24.6],
    [-20.8, 0],
  ];
  return (
    <group>
      {posts.map(([x, z]) => (
        <group key={`${x}:${z}`} position={[x, 0, z]}>
          <mesh position={[0, 1.7, 0]}>
            <boxGeometry args={[0.12, 3.4, 0.12]} />
            <meshStandardMaterial color="#121820" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 3.45, 0]}>
            <boxGeometry args={[0.7, 0.1, 0.28]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Silhouette({ building, top }: { building: Footprint; top: number }) {
  const accent = building.accent === "red" ? RED : CYAN;
  const y = top;
  switch (building.silhouette) {
    case "spire":
      return (
        <group>
          <mesh position={[0, y + 1.5, 0]}>
            <boxGeometry args={[building.w * 0.42, 3, building.d * 0.42]} />
            <meshStandardMaterial color="#101820" emissive={accent} emissiveIntensity={0.2} metalness={0.6} roughness={0.28} />
          </mesh>
          <mesh position={[0, y + 4.4, 0]}>
            <boxGeometry args={[0.28, 3.6, 0.28]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
          <mesh position={[0, y + 6.3, 0]}>
            <boxGeometry args={[1.1, 0.12, 1.1]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
        </group>
      );
    case "crown":
      return (
        <group>
          {[-1.15, 0, 1.15].map((x, index) => (
            <mesh key={x} position={[x, y + 0.7 + (index === 1 ? 0.7 : 0), 0]}>
              <boxGeometry args={[0.28, index === 1 ? 2.8 : 1.5, building.d * 0.72]} />
              <meshBasicMaterial color={accent} toneMapped={false} />
            </mesh>
          ))}
        </group>
      );
    case "crane":
      return (
        <group>
          <mesh position={[building.w * 0.28, y + 2.2, 0]}>
            <boxGeometry args={[0.22, 4.4, 0.22]} />
            <meshStandardMaterial color="#1a120f" emissive={RED} emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[building.w * 0.28 - 1.6, y + 4.2, 0]}>
            <boxGeometry args={[3.6, 0.16, 0.16]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
          <mesh position={[building.w * 0.28 - 3.1, y + 3.3, 0]}>
            <boxGeometry args={[0.08, 1.7, 0.08]} />
            <meshBasicMaterial color={RED} toneMapped={false} />
          </mesh>
        </group>
      );
    case "bunker":
      return (
        <group>
          <mesh position={[-0.55, y + 0.45, 0.2]} rotation={[0, 0, 0.55]}>
            <boxGeometry args={[2.4, 0.16, 0.5]} />
            <meshBasicMaterial color={RED} toneMapped={false} />
          </mesh>
          <mesh position={[0.55, y + 0.45, 0.2]} rotation={[0, 0, -0.55]}>
            <boxGeometry args={[2.4, 0.16, 0.5]} />
            <meshBasicMaterial color={RED} toneMapped={false} />
          </mesh>
        </group>
      );
    case "fins":
      return (
        <group>
          <mesh position={[-0.7, y + 1.3, 0]} rotation={[0.2, 0, 0.45]}>
            <boxGeometry args={[0.12, 2.8, building.d * 0.7]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
          <mesh position={[0.7, y + 1.3, 0]} rotation={[-0.2, 0, -0.45]}>
            <boxGeometry args={[0.12, 2.8, building.d * 0.7]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
        </group>
      );
    case "mast":
      return (
        <group>
          <mesh position={[0, y + 3.1, 0]}>
            <boxGeometry args={[0.14, 6.2, 0.14]} />
            <meshBasicMaterial color={RED} toneMapped={false} />
          </mesh>
          <mesh position={[0, y + 5.4, 0]}>
            <boxGeometry args={[2.2, 0.08, 0.08]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
        </group>
      );
    case "step":
      return (
        <mesh position={[building.w * 0.12, y + 0.7, -building.d * 0.08]}>
          <boxGeometry args={[building.w * 0.55, 1.4, building.d * 0.55]} />
          <meshStandardMaterial color="#141b24" emissive={accent} emissiveIntensity={0.16} metalness={0.5} roughness={0.4} />
        </mesh>
      );
    case "slab":
      return (
        <mesh position={[0, y + 0.28, 0]}>
          <boxGeometry args={[building.w * 0.72, 0.45, building.d * 0.72]} />
          <meshStandardMaterial color="#10161c" emissive={accent} emissiveIntensity={0.12} metalness={0.55} roughness={0.36} />
        </mesh>
      );
  }
}

function BuildingMass({
  building,
  active,
  onSelect,
}: {
  building: Footprint;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const height = wallHeight(building);
  const accent = building.accent === "red" ? RED : CYAN;
  const body = building.accent === "red" ? "#1a1214" : "#121a22";
  const select = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onSelect(building.id);
  };
  return (
    <group position={[building.x, 0, building.z]} onClick={select}>
      <mesh position={[0, 0.16, 0]} onClick={select}>
        <boxGeometry args={[building.w + 0.7, 0.32, building.d + 0.7]} />
        <meshStandardMaterial color="#0c1218" metalness={0.4} roughness={0.62} />
      </mesh>
      <mesh position={[0, LOBBY_H / 2, 0]} onClick={select}>
        <boxGeometry args={[building.w + 0.28, LOBBY_H, building.d + 0.28]} />
        <meshStandardMaterial color="#161d27" metalness={0.58} roughness={0.38} emissive={accent} emissiveIntensity={active ? 0.28 : 0.06} />
      </mesh>
      <mesh position={[0, LOBBY_H + (height - LOBBY_H) / 2, 0]} onClick={select}>
        <boxGeometry args={[building.w, height - LOBBY_H, building.d]} />
        <meshStandardMaterial color={body} metalness={0.64} roughness={0.32} emissive={accent} emissiveIntensity={active ? 0.34 : 0.08} />
      </mesh>
      <mesh position={[0, height + 0.12, 0]}>
        <boxGeometry args={[building.w + 0.22, 0.22, building.d + 0.22]} />
        <meshStandardMaterial color="#0e141c" metalness={0.7} roughness={0.24} emissive={accent} emissiveIntensity={0.45} />
      </mesh>
      <Silhouette building={building} top={height + 0.24} />
      {building.silhouette !== "step" && building.silhouette !== "slab" ? (
        <Html position={[0, height + 1.6, 0]} center distanceFactor={28} zIndexRange={[12, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              color: accent,
              font: "600 12px ui-monospace, monospace",
              letterSpacing: "0.16em",
              whiteSpace: "nowrap",
              textShadow: "0 1px 2px #05070A",
            }}
          >
            {building.code}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

export function DistrictCity({
  selected,
  cols,
  sides,
  onSelect,
}: {
  selected: string | null;
  cols: number;
  sides: boolean;
  onSelect: (id: string) => void;
}) {
  const layout = useMemo(() => buildLayout(), []);
  const openings = useMemo(() => {
    const cyan: Opening[] = [];
    const red: Opening[] = [];
    const cyanDoors: Opening[] = [];
    const redDoors: Opening[] = [];
    const panels: Opening[] = [];
    const piers: Opening[] = [];
    const redPiers: Opening[] = [];
    for (const building of layout.buildings) {
      const door = doorOf(building);
      panels.push({ ...door, w: door.w * 0.78, h: door.h * 0.9, depth: door.depth });
      (building.accent === "red" ? redDoors : cyanDoors).push({ ...door, w: door.w + 0.2, h: door.h + 0.16 });
      for (const bay of windowBays(building, cols, sides)) {
        (building.accent === "red" ? red : cyan).push(bay);
      }
      const span = building.doorFace === "n" || building.doorFace === "s" ? building.w : building.d;
      const along = span / 2 - 0.18;
      const height = wallHeight(building) - LOBBY_H * 0.15;
      const y = height / 2;
      for (const offset of [-along, along]) {
        const face = building.doorFace;
        const pier: Opening = {
          id: `${building.id}-pier-${offset > 0 ? "r" : "l"}`,
          buildingId: building.id,
          face,
          x: building.x,
          y,
          z: building.z,
          w: 0.18,
          h: height,
          depth: 0.12,
        };
        if (face === "s") {
          pier.x = building.x + offset;
          pier.z = building.z + building.d / 2 + 0.06;
        } else if (face === "n") {
          pier.x = building.x + offset;
          pier.z = building.z - building.d / 2 - 0.06;
        } else if (face === "e") {
          pier.z = building.z + offset;
          pier.x = building.x + building.w / 2 + 0.06;
        } else {
          pier.z = building.z + offset;
          pier.x = building.x - building.w / 2 - 0.06;
        }
        (building.accent === "red" ? redPiers : piers).push(pier);
      }
    }
    return { cyan, red, cyanDoors, redDoors, panels, piers, redPiers };
  }, [layout, cols, sides]);

  return (
    <group>
      {layout.buildings.map((building) => (
        <BuildingMass key={building.id} building={building} active={selected === building.id} onSelect={onSelect} />
      ))}
      <BayField openings={openings.cyanDoors} color={CYAN} thickness={0.1} onPick={onSelect} />
      <BayField openings={openings.redDoors} color={RED} thickness={0.1} onPick={onSelect} />
      <BayField openings={openings.panels} color={OBSIDIAN} thickness={0.14} onPick={onSelect} />
      <BayField openings={openings.piers} color={CYAN} thickness={0.16} />
      <BayField openings={openings.redPiers} color={RED} thickness={0.16} />
      <BayField openings={openings.cyan} color={CYAN} thickness={0.1} onPick={onSelect} />
      <BayField openings={openings.red} color={RED} thickness={0.1} onPick={onSelect} />
    </group>
  );
}
