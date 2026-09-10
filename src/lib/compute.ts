import { useEffect, useState } from "react";
import {
  COMPUTE_WEIGHTS,
  type ComputeWeight,
} from "@/lib/design-system";
import { gfxForWeight, type CityGfx } from "@/lib/gfx";

const KEY = "agentropolis.compute";

type NavConn = { saveData?: boolean; effectiveType?: string };

function connection(): NavConn | undefined {
  if (typeof navigator === "undefined") return;
  return (navigator as Navigator & { connection?: NavConn }).connection;
}

/** Conservative capability probe. No invented telemetry (no device temperature). */
export function detectCompute(): ComputeWeight {
  if (typeof window === "undefined") return "adaptive";
  const saveData = connection()?.saveData === true;
  const slow = connection()?.effectiveType === "2g" || connection()?.effectiveType === "slow-2g";
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 640px)").matches;
  const phone = coarse || narrow;

  if (saveData || slow) return "minimum";
  if (typeof mem === "number" && mem <= 2) return phone ? "minimum" : "lite";
  if (reduce && phone) return "lite";
  if (phone && cores <= 4) return "lite";
  if (phone) return "adaptive";
  if (reduce) return "adaptive";
  if (cores <= 4) return "adaptive";
  if (cores >= 8 && (mem === undefined || mem >= 8)) return "full";
  return "adaptive";
}

export function loadCompute(): ComputeWeight {
  try {
    const v = localStorage.getItem(KEY);
    if (v && (COMPUTE_WEIGHTS as readonly string[]).includes(v)) return v as ComputeWeight;
  } catch {
    /* private mode */
  }
  return detectCompute();
}

export function persistCompute(weight: ComputeWeight) {
  try {
    localStorage.setItem(KEY, weight);
  } catch {
    /* ignore */
  }
}

let current: ComputeWeight = "adaptive";
const listeners = new Set<() => void>();

function emit(weight: ComputeWeight) {
  current = weight;
  persistCompute(weight);
  if (typeof document !== "undefined") document.documentElement.dataset.compute = weight;
  listeners.forEach((fn) => fn());
}

export function getCompute() {
  return current;
}

export function setComputeWeight(weight: ComputeWeight) {
  if (weight === current) {
    if (typeof document !== "undefined") document.documentElement.dataset.compute = weight;
    return;
  }
  emit(weight);
}

export function useCompute(): [ComputeWeight, (w: ComputeWeight) => void, CityGfx] {
  const [weight, setWeight] = useState<ComputeWeight>(current);

  useEffect(() => {
    const next = loadCompute();
    setComputeWeight(next);
    setWeight(current);
    const sync = () => setWeight(current);
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  return [weight, setComputeWeight, gfxForWeight(weight)];
}
