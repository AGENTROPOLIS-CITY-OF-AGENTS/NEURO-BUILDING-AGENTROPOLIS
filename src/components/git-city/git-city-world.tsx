import { useEffect, useLayoutEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CineLights } from "@/components/cine-lights";
import { DistrictCity, StreetBlock } from "@/components/git-city/parts";
import { GRID_COLORS } from "@/lib/design-system";
import type { CityGfx } from "@/lib/gfx";
import { cineRig } from "@/lib/cine";

type Props = {
  selected: string | null;
  gfx: CityGfx;
  onSelect: (id: string | null) => void;
};

type Orbit = {
  target: THREE.Vector3;
  update: () => void;
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
};

/** Wide shots keep the whole loop in frame. Portrait shots sit over one street without entering it. */
function frameOf(aspect: number) {
  const wide = aspect >= 1;
  return {
    fov: wide ? 44 : 58,
    radius: wide ? 68 : 50,
    phi: wide ? 0.96 : 1.02,
    theta: wide ? 0.72 : 0.58,
    target: new THREE.Vector3(0, wide ? 2.4 : 3.2, wide ? 0 : -6),
    minDistance: wide ? 48 : 36,
    maxDistance: wide ? 90 : 64,
    minPolar: 0.58,
    maxPolar: wide ? 1.08 : 1.16,
  };
}

function applyFrame(camera: THREE.PerspectiveCamera, aspect: number, orbit: Orbit | null) {
  const frame = frameOf(aspect);
  camera.fov = frame.fov;
  const offset = new THREE.Vector3().setFromSpherical(new THREE.Spherical(frame.radius, frame.phi, frame.theta));
  camera.position.copy(frame.target).add(offset);
  camera.lookAt(frame.target);
  camera.updateProjectionMatrix();
  if (!orbit) return frame;
  orbit.target.copy(frame.target);
  orbit.minDistance = frame.minDistance;
  orbit.maxDistance = frame.maxDistance;
  orbit.minPolarAngle = frame.minPolar;
  orbit.maxPolarAngle = frame.maxPolar;
  orbit.update();
  return frame;
}

function DistrictFrame() {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const controls = useThree((state) => state.controls) as Orbit | null;
  const aspect = size.width / Math.max(1, size.height);
  useLayoutEffect(() => {
    applyFrame(camera, aspect, controls?.target ? controls : null);
  }, [aspect, camera, controls]);
  return null;
}

/** CineLights fogs the city at 22–110, which hides a district-wide shot. Hold a wider fade. */
function ReadableFog() {
  const scene = useThree((state) => state.scene);
  useFrame(() => {
    const fog = scene.fog;
    if (fog instanceof THREE.Fog && fog.far < 150) {
      fog.near = 84;
      fog.far = 176;
      fog.color.set(GRID_COLORS.obsidian);
    }
  });
  return null;
}

function KeyOrbit() {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const controls = useThree((state) => state.controls) as Orbit | null;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target !== gl.domElement || !controls?.target) return;
      const offset = camera.position.clone().sub(controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      const step = 0.1;
      if (event.code === "ArrowLeft") spherical.theta += step;
      else if (event.code === "ArrowRight") spherical.theta -= step;
      else if (event.code === "ArrowUp") spherical.phi -= step;
      else if (event.code === "ArrowDown") spherical.phi += step;
      else return;
      spherical.phi = Math.min(controls.maxPolarAngle, Math.max(controls.minPolarAngle, spherical.phi));
      spherical.radius = Math.min(controls.maxDistance, Math.max(controls.minDistance, spherical.radius));
      event.preventDefault();
      offset.setFromSpherical(spherical);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    };
    gl.domElement.addEventListener("keydown", onKey);
    return () => gl.domElement.removeEventListener("keydown", onKey);
  }, [camera, controls, gl]);
  return null;
}

function LossWatch({ onLost }: { onLost: (lost: boolean) => void }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const lose = (event: Event) => {
      event.preventDefault();
      onLost(true);
    };
    const restore = () => onLost(false);
    canvas.addEventListener("webglcontextlost", lose);
    canvas.addEventListener("webglcontextrestored", restore);
    return () => {
      canvas.removeEventListener("webglcontextlost", lose);
      canvas.removeEventListener("webglcontextrestored", restore);
    };
  }, [gl, onLost]);
  return null;
}

export function GitCityWorld({ selected, gfx, onSelect }: Props) {
  const [lost, setLost] = useState(false);
  const low = gfx === "low" || gfx === "map";
  const cols = gfx === "high" ? 4 : low ? 2 : 3;
  const rig = cineRig("city", low ? "low" : gfx === "high" ? "high" : "medium", false);

  return (
    <div
      className="relative h-full w-full"
      data-git-city
      data-forge-scene
      onPointerDown={(event) => {
        const canvas = event.currentTarget.querySelector("canvas");
        if (canvas instanceof HTMLCanvasElement) canvas.focus();
      }}
    >
      <Canvas
        camera={{ position: [42, 46, 38], fov: 44, near: 0.4, far: 280 }}
        dpr={low ? [1, 1] : [1, 1.4]}
        shadows={false}
        gl={{
          antialias: !low,
          alpha: false,
          powerPreference: low ? "low-power" : "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: rig.exposure,
        }}
        resize={{ offsetSize: true, scroll: false }}
        onCreated={({ gl, scene, camera }) => {
          gl.setClearColor(GRID_COLORS.obsidian, 1);
          scene.fog = new THREE.Fog(GRID_COLORS.obsidian, 84, 176);
          gl.domElement.tabIndex = 0;
          gl.domElement.style.outline = "none";
          (window as Window & { __gitCityCamera?: THREE.Camera }).__gitCityCamera = camera;
          if (camera instanceof THREE.PerspectiveCamera) {
            const aspect = gl.domElement.clientWidth / Math.max(1, gl.domElement.clientHeight);
            applyFrame(camera, aspect || 1.6, null);
          }
        }}
        onPointerMissed={() => onSelect(null)}
        className="h-full w-full"
        style={{ touchAction: "none", background: GRID_COLORS.obsidian }}
      >
        <LossWatch onLost={setLost} />
        <ReadableFog />
        <DistrictFrame />
        <CineLights stage="city" gfx={low ? "low" : gfx === "high" ? "high" : "medium"} />
        <StreetBlock horizon={gfx === "high" ? 28 : low ? 12 : 20} />
        <DistrictCity selected={selected} cols={cols} sides onSelect={(id) => onSelect(id)} />
        <OrbitControls
          makeDefault
          target={[0, 2.4, 0]}
          enablePan={false}
          enableDamping
          dampingFactor={0.12}
          maxPolarAngle={1.08}
          minPolarAngle={0.58}
          minDistance={48}
          maxDistance={90}
        />
        <KeyOrbit />
      </Canvas>
      <div
        data-forge-label
        className="pointer-events-none absolute bottom-24 left-3 z-10 rounded-sm bg-obsidian/80 px-2 py-1 font-mono text-2xs tracking-[0.16em] text-cyan"
      >
        PROTOTYPE · SIMULATED
      </div>
      {lost ? (
        <div
          data-gl-lost
          className="absolute inset-0 z-20 flex items-center justify-center bg-obsidian text-cyan"
        >
          <p className="font-mono text-xs tracking-[0.18em]">WEBGL CONTEXT LOST</p>
        </div>
      ) : null}
    </div>
  );
}
