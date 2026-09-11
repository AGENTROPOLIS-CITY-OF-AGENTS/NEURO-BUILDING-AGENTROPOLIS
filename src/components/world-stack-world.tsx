import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { CineLights } from "@/components/cine-lights";
import type { CityGfx } from "@/lib/gfx";
import {
  EARTH_R,
  STACK_CAM,
  STACK_GOV,
  STACK_REGIONS,
  STACK_SATS,
  latLonToVec,
  type StackLayer,
} from "@/lib/world-stack";

type Props = {
  layer: StackLayer;
  region: string | null;
  gfx: CityGfx;
  reduced: boolean;
  paused: boolean;
  onRegion: (id: string) => void;
  onEnterCity: () => void;
};

function earthTexture() {
  const w = 512;
  const h = 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.fillStyle = "#05070A";
  g.fillRect(0, 0, w, h);
  const land = [
    [108, 70, 70, 80],
    [155, 92, 36, 70],
    [268, 78, 90, 50],
    [300, 118, 70, 55],
    [360, 130, 80, 40],
    [420, 150, 55, 28],
    [88, 160, 40, 50],
  ] as const;
  for (const [x, y, rx, ry] of land) {
    g.fillStyle = "#0b242c";
    g.beginPath();
    g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgba(25,230,230,0.35)";
    g.lineWidth = 1.2;
    g.stroke();
  }
  g.fillStyle = "rgba(255,42,42,0.55)";
  for (let i = 0; i < 90; i++) {
    const x = (i * 47) % w;
    const y = 40 + ((i * 29) % (h - 80));
    g.fillRect(x, y, 1.5, 1.5);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function Rig({ layer, reduced }: { layer: StackLayer; reduced: boolean }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    const cam = STACK_CAM[layer];
    const k = reduced ? 1 : 1 - Math.exp(-dt * 2.2);
    camera.position.lerp(new THREE.Vector3(...cam.pos), k);
    look.current.lerp(new THREE.Vector3(...cam.look), k);
    camera.lookAt(look.current);
    const persp = camera as THREE.PerspectiveCamera;
    persp.fov += (cam.fov - persp.fov) * k;
    persp.updateProjectionMatrix();
  });
  return null;
}

function Earth({ gfx, layer }: { gfx: CityGfx; layer: StackLayer }) {
  const tex = useMemo(() => earthTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  const segs = gfx === "high" ? 64 : gfx === "medium" ? 48 : 32;
  return (
    <group>
      <mesh>
        <sphereGeometry args={[EARTH_R, segs, segs / 2]} />
        <meshStandardMaterial map={tex} roughness={0.92} metalness={0.08} emissive="#041018" emissiveIntensity={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[EARTH_R + 0.025, segs, segs / 2]} />
        <meshBasicMaterial color="#19E6E6" transparent opacity={layer === "atlas" ? 0.12 : 0.05} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[EARTH_R + 0.08, 24, 16]} />
        <meshBasicMaterial color="#19E6E6" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

function Orbits({ busy, reduced }: { busy: boolean; reduced: boolean }) {
  const rings = useMemo(() => {
    return [2.35, 2.62, 2.9].map((r, i) => {
      const g = new THREE.BufferGeometry();
      const n = busy ? 96 : 48;
      const pts: number[] = [];
      const tilt = i === 1 ? 0.45 : i === 2 ? -0.32 : 0.12;
      for (let k = 0; k <= n; k++) {
        const a = (k / n) * Math.PI * 2;
        pts.push(Math.cos(a) * r, Math.sin(a) * r * Math.sin(tilt), Math.sin(a) * r * Math.cos(tilt));
      }
      g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      return g;
    });
  }, [busy]);
  useEffect(() => () => rings.forEach((g) => g.dispose()), [rings]);
  if (reduced) return null;
  return (
    <group>
      {rings.map((g, i) => (
        <lineLoop key={i} geometry={g}>
          <lineBasicMaterial color={i === 2 ? "#FF2A2A" : "#19E6E6"} transparent opacity={0.35} />
        </lineLoop>
      ))}
    </group>
  );
}

function Sats({ gfx, reduced }: { gfx: CityGfx; reduced: boolean }) {
  const count = gfx === "high" ? STACK_SATS.length : gfx === "medium" ? 8 : 6;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = reduced ? 0 : clock.elapsedTime * 0.08;
    for (let i = 0; i < count; i++) {
      const s = STACK_SATS[i]!;
      const tilt = s.plane === 1 ? 0.45 : s.plane === 2 ? -0.32 : 0.12;
      const a = (s.phase + t) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * s.alt, Math.sin(a) * s.alt * Math.sin(tilt), Math.sin(a) * s.alt * Math.cos(tilt));
      dummy.lookAt(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.06, 0.04, 0.1]} />
      <meshStandardMaterial color="#c8f6ff" emissive="#19E6E6" emissiveIntensity={0.8} />
    </instancedMesh>
  );
}

function AtlasNet({ region }: { region: string | null }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts: number[] = [];
    const city = STACK_REGIONS.find((r) => r.kind === "city")!;
    for (const r of STACK_REGIONS) {
      if (r.kind === "city") continue;
      const a = latLonToVec(r.lat, r.lon, EARTH_R + 0.03);
      const b = latLonToVec(city.lat, city.lon, EARTH_R + 0.03);
      pts.push(...a, ...b);
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={region === "agentropolis" ? "#FF2A2A" : "#19E6E6"} transparent opacity={0.55} />
    </lineSegments>
  );
}

