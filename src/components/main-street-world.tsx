import { useEffect, useMemo, useRef, type ComponentRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { MS_REGIONS, MS_STATION, type MsRegion, type MsRegionId } from "@/lib/main-street";
import type { MsGfx } from "@/lib/gfx";

export type { MsGfx };

type WorldProps = {
  focus: MsRegionId | null;
  inside: MsRegionId | null;
  highlight: MsRegionId | null;
  gfx: MsGfx;
  onFocus: (id: MsRegionId) => void;
  onEnter: (id: MsRegionId) => void;
};

const HOME: [number, number, number] = [-4.5, 9.2, 18];
const HOME_LOOK: [number, number, number] = [14, 1.4, 0];

function region(id: string | null) {
  return MS_REGIONS.find((r) => r.id === id) ?? null;
}

export function MainStreetWorld({ focus, inside, highlight, gfx, onFocus, onEnter }: WorldProps) {
  const busy = gfx === "high";

  return (
    <Canvas
      camera={{ position: HOME, fov: 42, near: 0.08, far: 180 }}
      dpr={gfx === "low" ? [1, 1.05] : [1, 1.5]}
      flat
      gl={{
        antialias: gfx !== "low",
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: gfx === "low" ? "low-power" : "high-performance",
        toneMapping: THREE.NoToneMapping,
      }}
      resize={{ offsetSize: true, scroll: false }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 0);
      }}
      onPointerMissed={() => {
        if (!inside) onFocus("plaza");
      }}
      className="h-full w-full bg-transparent"
      style={{ touchAction: "none", background: "transparent" }}
    >
      <hemisphereLight args={["#d8f6ff", "#05080c", inside ? 0.7 : 0.92]} />
      <ambientLight intensity={inside ? 0.62 : 0.55} />
      <directionalLight position={[12, 18, 8]} intensity={inside ? 0.9 : 1.15} color="#ffffff" />
      <pointLight position={[0, 4.2, 0]} intensity={1.1} color="#00ffff" distance={28} />
      {inside ? (
        <Interior id={inside} />
      ) : (
        <>
          <Boulevard />
          <Station />
          {MS_REGIONS.map((r) => (
            <Building
              key={r.id}
              region={r}
              active={focus === r.id}
              lit={highlight === r.id}
              onFocus={onFocus}
              onEnter={onEnter}
            />
          ))}
          {highlight ? <Trace to={highlight} /> : null}
          {busy ? <Lamps /> : null}
          <GuideMarker focus={focus} highlight={highlight} />
        </>
      )}
      <Rig focus={focus} inside={inside} />
    </Canvas>
  );
}

function Boulevard() {
  const traces = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts: number[] = [];
    for (const r of MS_REGIONS) {
      if (r.id === "plaza") continue;
      pts.push(0, 0.08, 0, r.position[0], 0.08, r.position[2]);
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18, 0, 0]} receiveShadow>
        <planeGeometry args={[92, 42]} />
        <meshLambertMaterial color="#05070a" toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18, 0.02, 0]}>
        <planeGeometry args={[78, 7.2]} />
        <meshLambertMaterial color="#0a1016" toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18, 0.04, 0]}>
        <planeGeometry args={[78, 0.12]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <lineSegments geometry={traces}>
        <lineBasicMaterial color="#00ffff" transparent opacity={0.28} toneMapped={false} />
      </lineSegments>
      <gridHelper args={[88, 44, "#0c3038", "#080c12"]} position={[18, 0.03, 0]} />
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.4, 5.7, 64]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.55, 1.15, 1.6, 16]} />
        <meshLambertMaterial color="#101820" emissive="#00ffff" emissiveIntensity={0.18} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Station() {
  const [x, , z] = MS_STATION.position;
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[6.4, 0.3, 8.4]} radius={0.08} smoothness={3} position={[0, 0.15, 0]}>
        <meshLambertMaterial color="#101820" toneMapped={false} />
      </RoundedBox>
      <RoundedBox args={[0.35, 4.2, 0.35]} radius={0.04} position={[-2.6, 2.2, -3.4]}>
        <meshLambertMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.2} toneMapped={false} />
      </RoundedBox>
      <RoundedBox args={[0.35, 4.2, 0.35]} radius={0.04} position={[-2.6, 2.2, 3.4]}>
        <meshLambertMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.2} toneMapped={false} />
      </RoundedBox>
      <RoundedBox args={[6.8, 0.16, 8.8]} radius={0.04} position={[0, 4.4, 0]}>
        <meshLambertMaterial color="#0c141c" emissive="#00ffff" emissiveIntensity={0.08} toneMapped={false} />
      </RoundedBox>
      <Html position={[0, 5.1, 0]} center distanceFactor={28} style={{ pointerEvents: "none" }}>
        <div className="ms-chip">
          <span className="ms-chip-led" data-led="here" />
          Main Street Station
        </div>
      </Html>
    </group>
  );
}

