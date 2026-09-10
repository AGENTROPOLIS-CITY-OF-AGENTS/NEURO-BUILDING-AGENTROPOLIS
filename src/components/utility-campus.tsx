import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import {
  BUILDING_META,
  CAMPUS_SPRITE_NOTE,
  DISTRICT_LIST,
  ENGINE_ACTIONS,
  ENGINE_CAPS,
  ENGINE_CONSUMERS,
  UTILITY_BUILDINGS,
  UTILITY_FLAGS,
  UTILITY_TABS,
} from "@/lib/destinations";
import { cn } from "@/lib/utils";
import type { GfxTier } from "@/lib/gfx";
import { useCompute } from "@/lib/compute";
import { weightForGfx } from "@/lib/gfx";
import { ThresholdPortal } from "@/components/threshold-portal";

type WorldProps = {
  focus: string | null;
  inside: string | null;
  gfx: GfxTier;
  paused: boolean;
  onFocus: (id: string | null) => void;
  onEnter: (id: string) => void;
  onAgent: () => void;
};

const IDLE_NEURO = "NEURO: Campus is operational. Select an agent or a building. Agents are MOCK.";
const AGENT_NEURO = "NEURO: Mock agent selected. Stick figures are MOCK bodies. No live agent is on this floor.";
const CALM_POSTER = "/media/stills/origin-ios.jpg";

type Artifact = {
  consumer: string;
  capability: string;
  prompt: string;
};

