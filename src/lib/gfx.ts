import type { ComputeWeight } from "@/lib/design-system";

/** Visual density follows compute weight. Models and information drop with it. */

export type CityGfx = "low" | "medium" | "high" | "map";
export type GfxTier = CityGfx;
export type MsGfx = CityGfx;

export function gfxForWeight(weight: ComputeWeight): CityGfx {
  switch (weight) {
    case "full":
      return "high";
    case "adaptive":
      return "medium";
    case "lite":
      return "low";
    case "minimum":
      return "map";
  }
}

export function weightForGfx(gfx: CityGfx): ComputeWeight {
  switch (gfx) {
    case "high":
      return "full";
    case "medium":
      return "adaptive";
    case "low":
      return "lite";
    case "map":
      return "minimum";
  }
}
