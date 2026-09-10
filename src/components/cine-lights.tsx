import { cineRig, type CineStage } from "@/lib/cine";
import type { CityGfx } from "@/lib/gfx";

export function CineLights({
  stage,
  gfx,
  inside = false,
}: {
  stage: CineStage;
  gfx: CityGfx;
  inside?: boolean;
}) {
  const rig = cineRig(stage, gfx, inside);
  return (
    <>
      {rig.fog ? <fog attach="fog" args={rig.fog} /> : null}
      <hemisphereLight args={[rig.sky, rig.ground, rig.hemi]} />
      <ambientLight intensity={rig.ambient} />
      <directionalLight position={rig.key.position} intensity={rig.key.intensity} color={rig.key.color} />
      {rig.fill ? (
        <pointLight
          position={rig.fill.position}
          intensity={rig.fill.intensity}
          color={rig.fill.color}
          distance={rig.fill.distance}
          decay={2}
        />
      ) : null}
      {rig.rim ? (
        <pointLight
          position={rig.rim.position}
          intensity={rig.rim.intensity}
          color={rig.rim.color}
          distance={rig.rim.distance}
          decay={2}
        />
      ) : null}
    </>
  );
}
