import { GRID_COLORS } from "@/lib/design-system";
import type { CityGfx } from "@/lib/gfx";

/** Cinematic lighting bible. Night city. Motivated lights only. */

export type CineStage = "city" | "street" | "foil" | "campus" | "orbit";

export const CINE = {
  clear: GRID_COLORS.obsidian,
  fog: "#071018",
  fogFoil: "#08060e",
  sky: "#7aa9c4",
  ground: GRID_COLORS.obsidian,
  key: "#d7eaf4",
  fill: GRID_COLORS.cyan,
  rim: GRID_COLORS.red,
} as const;

export type CineRig = {
  exposure: number;
  fog: [string, number, number] | null;
  sky: string;
  ground: string;
  hemi: number;
  ambient: number;
  key: { position: [number, number, number]; intensity: number; color: string };
  fill: { position: [number, number, number]; intensity: number; color: string; distance: number } | null;
  rim: { position: [number, number, number]; intensity: number; color: string; distance: number } | null;
};

export function cineRig(stage: CineStage, gfx: CityGfx, inside = false): CineRig {
  const low = gfx === "low";
  const high = gfx === "high";
  const night = stage === "city" || stage === "foil" || stage === "orbit";
  const fog: CineRig["fog"] = night
    ? stage === "foil"
      ? [CINE.fogFoil, inside ? 8 : 14, inside ? 36 : 72]
      : stage === "orbit"
        ? ["#02040a", 12, 42]
        : [CINE.fog, inside ? 10 : 22, inside ? 48 : 110]
    : null;

  if (inside) {
    return {
      exposure: 0.92,
      fog,
      sky: CINE.sky,
      ground: CINE.ground,
      hemi: low ? 0.16 : 0.12,
      ambient: 0.05,
      key: { position: [2.2, 5.4, 3.4], intensity: low ? 0.45 : 0.62, color: CINE.key },
      fill: low ? null : { position: [0, 2.4, 1.6], intensity: 0.9, color: CINE.fill, distance: 12 },
      rim: { position: [-2.4, 2.2, -2.8], intensity: 0.7, color: CINE.rim, distance: 10 },
    };
  }

  return {
    exposure: stage === "foil" ? 0.98 : 0.94,
    fog,
    sky: CINE.sky,
    ground: CINE.ground,
    hemi: low ? 0.28 : high ? 0.16 : 0.2,
    ambient: low ? 0.12 : 0.05,
    key: {
      position: [-16, 22, 10],
      intensity: low ? 0.55 : high ? 1.05 : 0.82,
      color: CINE.key,
    },
    fill: low
      ? null
      : {
          position: [0, 5.2, 4],
          intensity: high ? 1.35 : 0.95,
          color: CINE.fill,
          distance: stage === "foil" ? 26 : 32,
        },
    rim: {
      position: [10, 3.8, -14],
      intensity: low ? 0.45 : high ? 1.15 : 0.8,
      color: CINE.rim,
      distance: stage === "foil" ? 20 : 28,
    },
  };
}
