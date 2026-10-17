import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
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

function KeyListen() {
  const gl = useThree((state) => state.gl);
  const controls = useThree((state) => state.controls) as {
    listenToKeyEvents?: (element: HTMLElement) => void;
    stopListenToKeyEvents?: () => void;
  } | null;
  useEffect(() => {
    if (!controls?.listenToKeyEvents) return;
    controls.listenToKeyEvents(gl.domElement);
    return () => controls.stopListenToKeyEvents?.();
  }, [controls, gl]);
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
        camera={{ position: [0.6, 7.4, 3.2], fov: 48, near: 0.1, far: 180 }}
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
          scene.fog = new THREE.Fog(GRID_COLORS.obsidian, 20, 72);
          gl.domElement.tabIndex = 0;
          gl.domElement.style.outline = "none";
          (window as Window & { __gitCityCamera?: THREE.Camera }).__gitCityCamera = camera;
        }}
        onPointerMissed={() => onSelect(null)}
        className="h-full w-full"
        style={{ touchAction: "none", background: GRID_COLORS.obsidian }}
      >
        <LossWatch onLost={setLost} />
        <CineLights stage="city" gfx={low ? "low" : gfx === "high" ? "high" : "medium"} />
        <StreetBlock />
        <DistrictCity selected={selected} cols={cols} sides onSelect={(id) => onSelect(id)} />
        <OrbitControls
          makeDefault
          target={[0, 4.2, -20]}
          enableDamping
          dampingFactor={0.14}
          maxPolarAngle={Math.PI / 2.05}
          minPolarAngle={0.22}
          minDistance={8}
          maxDistance={64}
        />
        <KeyListen />
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