function Lamps() {
  const spots = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let x = -8; x <= 46; x += 6) {
      pts.push([x, 0, -3.4], [x, 0, 3.4]);
    }
    return pts;
  }, []);
  return (
    <group>
      {spots.map(([x, , z]) => (
        <group key={`${x}:${z}`} position={[x, 0, z]}>
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 3.2, 6]} />
            <meshLambertMaterial color="#1a242c" toneMapped={false} />
          </mesh>
          <mesh position={[0, 3.25, 0]}>
            <sphereGeometry args={[0.16, 10, 10]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Trace({ to }: { to: MsRegionId }) {
  const r = region(to);
  const pulse = useRef<THREE.Mesh>(null);
  const geom = useMemo(() => {
    if (!r) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([0, 0.12, 0, r.position[0], 0.12, r.position[2]], 3),
    );
    return g;
  }, [r]);
  useFrame(({ clock }) => {
    if (!r || !pulse.current) return;
    const t = (clock.elapsedTime % 2.4) / 2.4;
    pulse.current.position.set(r.position[0] * t, 0.28, r.position[2] * t);
  });
  if (!r || !geom) return null;
  return (
    <group>
      <lineSegments geometry={geom}>
        <lineBasicMaterial color="#00ffff" transparent opacity={0.85} toneMapped={false} />
      </lineSegments>
      <mesh ref={pulse}>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
    </group>
  );
}

function GuideMarker({ focus, highlight }: { focus: MsRegionId | null; highlight: MsRegionId | null }) {
  const ref = useRef<THREE.Group>(null);
  const goal = useMemo(() => {
    const r = region(highlight ?? focus ?? "plaza");
    if (!r) return new THREE.Vector3(0, 0, 2.2);
    if (r.id === "plaza") return new THREE.Vector3(1.8, 0, 2.6);
    return new THREE.Vector3(r.position[0] - 2.4, 0, r.position[2] + 3.1);
  }, [focus, highlight]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1);
    const g = ref.current;
    if (!g) return;
    g.position.lerp(goal, 1 - Math.exp(-d * 2.4));
    const bob = Math.sin(performance.now() * 0.002) * 0.06;
    const body = g.children[0];
    if (body) body.position.y = bob;
  });

  return (
    <group ref={ref} position={[1.8, 0, 2.6]}>
      <group>
        <mesh position={[0, 1.55, 0]}>
          <sphereGeometry args={[0.28, 14, 14]} />
          <meshLambertMaterial color="#d8f6ff" emissive="#00ffff" emissiveIntensity={0.22} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <capsuleGeometry args={[0.22, 0.7, 6, 10]} />
          <meshLambertMaterial color="#0a2a32" emissive="#00ffff" emissiveIntensity={0.18} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.34, 0.38, 0.12, 12]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.45} />
        </mesh>
      </group>
    </group>
  );
}