export function UtilityCampus({
  focus,
  onFocus,
  onClose,
}: {
  focus: string | null;
  onFocus: (id: string | null) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<(typeof UTILITY_TABS)[number]["id"]>("campus");
  const [World, setWorld] = useState<ComponentType<WorldProps> | null>(null);
  const [neuro, setNeuro] = useState(IDLE_NEURO);
  const [inside, setInside] = useState<string | null>(null);
  const [hideStatus, setHideStatus] = useState(false);
  const [hideDistrict, setHideDistrict] = useState(false);
  const [compute, setCompute, gfx] = useCompute();
  const [paused, setPaused] = useState(false);
  const [action, setAction] = useState<string>("create");
  const [consumer, setConsumer] = useState<string>("creator-construction");
  const [capability, setCapability] = useState<string>("image.generate");
  const [prompt, setPrompt] = useState("");
  const [budget] = useState(10);
  const [artifact, setArtifact] = useState<Artifact | null>(null);

  useEffect(() => {
    if (compute === "minimum") {
      setWorld(null);
      return;
    }
    let alive = true;
    void import("@/components/campus-world").then((mod) => {
      if (alive) setWorld(() => mod.CampusWorld);
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
  }, [onClose, inside]);

  const building = useMemo(
    () => UTILITY_BUILDINGS.find((b) => b.id === (inside ?? focus)) ?? null,
    [focus, inside],
  );

  useEffect(() => {
    if (inside) {
      const b = UTILITY_BUILDINGS.find((item) => item.id === inside);
      setNeuro(BUILDING_META[inside]?.interior ? `NEURO: ${BUILDING_META[inside].interior}` : (b?.neuro ?? IDLE_NEURO));
      return;
    }
    if (building) setNeuro(building.neuro);
    else setNeuro(IDLE_NEURO);
  }, [building, inside]);

  const enter = (id: string) => {
    onFocus(id);
    setInside(id);
    setHideDistrict(true);
  };

  const exitInside = () => {
    setInside(null);
    setTab("campus");
    setHideDistrict(false);
  };

  const runAction = (id: string) => {
    setAction(id);
    const spec = ENGINE_ACTIONS.find((a) => a.id === id);
    if (spec) setNeuro(spec.neuro);
    if (id === "generate") {
      setArtifact({ consumer, capability, prompt: prompt || "Mock artifact. Provider sealed." });
    }
    if (id === "inspect" && building) {
      onFocus("lens");
      if (inside) setInside("lens");
    }
    if (id === "repair") {
      onFocus("repair");
      if (inside) setInside("repair");
    }
    if (id === "approve") {
      onFocus("approval");
      if (inside) setInside("approval");
    }
    if (id === "onchain") {
      onFocus("onchain");
      if (inside) setInside("onchain");
    }
  };

  const showEngine = tab === "engine";
  const mapMode = gfx === "map";

  return (
    <div data-campus data-inside={inside ?? ""} className="absolute inset-0 z-[55] flex flex-col bg-obsidian text-paper">
      <header className="relative z-20 shrink-0 border-b border-line/50 bg-obsidian/40 px-3 py-1.5 backdrop-blur-2xl sm:px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-campus-exit
            onClick={onClose}
            className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-obsidian/55 px-3 font-display text-2xs font-semibold tracking-[0.16em] text-cyan shadow-[var(--shadow-border)] hover:text-paper"
            aria-label="Return to city"
          >
            UG
          </button>
          <div className="min-w-0 flex-1">
            <img
              src="/media/stills/origin-engine.jpg?v=3"
              alt="Origin Engine"
              data-origin-engine
              className="origin-engine-lockup h-8 w-auto max-w-[min(58vw,300px)] object-contain object-left sm:h-9"
            />
            <p className="truncate font-mono text-2xs tracking-[0.12em] text-mute uppercase">Origin Engine · M1 · working build</p>
          </div>
          <img
            src="/media/stills/botbae-live.jpg"
            alt="BOTBAE LIVE"
            data-botbae-live
            className="size-9 rounded-full ring-1 ring-pink/55"
          />
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <nav className="flex gap-1" aria-label="Origin Engine sections">
            {UTILITY_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                data-campus-tab={item.id}
                onClick={() => {
                  setTab(item.id);
                  if (item.id === "campus") setInside(null);
                }}
                className={cn(
                  "h-10 rounded-full px-4 text-2xs font-medium tracking-[0.14em] uppercase transition-colors duration-150",
                  tab === item.id ? "bg-cyan text-obsidian" : "text-paper shadow-[var(--shadow-border)] hover:text-cyan",
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setHideStatus((v) => !v)}
            className="h-10 rounded-full px-3 text-2xs tracking-[0.12em] text-mute uppercase shadow-[var(--shadow-border)] hover:text-paper"
          >
            {hideStatus ? "Show status" : "Hide status"}
          </button>
          <button
            type="button"
            data-reset-view
            onClick={() => {
              setInside(null);
              onFocus(null);
              setTab("campus");
            }}
            className="h-10 rounded-full px-3 text-2xs tracking-[0.12em] text-mute uppercase shadow-[var(--shadow-border)] hover:text-paper"
          >
            Reset view
          </button>
          <label className="ml-auto flex h-10 items-center gap-2 rounded-full px-3 text-2xs tracking-[0.12em] text-mute uppercase shadow-[var(--shadow-border)]">
            GFX
            <select
              data-gfx
              value={gfx}
              onChange={(e) => setCompute(weightForGfx(e.target.value as GfxTier))}
              className="bg-transparent text-paper outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="map">2.50</option>
            </select>
          </label>
        </div>
        {hideStatus ? null : (
          <ul className="mt-1.5 flex gap-1.5 overflow-x-auto pb-1">
            {UTILITY_FLAGS.map((f) => (
              <li key={f.id}>
                <span
                  data-campus-flag={f.id}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3 font-mono text-2xs tracking-[0.12em]",
                    f.id === "grid" && "text-lime shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-lime)_55%,transparent)]",
                    f.id === "botbae" && "text-pink shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-pink)_50%,transparent)]",
                    f.id === "regis" && "text-lilac shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-lilac)_45%,transparent)]",
                    f.id !== "grid" && f.id !== "regis" && f.id !== "botbae" && f.tone === "mock" && "text-mute shadow-[var(--shadow-border)]",
                    f.tone === "deny" && "text-red shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-red)_45%,transparent)]",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      f.id === "grid" && "bg-lime",
                      f.id === "botbae" && "bg-pink",
                      f.id === "regis" && "bg-lilac",
                      f.tone === "mock" && f.id !== "regis" && "bg-mute",
                      f.tone === "deny" && "bg-red",
                    )}
                  />
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="relative min-h-0 flex-1">
        <img
          className="origin-ios-video pointer-events-none absolute inset-0 h-full w-full object-cover"
          src={CALM_POSTER}
          alt=""
          aria-hidden
        />
        <div className={cn("pointer-events-none absolute inset-0", inside ? "bg-obsidian/70" : "bg-obsidian/40")} />

        {mapMode ? (
          <MapLayer
            focus={inside ?? focus}
            onPick={(id) => {
              onFocus(id);
              setTab("campus");
            }}
          />
        ) : (
          <div data-campus-stage className="absolute inset-0">
            {World ? (
              <World
                focus={focus}
                inside={inside}
                gfx={gfx}
                paused={paused}
                onFocus={(id) => {
                  setTab("campus");
                  onFocus(id);
                }}
                onEnter={enter}
                onAgent={() => {
                  setTab("campus");
                  setNeuro(AGENT_NEURO);
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="font-mono text-2xs tracking-[0.16em] text-mute uppercase">Loading campus · mock</p>
              </div>
            )}
          </div>
        )}

        {tab === "campus" && !inside && !mapMode ? (
          <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-start px-3 md:hidden">
            <div className="pointer-events-auto flex max-w-full gap-1 overflow-x-auto pb-1">
              {DISTRICT_LIST.map((id) => {
                const b = UTILITY_BUILDINGS.find((item) => item.id === id);
                if (!b) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    data-building={id}
                    onClick={() => onFocus(id)}
                    className={cn(
                      "h-10 shrink-0 rounded-full px-3 text-2xs tracking-[0.1em] uppercase shadow-[var(--shadow-border)] backdrop-blur-md",
                      focus === id ? "bg-cyan text-obsidian" : "bg-obsidian/55 text-paper",
                    )}
                  >
                    {b.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {!hideDistrict && !showEngine && !inside ? (
          <aside
            data-district-panel
            className="ios-glass absolute top-3 right-3 bottom-24 z-20 hidden w-64 flex-col overflow-hidden rounded-2xl md:flex"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <p className="font-mono text-2xs tracking-[0.16em] text-cyan uppercase">District</p>
              <button
                type="button"
                onClick={() => setHideDistrict(true)}
                className="h-9 rounded-full px-3 text-2xs tracking-[0.12em] text-mute uppercase hover:text-paper"
              >
                Hide
              </button>
            </div>
            <Radar focus={inside ?? focus} />
            <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
              {DISTRICT_LIST.map((id) => {
                const b = UTILITY_BUILDINGS.find((item) => item.id === id);
                if (!b) return null;
                const live = b.status === "LIVE";
                const on = (inside ?? focus) === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      data-building={id}
                      onClick={() => {
                        onFocus(id);
                        setInside(null);
                      }}
                      className={cn(
                        "flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-2xs tracking-[0.1em] uppercase",
                        on ? "bg-cyan/15 text-cyan" : "text-paper hover:text-cyan",
                      )}
                    >
                      <span>{b.name}</span>
                      {live ? <span className="font-mono text-2xs text-lime">LIVE</span> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-line/60 px-3 py-2">
              <p className="font-mono text-2xs tracking-[0.16em] text-mute uppercase">Selection</p>
              <p className="mt-1 text-xs text-paper">{building ? building.name : "Select a building to see agents and jobs."}</p>
              <p className="mt-1 text-2xs leading-relaxed text-dim">
                {building ? (BUILDING_META[building.id]?.role ?? building.note) : "Agents holding station."}
              </p>
            </div>
          </aside>
        ) : null}

        {hideDistrict && !showEngine ? (
          <button
            type="button"
            onClick={() => setHideDistrict(false)}
            className="ios-glass absolute top-3 right-3 z-20 hidden h-10 rounded-full px-4 text-2xs tracking-[0.14em] text-cyan uppercase md:block"
          >
            District
          </button>
        ) : null}

        {showEngine ? (
          <aside
            data-engine-panel
            className="ios-glass absolute inset-x-3 top-3 z-20 flex max-h-[78%] flex-col overflow-hidden rounded-2xl md:inset-x-auto md:top-3 md:right-3 md:bottom-24 md:max-h-none md:w-80"
          >
            <div className="px-4 pt-4">
              <img
                src="/media/stills/origin-engine.jpg?v=3"
                alt="Origin Engine"
                className="origin-engine-lockup mx-auto h-10 w-auto max-w-full object-contain"
              />
              <p className="mt-2 text-center font-mono text-2xs tracking-[0.18em] text-pink uppercase">AGENTROPOLIS</p>
              <p className="mt-3 font-mono text-2xs tracking-[0.14em] text-cyan uppercase">
                Enter building · {building?.name ?? "Generation Studio"} · MOCK
              </p>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1 px-3">
              {ENGINE_ACTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-engine-action={item.id}
                  onClick={() => runAction(item.id)}
                  className={cn(
                    "min-h-11 rounded-xl px-1 text-center text-2xs tracking-[0.08em] uppercase",
                    item.deny
                      ? "text-red shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-red)_45%,transparent)]"
                      : action === item.id
                        ? "bg-cyan text-obsidian"
                        : "text-paper shadow-[var(--shadow-border)] hover:text-cyan",
                  )}
                >
                  <span className="block font-mono text-2xs opacity-70">{item.n}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-3 border-y border-line/50 px-4 py-3">
              <p className="font-mono text-2xs tracking-[0.14em] text-mute uppercase">
                Origin Engine // {artifact ? "Mock artifact" : "Ungenerated artifact"}
              </p>
              <p className="mt-1 text-2xs leading-relaxed text-dim">
                {artifact
                  ? `${artifact.capability} · ${artifact.consumer}. Mock provider. No publish.`
                  : "No artifact yet. Create a brief, then generate."}
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              <p className="font-mono text-2xs tracking-[0.16em] text-cyan uppercase">Brief</p>
              <h2 className="mt-1 font-display text-base font-semibold tracking-[0.08em]">Create and generate</h2>
              <label className="mt-3 block font-mono text-2xs tracking-[0.12em] text-mute uppercase">
                Consumer
                <select
                  value={consumer}
                  onChange={(e) => setConsumer(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl bg-obsidian/60 px-3 text-xs text-paper shadow-[var(--shadow-border)] outline-none"
                >
                  {ENGINE_CONSUMERS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-3 block font-mono text-2xs tracking-[0.12em] text-mute uppercase">
                Capability
                <select
                  value={capability}
                  onChange={(e) => setCapability(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl bg-obsidian/60 px-3 text-xs text-paper shadow-[var(--shadow-border)] outline-none"
                >
                  {ENGINE_CAPS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-3 block font-mono text-2xs tracking-[0.12em] text-mute uppercase">
                Prompt
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the artifact. Mock provider only."
                  className="mt-1 h-20 w-full resize-none rounded-xl bg-obsidian/60 px-3 py-2 text-xs text-paper shadow-[var(--shadow-border)] outline-none placeholder:text-dim"
                />
              </label>
              <p className="mt-3 font-mono text-2xs tracking-[0.12em] text-mute uppercase">Budget XENTS · {budget}</p>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  data-generate-mock
                  onClick={() => runAction("generate")}
                  className="h-11 rounded-xl bg-cyan text-2xs font-medium tracking-[0.12em] text-obsidian uppercase"
                >
                  Generate mock
                </button>
                <button type="button" onClick={() => runAction("repair")} className="h-11 rounded-xl text-2xs tracking-[0.12em] uppercase shadow-[var(--shadow-border)]">
                  Repair
                </button>
                <button type="button" onClick={() => runAction("approve")} className="h-11 rounded-xl bg-lilac/20 text-2xs tracking-[0.12em] text-lilac uppercase">
                  Approve
                </button>
                <button type="button" onClick={() => runAction("provenance")} className="h-11 rounded-xl text-2xs tracking-[0.12em] uppercase shadow-[var(--shadow-border)]">
                  Provenance
                </button>
                <button type="button" onClick={() => runAction("export")} className="h-11 rounded-xl text-2xs tracking-[0.12em] uppercase shadow-[var(--shadow-border)]">
                  Export local
                </button>
                <button
                  type="button"
                  data-onchain-deny
                  onClick={() => runAction("onchain")}
                  className="h-11 rounded-xl text-2xs tracking-[0.12em] text-red uppercase shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-red)_45%,transparent)]"
                >
                  Onchain issue
                </button>
              </div>
              <button
                type="button"
                data-pause-agents
                onClick={() => setPaused((v) => !v)}
                className="mt-1.5 h-11 w-full rounded-xl text-2xs tracking-[0.12em] uppercase shadow-[var(--shadow-border)]"
              >
                {paused ? "Resume agents" : "Pause agents"}
              </button>
              <p className="mt-3 text-2xs leading-relaxed text-red">
                On-chain issue is denied in Milestone 1. No mint, no publish, no paid credits.
              </p>
            </div>
          </aside>
        ) : null}

        {building && !inside ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-28 z-20 flex justify-center px-3 md:bottom-8">
            <ThresholdPortal label="Enter" onClick={() => enter(building.id)} className="pointer-events-auto" data-enter-building="" />
          </div>
        ) : null}

        {inside ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-28 z-20 flex justify-center px-3 md:bottom-8">
            <button
              type="button"
              data-exit-building
              onClick={exitInside}
              className="pointer-events-auto h-12 rounded-full bg-obsidian/80 px-6 text-xs font-medium tracking-[0.16em] text-cyan uppercase shadow-[var(--shadow-border)] backdrop-blur-xl"
            >
              Exit building
            </button>
          </div>
        ) : null}

        <div className="pointer-events-none absolute bottom-3 left-3 z-20 max-w-sm rounded-2xl bg-obsidian/55 px-3 py-2 shadow-[var(--shadow-border)] backdrop-blur-2xl sm:bottom-4 sm:left-4">
          <p className="font-mono text-2xs tracking-[0.18em] text-cyan uppercase">NEURO</p>
          <p className="mt-1 text-2xs leading-relaxed text-paper">{neuro}</p>
        </div>
      </div>

      <p className="sr-only">{CAMPUS_SPRITE_NOTE}</p>
    </div>
  );
}

function Radar({ focus }: { focus: string | null }) {
  return (
    <div className="relative mx-3 mb-2 aspect-square overflow-hidden rounded-2xl bg-obsidian/70">
      <div className="absolute inset-3 rounded-full border border-line/70" />
      <div className="absolute inset-8 rounded-full border border-line/40" />
      {UTILITY_BUILDINGS.map((b) => {
        const left = 50 + b.position[0] * 2.1;
        const top = 50 + b.position[2] * 2.1;
        const on = focus === b.id;
        return (
          <span
            key={b.id}
            className={cn(
              "absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
              b.status === "LIVE" ? "bg-pink" : on ? "bg-cyan" : "bg-mute",
            )}
            style={{ left: `${left}%`, top: `${top}%` }}
          />
        );
      })}
    </div>
  );
}

function MapLayer({ focus, onPick }: { focus: string | null; onPick: (id: string) => void }) {
  return (
    <div data-map-layer className="absolute inset-0 overflow-auto bg-[linear-gradient(to_right,color-mix(in_oklab,var(--color-cyan)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--color-cyan)_8%,transparent)_1px,transparent_1px)] bg-[size:48px_48px] p-6">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {DISTRICT_LIST.map((id) => {
          const b = UTILITY_BUILDINGS.find((item) => item.id === id);
          if (!b) return null;
          const meta = BUILDING_META[id];
          return (
            <button
              key={id}
              type="button"
              data-building={id}
              onClick={() => onPick(id)}
              className={cn(
                "origin-map-card min-h-28 rounded-2xl p-4 text-left",
                focus === id && "ring-1 ring-cyan",
              )}
            >
              <p className="font-display text-sm font-semibold tracking-[0.1em] text-paper">{b.name}</p>
              <p className="mt-2 text-2xs leading-relaxed text-mute">{meta?.role ?? b.note}</p>
              {b.status === "LIVE" ? <p className="mt-3 font-mono text-2xs tracking-[0.16em] text-pink uppercase">BOTBAE LIVE</p> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