function Pins({
  layer,
  region,
  onRegion,
  onEnterCity,
}: {
  layer: StackLayer;
  region: string | null;
  onRegion: (id: string) => void;
  onEnterCity: () => void;
}) {
  const showGov = layer === "grid" || layer === "city";
  const gov = showGov ? STACK_GOV.filter((g) => !region || region === "agentropolis" || g.regionId === region) : [];
  return (
    <group>
      {STACK_REGIONS.map((r) => {
        const p = latLonToVec(r.lat, r.lon, EARTH_R + 0.05);
        const hot = region === r.id;
        const city = r.kind === "city";
        return (
          <group key={r.id} position={p}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                if (city && layer === "city") onEnterCity();
                else onRegion(r.id);
              }}
            >
              <sphereGeometry args={[city ? 0.055 : 0.038, 12, 12]} />
              <meshStandardMaterial
                color={city ? "#FF2A2A" : "#19E6E6"}
                emissive={city ? "#FF2A2A" : "#19E6E6"}
                emissiveIntensity={hot ? 1.4 : 0.6}
              />
            </mesh>
            {layer !== "orbit" ? (
              <Html center distanceFactor={10} style={{ pointerEvents: "none" }}>
                <span className={city ? "stack-pin is-city" : "stack-pin"}>{r.name}</span>
              </Html>
            ) : null}
          </group>
        );
      })}
      {gov.map((g) => {
        const p = latLonToVec(g.lat, g.lon, EARTH_R + 0.09);
        return (
          <group key={g.id} position={p}>
            <mesh>
              <boxGeometry args={[0.04, 0.09, 0.04]} />
              <meshStandardMaterial color="#d8c48a" emissive="#19E6E6" emissiveIntensity={0.2} />
            </mesh>
            <Html center distanceFactor={12} style={{ pointerEvents: "none" }}>
              <span className="stack-pin is-gov">{g.name}</span>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function WorldQ({ gfx }: { gfx: CityGfx }) {
  const n = gfx === "high" ? 7 : 5;
  const cells = useMemo(() => {
    const out: { p: [number, number, number]; s: number; c: string }[] = [];
    for (let x = 0; x < n; x++) {
      for (let z = 0; z < n; z++) {
        const h = 0.12 + ((x * 3 + z * 5) % 5) * 0.08;
        out.push({
          p: [(x - (n - 1) / 2) * 0.42, -1.55 - h / 2, (z - (n - 1) / 2) * 0.42],
          s: h,
          c: (x + z) % 4 === 0 ? "#FF2A2A" : "#19E6E6",
        });
      }
    }
    return out;
  }, [n]);
  return (
    <group>
      {cells.map((c, i) => (
        <mesh key={i} position={c.p}>
          <boxGeometry args={[0.34, c.s, 0.34]} />
          <meshBasicMaterial color={c.c} wireframe transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function Stars({ count }: { count: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 14 + (i % 8);
      const a = (i * 1.7) % (Math.PI * 2);
      const b = ((i * 0.9) % Math.PI) - Math.PI / 2;
      pts[i * 3] = r * Math.cos(b) * Math.cos(a);
      pts[i * 3 + 1] = r * Math.sin(b);
      pts[i * 3 + 2] = r * Math.cos(b) * Math.sin(a);
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [count]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#9adfe8" size={0.03} sizeAttenuation />
    </points>
  );
}

export function WorldStackWorld({ layer, region, gfx, reduced, paused, onRegion, onEnterCity }: Props) {
  const busy = gfx === "high" || gfx === "medium";
  const dpr: [number, number] = gfx === "high" ? [1, 1.4] : [1, 1];
  return (
    <Canvas
      className="h-full w-full bg-transparent"
      camera={{ position: STACK_CAM[layer].pos, fov: STACK_CAM[layer].fov, near: 0.08, far: 80 }}
      dpr={dpr}
      gl={{ antialias: gfx === "high", alpha: false, powerPreference: "high-performance" }}
      frameloop={paused || reduced ? "demand" : "always"}
      onCreated={({ gl }) => {
        gl.setClearColor("#02040a", 1);
      }}
    >
      <CineLights stage="orbit" gfx={gfx} />
      <Stars count={busy ? 220 : 90} />
      <Earth gfx={gfx} layer={layer} />
      {layer === "orbit" || layer === "atlas" ? <Orbits busy={busy} reduced={reduced} /> : null}
      {layer === "orbit" || layer === "atlas" ? <Sats gfx={gfx} reduced={reduced} /> : null}
      {layer !== "orbit" && layer !== "worldq" ? <AtlasNet region={region} /> : null}
      {layer !== "worldq" ? (
        <Pins layer={layer} region={region} onRegion={onRegion} onEnterCity={onEnterCity} />
      ) : null}
      {layer === "worldq" || layer === "city" ? <WorldQ gfx={gfx} /> : null}
      <Rig layer={layer} reduced={reduced} />
    </Canvas>
  );
}