function Building({
  region: r,
  active,
  lit,
  onFocus,
  onEnter,
}: {
  region: MsRegion;
  active: boolean;
  lit: boolean;
  onFocus: (id: MsRegionId) => void;
  onEnter: (id: MsRegionId) => void;
}) {
  const [w, h, d] = r.size;
  const [x, y, z] = r.position;
  const hot = active || lit;
  const emissive = hot ? r.color : "#000000";

  return (
    <group position={[x, y, z]}>
      <mesh
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (active) onEnter(r.id);
          else onFocus(r.id);
        }}
      >
        <circleGeometry args={[Math.max(w, d) * 0.7, 28]} />
        <meshBasicMaterial color={r.pad} transparent opacity={0.7} toneMapped={false} />
      </mesh>
      {hot ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
          <ringGeometry args={[Math.max(w, d) * 0.52, Math.max(w, d) * 0.64, 32]} />
          <meshBasicMaterial color={r.color} transparent opacity={0.9} />
        </mesh>
      ) : null}
      <group
        onClick={(e) => {
          e.stopPropagation();
          if (active) onEnter(r.id);
          else onFocus(r.id);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEnter(r.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <Volume region={r} w={w} h={h} d={d} emissive={emissive} />
      </group>
      <Html position={[0, h + 0.7, 0]} center distanceFactor={26} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <div className="ms-chip">
          <span className="ms-chip-led" data-led={hot ? "here" : r.later ? "later" : "open"} />
          {r.name}
        </div>
      </Html>
      {active ? (
        <Html position={[0, 1.15, d / 2 + 0.4]} center distanceFactor={18} zIndexRange={[22, 0]} style={{ pointerEvents: "none" }}>
          <div className="ms-chip ms-chip-hot">Enter</div>
        </Html>
      ) : null}
    </group>
  );
}

function Volume({
  region: r,
  w,
  h,
  d,
  emissive,
}: {
  region: MsRegion;
  w: number;
  h: number;
  d: number;
  emissive: string;
}) {
  const mat = {
    color: "#1c2a36",
    emissive,
    emissiveIntensity: emissive === "#000000" ? 0.06 : 0.28,
    toneMapped: false as const,
  };
  const door = (
    <mesh position={[0, 0.78, d / 2 + 0.03]}>
      <boxGeometry args={[0.86, 1.55, 0.1]} />
      <meshPhysicalMaterial color="#05080c" emissive={r.color} emissiveIntensity={0.28} roughness={0.4} toneMapped={false} />
    </mesh>
  );

  if (r.shape === "plaza") {
    return (
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
          <circleGeometry args={[3.4, 48]} />
          <meshLambertMaterial {...mat} color="#101820" />
        </mesh>
      </group>
    );
  }
  if (r.shape === "shop") {
    return (
      <group>
        <RoundedBox args={[w, h * 0.78, d]} radius={0.16} smoothness={3} position={[0, h * 0.39, 0]}>
          <meshLambertMaterial {...mat} />
        </RoundedBox>
        <mesh position={[0, h * 0.78, d * 0.28]}>
          <boxGeometry args={[w * 0.96, 0.16, 1.6]} />
          <meshLambertMaterial color={r.color} emissive={r.color} emissiveIntensity={0.35} toneMapped={false} />
        </mesh>
        {door}
      </group>
    );
  }
  if (r.shape === "atelier") {
    return (
      <group>
        <RoundedBox args={[w, h * 0.62, d]} radius={0.14} smoothness={3} position={[0, h * 0.31, 0]}>
          <meshLambertMaterial {...mat} />
        </RoundedBox>
        <mesh position={[0, h * 0.78, 0]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[w * 0.92, 0.18, d * 0.92]} />
          <meshLambertMaterial {...mat} />
        </mesh>
        {door}
      </group>
    );
  }
  if (r.shape === "hall") {
    return (
      <group>
        <RoundedBox args={[w * 0.22, h, d]} radius={0.12} position={[-w * 0.38, h / 2, 0]}>
          <meshLambertMaterial {...mat} />
        </RoundedBox>
        <RoundedBox args={[w * 0.22, h, d]} radius={0.12} position={[w * 0.38, h / 2, 0]}>
          <meshLambertMaterial {...mat} />
        </RoundedBox>
        <RoundedBox args={[w * 0.92, 0.55, d]} radius={0.1} position={[0, h * 0.88, 0]}>
          <meshLambertMaterial {...mat} />
        </RoundedBox>
        {door}
      </group>
    );
  }
  if (r.shape === "library") {
    return (
      <group>
        <RoundedBox args={[w, h, d]} radius={0.16} smoothness={3} position={[0, h / 2, 0]}>
          <meshLambertMaterial {...mat} />
        </RoundedBox>
        {[-1.4, 0, 1.4].map((ox) => (
          <mesh key={ox} position={[ox, 1.4, d / 2 + 0.12]}>
            <cylinderGeometry args={[0.18, 0.18, 2.8, 10]} />
            <meshLambertMaterial color="#d8f6ff" emissive={r.color} emissiveIntensity={0.12} toneMapped={false} />
          </mesh>
        ))}
        {door}
      </group>
    );
  }
  if (r.shape === "marquee") {
    return (
      <group>
        <RoundedBox args={[w, h * 0.7, d]} radius={0.16} smoothness={3} position={[0, h * 0.35, 0]}>
          <meshLambertMaterial {...mat} />
        </RoundedBox>
        <mesh position={[0, h * 0.82, d * 0.2]}>
          <boxGeometry args={[w * 1.05, 0.9, 0.4]} />
          <meshLambertMaterial color="#120814" emissive={r.color} emissiveIntensity={0.45} toneMapped={false} />
        </mesh>
        {door}
      </group>
    );
  }
  if (r.shape === "civic") {
    return (
      <group>
        <RoundedBox args={[w, h, d]} radius={0.18} smoothness={3} position={[0, h / 2, 0]}>
          <meshLambertMaterial {...mat} />
        </RoundedBox>
        {door}
      </group>
    );
  }
  return (
    <group>
      <RoundedBox args={[w, h * 0.72, d]} radius={0.14} smoothness={3} position={[0, h * 0.36, 0]}>
        <meshLambertMaterial {...mat} />
      </RoundedBox>
      <mesh position={[0, h * 0.86, 0]}>
        <cylinderGeometry args={[w * 0.18, w * 0.28, h * 0.28, 8]} />
        <meshLambertMaterial color="#1a1014" emissive={r.color} emissiveIntensity={0.28} toneMapped={false} />
      </mesh>
      {door}
    </group>
  );
}

function Interior({ id }: { id: MsRegionId }) {
  const r = region(id);
  if (!r) return null;
  const w = 10.4;
  const depth = 12.2;
  const h = 3.7;
  const wall = id === "own" ? "#2a1418" : "#1a2430";
  const floor = id === "own" ? "#1c1014" : "#141c24";
  const gap = 2.6;
  const accent = r.color;

  return (
    <group position={[r.position[0], 0, r.position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, depth]} />
        <meshLambertMaterial color={floor} toneMapped={false} />
      </mesh>
      <mesh position={[0, h / 2, -depth / 2]}>
        <boxGeometry args={[w, h, 0.16]} />
        <meshLambertMaterial color={wall} toneMapped={false} />
      </mesh>
      <mesh position={[-w / 2, h / 2, 0]}>
        <boxGeometry args={[0.16, h, depth]} />
        <meshLambertMaterial color={wall} toneMapped={false} />
      </mesh>
      <mesh position={[w / 2, h / 2, 0]}>
        <boxGeometry args={[0.16, h, depth]} />
        <meshLambertMaterial color={wall} toneMapped={false} />
      </mesh>
      <mesh position={[-(gap / 2 + (w - gap) / 4), h / 2, depth / 2]}>
        <boxGeometry args={[(w - gap) / 2, h, 0.16]} />
        <meshLambertMaterial color={wall} toneMapped={false} />
      </mesh>
      <mesh position={[gap / 2 + (w - gap) / 4, h / 2, depth / 2]}>
        <boxGeometry args={[(w - gap) / 2, h, 0.16]} />
        <meshLambertMaterial color={wall} toneMapped={false} />
      </mesh>
      <mesh position={[0, h, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, depth]} />
        <meshLambertMaterial color="#0a1016" toneMapped={false} />
      </mesh>
      <InteriorSet id={id} accent={accent} />
      <pointLight position={[0, 2.6, 0]} intensity={1.5} color={accent} distance={16} />
      <pointLight position={[2.4, 2.2, 2]} intensity={0.55} color="#ffffff" distance={10} />
      <Html position={[0, 2.2, -1.4]} center distanceFactor={8} zIndexRange={[12, 0]} style={{ pointerEvents: "none" }}>
        <div className="ms-html">
          <p className="ms-html-kicker">You are here</p>
          <p className="ms-html-title">{r.name}</p>
          <p className="ms-html-body">{r.lead}</p>
        </div>
      </Html>
    </group>
  );
}

function InteriorSet({ id, accent }: { id: MsRegionId; accent: string }) {
  if (id === "commerce") {
    return (
      <group>
        {[-2.4, 2.4].map((x) => (
          <mesh key={x} position={[x, 0.7, -2.4]}>
            <boxGeometry args={[3.2, 1.4, 1.1]} />
            <meshLambertMaterial color="#101820" emissive={accent} emissiveIntensity={0.1} toneMapped={false} />
          </mesh>
        ))}
        {[-3.2, -1.1, 1.1, 3.2].map((x) => (
          <mesh key={x} position={[x, 1.6, -4.8]}>
            <boxGeometry args={[1.6, 2.4, 0.4]} />
            <meshLambertMaterial color="#0c141c" emissive={accent} emissiveIntensity={0.16} toneMapped={false} />
          </mesh>
        ))}
      </group>
    );
  }
  if (id === "creator") {
    return (
      <group>
        <mesh position={[0, 0.55, -1.2]}>
          <boxGeometry args={[3.8, 0.18, 1.8]} />
          <meshLambertMaterial color="#1a1020" emissive={accent} emissiveIntensity={0.2} toneMapped={false} />
        </mesh>
        <mesh position={[-2.8, 1.4, -3.8]}>
          <boxGeometry args={[2.2, 2.4, 0.12]} />
          <meshLambertMaterial color="#120814" emissive={accent} emissiveIntensity={0.35} toneMapped={false} />
        </mesh>
      </group>
    );
  }
  if (id === "work") {
    return (
      <group>
        {[-2.6, 0, 2.6].map((x) => (
          <group key={x} position={[x, 0, -2]}>
            <mesh position={[0, 0.52, 0]}>
              <boxGeometry args={[2.1, 0.12, 1.2]} />
              <meshLambertMaterial color="#102410" emissive={accent} emissiveIntensity={0.12} toneMapped={false} />
            </mesh>
            <mesh position={[0, 1.15, -0.4]}>
              <boxGeometry args={[1.2, 0.8, 0.08]} />
              <meshLambertMaterial color="#081208" emissive={accent} emissiveIntensity={0.22} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }
  if (id === "learn") {
    return (
      <group>
        <mesh position={[0, 1.5, -4.6]}>
          <boxGeometry args={[6.4, 2.4, 0.12]} />
          <meshLambertMaterial color="#0c1824" emissive={accent} emissiveIntensity={0.2} toneMapped={false} />
        </mesh>
        {[-1.6, 0, 1.6].map((z, i) => (
          <mesh key={z} position={[0, 0.32, z - 0.4]}>
            <boxGeometry args={[6.2, 0.28, 0.7]} />
            <meshLambertMaterial color="#101820" emissive={accent} emissiveIntensity={0.08 * (i + 1)} toneMapped={false} />
          </mesh>
        ))}
      </group>
    );
  }
  if (id === "play") {
    return (
      <group>
        <mesh position={[0, 0.4, -4.2]}>
          <boxGeometry args={[6.8, 0.8, 2.2]} />
          <meshLambertMaterial color="#1a0810" emissive={accent} emissiveIntensity={0.28} toneMapped={false} />
        </mesh>
        {[-2, 0, 2].map((x) => (
          <mesh key={x} position={[x, 0.28, 1.6]}>
            <boxGeometry args={[1.8, 0.4, 1.4]} />
            <meshLambertMaterial color="#140810" toneMapped={false} />
          </mesh>
        ))}
      </group>
    );
  }
  if (id === "services") {
    return (
      <group>
        <mesh position={[0, 0.7, -2.6]}>
          <boxGeometry args={[5.4, 1.4, 1.3]} />
          <meshLambertMaterial color="#101428" emissive={accent} emissiveIntensity={0.14} toneMapped={false} />
        </mesh>
      </group>
    );
  }
  if (id === "own") {
    return (
      <group>
        <mesh position={[0, 1.4, -3.2]}>
          <cylinderGeometry args={[1.6, 1.6, 2.8, 16]} />
          <meshLambertMaterial color="#1a080c" emissive={accent} emissiveIntensity={0.32} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.9, 2.2, 32]} />
          <meshBasicMaterial color={accent} transparent opacity={0.7} />
        </mesh>
      </group>
    );
  }
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.6, 1.8, 0.18, 24]} />
        <meshLambertMaterial color="#101820" emissive={accent} emissiveIntensity={0.2} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Rig({ focus, inside }: { focus: MsRegionId | null; inside: MsRegionId | null }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const flying = useRef(false);
  const goal = useRef(new THREE.Vector3(...HOME));
  const look = useRef(new THREE.Vector3(...HOME_LOOK));

  useEffect(() => {
    const r = inside ? region(inside) : focus ? region(focus) : region("plaza");
    if (inside && r) {
      goal.current.set(r.position[0], 1.62, r.position[2] + 2.4);
      look.current.set(r.position[0], 1.28, r.position[2] - 2.2);
      flying.current = true;
      return;
    }
    if (r && r.id !== "plaza") {
      const [x, , z] = r.position;
      const h = r.size[1];
      goal.current.set(x + 6.4, h + 3.8, z + 9.2);
      look.current.set(x, h * 0.42, z);
      flying.current = true;
      return;
    }
    goal.current.set(...HOME);
    look.current.set(...HOME_LOOK);
    flying.current = true;
  }, [focus, inside]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1);
    const ctrl = controls.current as unknown as {
      object: THREE.Camera;
      target: THREE.Vector3;
      update: () => void;
      minDistance: number;
      maxDistance: number;
    } | null;
    if (!ctrl) return;
    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cam = ctrl.object;
    ctrl.minDistance = inside ? 1.1 : 7;
    ctrl.maxDistance = inside ? 8 : 48;
    if (!flying.current) return;
    if (reduce) {
      cam.position.copy(goal.current);
      ctrl.target.copy(look.current);
      ctrl.update();
      flying.current = false;
      return;
    }
    const k = inside ? 5.4 : 3.1;
    cam.position.lerp(goal.current, 1 - Math.exp(-d * k));
    ctrl.target.lerp(look.current, 1 - Math.exp(-d * k));
    ctrl.update();
    if (cam.position.distanceTo(goal.current) < 0.12) flying.current = false;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minPolarAngle={inside ? 0.72 : 0.34}
      maxPolarAngle={inside ? Math.PI / 1.85 : Math.PI / 2.18}
      minDistance={inside ? 1.1 : 7}
      maxDistance={inside ? 8 : 48}
      onStart={() => {
        flying.current = false;
      }}
    />
  );
}
