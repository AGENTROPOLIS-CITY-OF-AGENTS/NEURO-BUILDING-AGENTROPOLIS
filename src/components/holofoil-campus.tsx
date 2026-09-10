import { useEffect, useState, type ComponentType } from "react";
import { HOLOFOIL_BUILDINGS } from "@/lib/destinations";
import type { CityGfx } from "@/lib/gfx";
import { useCompute } from "@/lib/compute";
import { ComputeDock } from "@/components/grid-chrome";
import { cn } from "@/lib/utils";

type WorldProps = {
  focus: string | null;
  inside: string | null;
  gfx: CityGfx;
  onFocus: (id: string | null) => void;
  onEnter: (id: string) => void;
};

export function HolofoilCampus({ onClose }: { onClose: () => void }) {
  const [World, setWorld] = useState<ComponentType<WorldProps> | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [inside, setInside] = useState<string | null>(null);
  const [compute, setCompute, gfx] = useCompute();
  const room = HOLOFOIL_BUILDINGS.find((b) => b.id === inside);

  useEffect(() => {
    if (compute === "minimum") {
      setWorld(null);
      return;
    }
    let alive = true;
    void import("@/components/holofoil-world").then((mod) => {
      if (alive) setWorld(() => mod.HolofoilWorld);
    });
    return () => {
      alive = false;
    };
  }, [compute]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      if (inside) {
        setInside(null);
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [inside, onClose]);

  return (
    <div data-holofoil-campus className="absolute inset-0 z-40 bg-obsidian">
      <div className="absolute inset-0">
        {World ? (
          <World
            focus={focus}
            inside={inside}
            gfx={gfx}
            onFocus={setFocus}
            onEnter={(id) => {
              setFocus(id);
              setInside(id);
            }}
          />
        ) : (
          <div className="flex h-full flex-col gap-2 overflow-y-auto px-4 pt-24 pb-28">
            <p className="font-mono text-2xs tracking-[0.16em] text-mute uppercase">MIN · same buildings, 2D weight</p>
            {HOLOFOIL_BUILDINGS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setFocus(b.id);
                  setInside(b.id);
                }}
                className={cn(
                  "flex h-14 items-center justify-between rounded-md px-4 text-left shadow-[var(--shadow-border)]",
                  focus === b.id ? "text-cyan" : "text-mute hover:text-cyan",
                )}
              >
                <span className="font-display text-sm font-semibold">{b.name}</span>
                <span className="font-mono text-2xs">{b.status}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-start justify-between gap-3 bg-gradient-to-b from-obsidian/80 to-transparent px-4 py-3 sm:px-6">
        <div className="pointer-events-auto min-w-0">
          <p className="os-wordmark font-display text-sm font-semibold tracking-[0.22em] sm:text-base">HOLOFOIL</p>
          <p className="text-2xs tracking-[0.16em] text-cyan uppercase">Deterministic material system · no mint · no wallet</p>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <a
            href="https://holofoil.grok.me"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-md px-3 font-mono text-2xs tracking-[0.14em] text-cyan shadow-[var(--shadow-border)]"
          >
            LIVE
          </a>
          <ComputeDock value={compute} onChange={setCompute} className="pointer-events-auto" />
          <button
            type="button"
            onClick={() => {
              if (inside) setInside(null);
              else onClose();
            }}
            className="h-11 px-3 text-2xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
          >
            {inside ? "Leave room" : "Back to city"}
          </button>
        </div>
      </header>

      {inside && room ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 z-50 flex justify-center px-4">
          <p className="max-w-xl text-center font-mono text-2xs tracking-[0.14em] text-cyan">{room.work}</p>
        </div>
      ) : (
        <nav
          aria-label="Holofoil buildings"
          className="absolute inset-x-0 bottom-16 z-50 flex justify-center px-2"
        >
          <div className="hero-dock">
            {HOLOFOIL_BUILDINGS.map((b) => (
              <button
                key={b.id}
                type="button"
                data-foil={b.id}
                onClick={() => {
                  setFocus(b.id);
                }}
                onDoubleClick={() => {
                  setFocus(b.id);
                  setInside(b.id);
                }}
                className={cn("hero-chip", focus === b.id && "is-on")}
              >
                {b.code}
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
