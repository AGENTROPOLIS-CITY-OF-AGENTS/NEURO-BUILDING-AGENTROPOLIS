import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { DestLink } from "@/components/dest-link";
import { StatusChip } from "@/components/status-chip";
import { AtralMark, AtralStrip, AtranicFields } from "@/components/atral-script";
import {
  ATG_THESIS,
  ATRALITH_LINE,
  PROTOCOL_FINAL,
  PROTOCOL_RUNS,
} from "@/lib/atg";
import { destForApp, districtSurfaces } from "@/lib/destinations";
import { AGENTS, DISTRICTS, DISTRICT_BY_ID } from "@/lib/grid";
import {
  CITY_RUNS,
  COMPARE_PRESETS,
  type FloorMode,
} from "@/lib/journeys";
import { cn } from "@/lib/utils";

export { FloorDock, StartHere } from "@/components/start-floor";

export function GuidedTour({
  step,
  onStep,
  onFilm,
  onEnter,
  onCity,
}: {
  step: number;
  onStep: (index: number) => void;
  onFilm: (chapterId: string) => void;
  onEnter: (districtId: string) => void;
  onCity: () => void;
}) {
  const current = CITY_RUNS[step] ?? CITY_RUNS[0]!;
  const district = DISTRICT_BY_ID[current.districtId];
  const last = step >= CITY_RUNS.length - 1;

  return (
    <div
      data-journey
      data-journey-step={current.districtId}
      className="pointer-events-none absolute inset-x-0 top-14 bottom-28 z-20 flex flex-col justify-between px-4 py-4 md:top-24 sm:px-8"
    >
      <div className="pointer-events-auto max-w-2xl">
        <p className="text-2xs tracking-[0.22em] text-cyan uppercase">Follow a real system</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
          How the city actually runs.
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-mute">
          Start at Mission Control. End on air. Execute stays gated the whole way.
        </p>
      </div>

      <div className="pointer-events-auto mt-4 w-full max-w-3xl">
        <ol className="flex gap-1 overflow-x-auto pb-2">
          {CITY_RUNS.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <li key={s.districtId} className="flex min-w-0 flex-1 items-center">
                <button
                  type="button"
                  data-journey-rail={s.districtId}
                  onClick={() => onStep(i)}
                  className={cn(
                    "flex h-11 min-w-[4.5rem] flex-1 items-center gap-2 rounded-md px-2 text-left transition-colors duration-150",
                    active ? "bg-obsidian/80 text-cyan shadow-[var(--shadow-border)]" : "text-mute hover:text-paper",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-2xs",
                      active ? "bg-cyan text-obsidian" : done ? "bg-pink/80 text-obsidian" : "bg-obsidian-3 text-mute",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="hidden truncate text-2xs tracking-[0.12em] uppercase sm:inline">{s.mark}</span>
                </button>
                {i < CITY_RUNS.length - 1 ? (
                  <span className={cn("mx-0.5 hidden h-px w-3 shrink-0 sm:block", done || active ? "bg-cyan/70" : "bg-line")} />
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="mt-2 rounded-lg bg-obsidian/82 p-4 shadow-[var(--shadow-border)] backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-2xs tracking-[0.18em] text-cyan uppercase">
                Step {String(step + 1).padStart(2, "0")} / {String(CITY_RUNS.length).padStart(2, "0")}
                {district ? ` · ${district.code}` : ""}
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold text-paper">{current.title}</h2>
            </div>
            {district ? <StatusChip status={district.status} /> : null}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-mute">{current.body}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => onStep(step - 1)}
              className="inline-flex h-11 items-center gap-1 rounded-md px-3 text-2xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] disabled:opacity-35"
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => (last ? onCity() : onStep(step + 1))}
              className="inline-flex h-11 items-center gap-1 rounded-md bg-paper px-4 text-2xs font-medium tracking-[0.14em] text-obsidian shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:bg-cyan active:scale-[0.96]"
            >
              {last ? "City view" : "Next"}
              {last ? null : <ChevronRight className="size-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => onEnter(current.districtId)}
              className="h-11 rounded-md px-4 text-2xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
            >
              Enter this building
            </button>
            <button
              type="button"
              onClick={() => onFilm(current.chapterId)}
              className="inline-flex h-11 items-center gap-2 rounded-md px-4 text-2xs tracking-[0.14em] text-pink shadow-[var(--shadow-border)] hover:text-lilac"
            >
              <Play className="size-3.5" fill="currentColor" />
              Watch this chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProtocolTour({
  step,
  onStep,
  onFilm,
  onEnter,
  onCity,
  onMcp,
}: {
  step: number;
  onStep: (index: number) => void;
  onFilm: (chapterId: string) => void;
  onEnter: (districtId: string) => void;
  onCity: () => void;
  onMcp: () => void;
}) {
  const current = PROTOCOL_RUNS[step] ?? PROTOCOL_RUNS[0]!;
  const district = DISTRICT_BY_ID[current.districtId];
  const last = step >= PROTOCOL_RUNS.length - 1;
  const gated = current.districtId === "aegis";

  return (
    <div
      data-protocol
      data-protocol-step={current.id}
      className="pointer-events-none absolute inset-x-0 top-14 bottom-28 z-20 flex flex-col justify-between px-4 py-4 md:top-24 sm:px-8"
    >
      <div className="pointer-events-auto max-w-2xl">
        <p className={cn("text-2xs tracking-[0.22em] uppercase", gated ? "text-red" : "text-cyan")}>
          Agent Transaction Grammar
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
          {ATG_THESIS}
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-mute">
          The path through the city is a protocol journey. Not arbitrary animation.
        </p>
      </div>

      <div className="pointer-events-auto mt-4 w-full max-w-3xl">
        <ol className="flex gap-1 overflow-x-auto pb-2">
          {PROTOCOL_RUNS.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <li key={s.id} className="flex min-w-0 flex-1 items-center">
                <button
                  type="button"
                  data-protocol-rail={s.id}
                  onClick={() => onStep(i)}
                  className={cn(
                    "flex h-11 min-w-[3.5rem] flex-1 items-center gap-2 rounded-md px-2 text-left transition-colors duration-150",
                    active ? "bg-obsidian/80 text-cyan shadow-[var(--shadow-border)]" : "text-mute hover:text-paper",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-sm",
                      active
                        ? gated
                          ? "bg-red text-obsidian"
                          : "bg-cyan text-obsidian"
                        : done
                          ? "bg-pink/80 text-obsidian"
                          : "bg-obsidian-3 text-mute",
                    )}
                  >
                    <AtralMark kind={s.glyph} className="size-3.5" />
                  </span>
                  <span className="hidden truncate text-2xs tracking-[0.12em] uppercase sm:inline">{s.mark}</span>
                </button>
                {i < PROTOCOL_RUNS.length - 1 ? (
                  <span className={cn("mx-0.5 hidden h-px w-3 shrink-0 sm:block", done || active ? "bg-cyan/70" : "bg-line")} />
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="mt-2 rounded-lg bg-obsidian/82 p-4 shadow-[var(--shadow-border)] backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className={cn("text-2xs tracking-[0.18em] uppercase", gated ? "text-red" : "text-cyan")}>
                {current.kicker}
                {district ? ` · ${district.code}` : ""}
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold text-paper">{current.title}</h2>
            </div>
            {district ? <StatusChip status={district.status} /> : null}
          </div>
          <p className="mt-2 font-display text-sm tracking-tight text-paper">{current.screen}</p>
          <p className="mt-2 text-sm leading-relaxed text-mute">{current.body}</p>
          <div className="mt-3">
            <AtranicFields fields={current.fields} />
          </div>
          {last ? (
            <div className="mt-4 rounded-md bg-obsidian-2 p-3 shadow-[var(--shadow-border)]">
              <p className="text-2xs tracking-[0.2em] text-cyan uppercase">{PROTOCOL_FINAL.dek}</p>
              <p className="mt-2 font-display text-base font-semibold text-paper">{PROTOCOL_FINAL.line}</p>
              <p className="mt-2 text-2xs tracking-[0.16em] text-mute uppercase">
                {PROTOCOL_FINAL.marks.join(" · ")}
              </p>
              <p className="mt-3 text-2xs leading-relaxed text-dim">{ATRALITH_LINE}</p>
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => onStep(step - 1)}
              className="inline-flex h-11 items-center gap-1 rounded-md px-3 text-2xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] disabled:opacity-35"
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => (last ? onCity() : onStep(step + 1))}
              className="inline-flex h-11 items-center gap-1 rounded-md bg-paper px-4 text-2xs font-medium tracking-[0.14em] text-obsidian shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:bg-cyan active:scale-[0.96]"
            >
              {last ? "City view" : "Next hop"}
              {last ? null : <ChevronRight className="size-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => onEnter(current.districtId)}
              className="h-11 rounded-md px-4 text-2xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
            >
              Enter this building
            </button>
            {current.districtId === "jspace" ? (
              <button
                type="button"
                onClick={onMcp}
                className="h-11 rounded-md px-4 text-2xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
              >
                Open MCP Grid
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onFilm(current.chapterId)}
              className="inline-flex h-11 items-center gap-2 rounded-md px-4 text-2xs tracking-[0.14em] text-pink shadow-[var(--shadow-border)] hover:text-lilac"
            >
              <Play className="size-3.5" fill="currentColor" />
              Watch this chapter
            </button>
          </div>
          <div className="mt-4">
            <AtralStrip active={current.glyph} compact />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompareFloors({
  a,
  b,
  onA,
  onB,
  onDistrict,
}: {
  a: string;
  b: string;
  onA: (id: string) => void;
  onB: (id: string) => void;
  onDistrict: (id: string) => void;
}) {
  const left = DISTRICT_BY_ID[a];
  const right = DISTRICT_BY_ID[b];

  return (
    <div
      data-compare
      className="absolute inset-x-0 top-14 bottom-28 z-20 overflow-y-auto px-4 py-5 md:top-24 sm:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-2xs tracking-[0.22em] text-cyan uppercase">See the difference</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
          Two floors. Same standard.
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-mute">
          Read the same questions against two districts. Status stays honest.
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {COMPARE_PRESETS.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                data-compare-preset={p.id}
                onClick={() => {
                  onA(p.a);
                  onB(p.b);
                }}
                className={cn(
                  "h-11 rounded-md px-3 text-2xs tracking-[0.14em] uppercase shadow-[var(--shadow-border)]",
                  a === p.a && b === p.b ? "bg-obsidian-3 text-cyan" : "text-mute hover:text-paper",
                )}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <CompareColumn id={a} district={left} onPick={onA} onDistrict={onDistrict} />
          <CompareColumn id={b} district={right} onPick={onB} onDistrict={onDistrict} />
        </div>
      </div>
    </div>
  );
}

function CompareColumn({
  id,
  district,
  onPick,
  onDistrict,
}: {
  id: string;
  district: (typeof DISTRICTS)[number] | undefined;
  onPick: (id: string) => void;
  onDistrict: (id: string) => void;
}) {
  const agents = district ? AGENTS.filter((a) => district.agents.includes(a.id)) : [];
  const surfaces = district ? districtSurfaces(district.id) : [];

  return (
    <section className="rounded-lg bg-obsidian/84 p-4 shadow-[var(--shadow-border)] backdrop-blur-md">
      <label className="block text-2xs tracking-[0.16em] text-cyan uppercase">Floor</label>
      <select
        value={id}
        onChange={(e) => onPick(e.target.value)}
        className="mt-2 h-11 w-full rounded-md bg-obsidian-2 px-3 text-sm text-paper shadow-[var(--shadow-border)] outline-none"
        aria-label="Choose a district to compare"
      >
        {DISTRICTS.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      {district ? (
        <>
          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="font-display text-lg font-semibold text-paper">{district.name}</p>
            <StatusChip status={district.status} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-mute">{district.role}</p>
          <p className="mt-4 text-2xs tracking-[0.16em] text-cyan uppercase">Agents</p>
          <p className="mt-1 text-sm text-paper">
            {agents.length ? agents.map((a) => a.name).join(" · ") : "No named agents assigned."}
          </p>
          <p className="mt-4 text-2xs tracking-[0.16em] text-cyan uppercase">Surfaces</p>
          <ul className="mt-2 flex flex-col gap-1">
            {surfaces.length ? (
              surfaces.map((d) => (
                <li key={d.id}>
                  <DestLink dest={d} />
                </li>
              ))
            ) : (
              district.apps.slice(0, 3).map((app) => {
                const dest = destForApp(app);
                return dest ? (
                  <li key={app}>
                    <DestLink dest={{ ...dest, label: app }} />
                  </li>
                ) : (
                  <li key={app} className="flex h-11 items-center justify-between rounded-md px-3 text-xs text-mute shadow-[var(--shadow-border)]">
                    <span>{app}</span>
                    <StatusChip status="PLANNED" />
                  </li>
                );
              })
            )}
          </ul>
          <button
            type="button"
            onClick={() => onDistrict(district.id)}
            className="mt-4 h-11 w-full rounded-md px-4 text-2xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
          >
            Enter {district.code}
          </button>
        </>
      ) : null}
    </section>
  );
}
