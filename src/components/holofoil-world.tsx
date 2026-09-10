import { Suspense, useEffect, useMemo, useRef, type ComponentRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { HOLOFOIL_BUILDINGS } from "@/lib/destinations";
import type { CityGfx } from "@/lib/gfx";
import { Elevator } from "@/components/elevator";
import { CineLights } from "@/components/cine-lights";
import { CINE, cineRig } from "@/lib/cine";

type Props = {
  focus: string | null;
  inside: string | null;
  gfx: CityGfx;
  onFocus: (id: string | null) => void;
  onEnter: (id: string) => void;
};

const HOME: [number, number, number] = [0.4, 3.2, 16.5];
const HOME_LOOK: [number, number, number] = [0, 4.2, -8];

const WINDOW_VERT = /* glsl */ `
varying vec3 vWorld;
varying vec3 vN;
void main() {
  #ifdef USE_INSTANCING
    vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix * instanceMatrix) * normal);
  #else
    vec4 world = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
  #endif
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const WINDOW_FRAG = /* glsl */ `
varying vec3 vWorld;
varying vec3 vN;
uniform vec3 uGlow;
uniform float uAmp;
void main() {
  if (abs(vN.y) > 0.62) {
    gl_FragColor = vec4(0.04, 0.03, 0.06, 1.0);
    return;
  }
  float lateral = abs(vN.x) > 0.55 ? vWorld.z : vWorld.x;
  vec2 grid = vec2(lateral * 2.8, vWorld.y * 2.3);
  vec2 id = floor(grid);
  vec2 f = fract(grid);
  float n = fract(sin(dot(id, vec2(12.9898, 78.233))) * 43758.5453);
  float pane = step(0.16, f.x) * step(0.18, f.y) * step(f.x, 0.84) * step(f.y, 0.80);
  vec3 glass = vec3(0.04, 0.03, 0.07);
  vec3 lamp = mix(uGlow, vec3(1.0, 0.45, 0.75), step(0.78, n)) * (0.5 + n * 0.8) * uAmp;
  vec3 col = mix(glass, lamp, pane * step(0.34, n));
  gl_FragColor = vec4(col, 1.0);
}
`;

function WindowMaterial({ glow = "#9cefff", amp = 1 }: { glow?: string; amp?: number }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uGlow: { value: new THREE.Color(glow) },
          uAmp: { value: amp },
        },
        vertexShader: WINDOW_VERT,
        fragmentShader: WINDOW_FRAG,
      }),
    [],
  );
  useEffect(() => {
    (mat.uniforms.uGlow.value as THREE.Color).set(glow);
    mat.uniforms.uAmp.value = amp;
  }, [amp, glow, mat]);
  useEffect(() => () => mat.dispose(), [mat]);
  return <primitive object={mat} attach="material" />;
}

export function HolofoilWorld({ focus, inside, gfx, onFocus, onEnter }: Props) {
  const rig = cineRig("foil", gfx, Boolean(inside));
  return (
    <Canvas
      camera={{ position: HOME, fov: 50, near: 0.12, far: 140 }}
      dpr={gfx === "low" ? [1, 1] : [1, 1.35]}
      gl={{
        antialias: gfx !== "low",
        alpha: false,
        powerPreference: gfx === "low" ? "low-power" : "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: rig.exposure,
      }}
      resize={{ offsetSize: true, scroll: false }}
      onCreated={({ gl }) => {
        gl.setClearColor(CINE.clear, 1);
      }}
      onPointerMissed={() => {
        if (!inside) onFocus(null);
      }}
      className="h-full w-full"
      style={{ touchAction: "none", background: CINE.clear }}
    >
      <CineLights stage="foil" gfx={gfx} inside={Boolean(inside)} />
      <Suspense fallback={null}>
        <Ground />
        {inside ? (
          <Room id={inside} />
        ) : (
          <>
            <Plaza />
            {HOLOFOIL_BUILDINGS.map((b) => (
              <Tower
                key={b.id}
                b={b}
                active={focus === b.id}
                onFocus={onFocus}
                onEnter={onEnter}
              />
            ))}
          </>
        )}
      </Suspense>
      <Rig focus={focus} inside={inside} />
    </Canvas>
  );
}

function Ground() {
  const plaza = useTexture("/media/stills/octane/foil-plaza.jpg");
  plaza.colorSpace = THREE.SRGBColorSpace;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#121018" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -2]}>
        <circleGeometry args={[9.5, 48]} />
        <meshStandardMaterial map={plaza} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Plaza() {
  const card = useTexture("/media/stills/octane/foil-card.jpg");
  card.colorSpace = THREE.SRGBColorSpace;
  const spin = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.45;
  });
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[3.8, 4.05, 48]} />
        <meshBasicMaterial color="#22e8ff" />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.35, 0.55, 1.1, 8]} />
        <meshStandardMaterial color="#16141c" metalness={0.9} roughness={0.18} emissive="#22e8ff" emissiveIntensity={0.35} />
      </mesh>
      <mesh ref={spin} position={[0, 2.35, 0]}>
        <planeGeometry args={[1.05, 1.5]} />
        <meshPhysicalMaterial map={card} metalness={0.95} roughness={0.08} emissive="#331144" emissiveIntensity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Tower({
  b,
  active,
  onFocus,
  onEnter,
}: {
  b: (typeof HOLOFOIL_BUILDINGS)[number];
  active: boolean;
  onFocus: (id: string | null) => void;
  onEnter: (id: string) => void;
}) {
  const tap = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (active) onEnter(b.id);
    else onFocus(b.id);
  };
  return (
    <group position={[b.x, 0, b.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} onClick={tap}>
        <circleGeometry args={[Math.max(b.w, b.depth) * 0.72, 24]} />
        <meshBasicMaterial color={b.glow} transparent opacity={active ? 0.5 : 0.1} />
      </mesh>
      <group
        onClick={tap}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEnter(b.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[b.w * 1.1, 1, b.depth * 1.1]} />
          <meshStandardMaterial color="#141018" metalness={0.78} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1 + (b.h - 1) / 2, 0]}>
          <boxGeometry args={[b.w, b.h - 1, b.depth]} />
          <WindowMaterial glow={b.glow} amp={active ? 1.5 : 1.05} />
        </mesh>
        <mesh position={[0, b.h + 0.18, 0]}>
          <boxGeometry args={[b.w * 0.72, 0.36, b.depth * 0.72]} />
          <meshStandardMaterial color="#0c0a10" metalness={0.9} roughness={0.2} emissive={b.glow} emissiveIntensity={0.85} />
        </mesh>
        <Elevator active={active} glow={b.glow} onEnter={() => onEnter(b.id)} facadeZ={b.depth / 2} />
      </group>
      {active ? (
        <Html position={[0, b.h + 1.4, 0]} center distanceFactor={22} zIndexRange={[18, 0]} style={{ pointerEvents: "none" }}>
          <div className="city-pin">
            <span className="city-pin-code">{b.code}</span>
            <span className="city-pin-name">{b.name}</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function Room({ id }: { id: string }) {
  const b = HOLOFOIL_BUILDINGS.find((x) => x.id === id) ?? HOLOFOIL_BUILDINGS[0]!;
  const card = useTexture("/media/stills/octane/foil-card.jpg");
  card.colorSpace = THREE.SRGBColorSpace;
  const spin = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.7;
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 18]} />
        <meshStandardMaterial color="#121018" metalness={0.78} roughness={0.22} />
      </mesh>
      <mesh position={[0, 2.2, -8.4]}>
        <planeGeometry args={[16, 4.4]} />
        <meshStandardMaterial color="#1a1420" metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[-7.8, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[18, 4.4]} />
        <meshStandardMaterial color="#141018" />
      </mesh>
      <mesh position={[7.8, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[18, 4.4]} />
        <meshStandardMaterial color="#141018" />
      </mesh>
      <mesh position={[0, 4.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 18]} />
        <meshStandardMaterial color="#0a0810" />
      </mesh>

      <mesh position={[0, 0.74, -1.4]}>
        <boxGeometry args={[5.8, 0.1, 2.2]} />
        <meshStandardMaterial color="#1c1824" metalness={0.92} roughness={0.12} />
      </mesh>

      {id === "dex" ? (
        [-2.4, -0.8, 0.8, 2.4].map((x, i) =>
          [1.4, 2.2, 3.0].map((y) => (
            <mesh key={`${x}-${y}`} position={[x, y, -8.2]}>
              <planeGeometry args={[0.7, 1.0]} />
              <meshPhysicalMaterial map={card} metalness={0.95} roughness={0.1} emissive={i % 2 ? "#22e8ff" : "#ff2a4a"} emissiveIntensity={0.25} />
            </mesh>
          )),
        )
      ) : (
        <group ref={spin} position={[0, 2.15, -1.2]}>
          <mesh>
            <planeGeometry args={[id === "studio" || id === "stage" ? 1.6 : 1.05, id === "studio" || id === "stage" ? 2.28 : 1.5]} />
            <meshPhysicalMaterial map={card} metalness={0.95} roughness={0.08} emissive="#402060" emissiveIntensity={0.55} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {id === "story" || id === "sdk" || id === "topology" || id === "skills"
        ? [-3, 0, 3].map((x) => (
            <mesh key={x} position={[x, 2.3, -8.25]}>
              <planeGeometry args={[2.4, 1.5]} />
              <meshBasicMaterial color={b.glow} transparent opacity={0.35} />
            </mesh>
          ))
        : null}

      <Html position={[0, 3.35, -8.1]} center distanceFactor={12} style={{ pointerEvents: "none" }}>
        <div className="city-board">
          <p>{b.name}</p>
          <span>{b.work}</span>
        </div>
      </Html>

      <Operator position={[-1.7, 0, 0.5]} hue={b.glow} />
      <Operator position={[1.6, 0, 0.3]} hue="#22e8ff" />
      <Operator position={[0.2, 0, 1.7]} hue="#ff2a4a" />
      <pointLight position={[0, 2.6, 0]} color={b.glow} intensity={0.95} distance={10} decay={2} />
    </group>
  );
}

function Operator({ position, hue }: { position: [number, number, number]; hue: string }) {
  const arm = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (arm.current) arm.current.rotation.x = Math.sin(state.clock.elapsedTime * 3.2) * 0.25 - 0.4;
  });
  return (
    <group position={position}>
      <mesh position={[0, 1.02, 0]}>
        <capsuleGeometry args={[0.2, 0.76, 8, 16]} />
        <meshStandardMaterial color="#0c0a12" metalness={0.82} roughness={0.16} emissive={hue} emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[0, 1.64, 0.04]}>
        <sphereGeometry args={[0.17, 24, 16]} />
        <meshStandardMaterial color="#05060a" metalness={0.88} roughness={0.12} emissive={hue} emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={arm} position={[0.28, 1.12, 0.12]}>
        <capsuleGeometry args={[0.05, 0.38, 6, 8]} />
        <meshStandardMaterial color="#0c0a12" metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Rig({ focus, inside }: { focus: string | null; inside: string | null }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const flying = useRef(false);
  const goal = useRef(new THREE.Vector3(...HOME));
  const look = useRef(new THREE.Vector3(...HOME_LOOK));

  useEffect(() => {
    if (inside) {
      goal.current.set(0, 1.7, 6.2);
      look.current.set(0, 1.4, -2);
      flying.current = true;
      return;
    }
    const b = focus ? HOLOFOIL_BUILDINGS.find((x) => x.id === focus) : null;
    if (b) {
      goal.current.set(b.x, 2.45, b.z + Math.max(7.2, b.depth + 5));
      look.current.set(b.x, 2.6, b.z);
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
    } | null;
    if (!ctrl) return;
    if (flying.current) {
      ctrl.object.position.lerp(goal.current, 1 - Math.exp(-d * 3.1));
      ctrl.target.lerp(look.current, 1 - Math.exp(-d * 3.1));
      ctrl.update();
      if (ctrl.object.position.distanceTo(goal.current) < 0.16) flying.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minPolarAngle={inside ? 0.7 : 1.02}
      maxPolarAngle={inside ? Math.PI / 1.9 : Math.PI / 2.08}
      minDistance={inside ? 1.4 : 5}
      maxDistance={inside ? 12 : 32}
      onStart={() => {
        flying.current = false;
      }}
    />
  );
}
