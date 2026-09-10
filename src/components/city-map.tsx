import { useEffect, useMemo, useState } from "react";
import {
  AGENT_FLOOR,
  ATV_PROGRAMS,
  BUILD_JOBS,
  CITY_INTRO,
  CITY_LAYERS,
  LAYER_BY_ID,
  SOCIAL_HOUSES,
  residentsOf,
  type CityLayer,
  type TabId,
} from "@/lib/city";

type CityMapProps = {
  entered: string | null;
  onEnter: (id: string) => void;
  onExit: () => void;
  onOpenTab: (tab: TabId) => void;
  onPlayFilm: (chapterId: string) => void;
};

function useTick(n: number, ms = 2400) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % n), ms);
    return () => window.clearInterval(id);
  }, [n, ms]);
  return i;
}

export function CityMap({ entered, onEnter, onExit, onOpenTab, onPlayFilm }: CityMapProps) {
  const layer = entered ? LAYER_BY_ID[entered] : null;

  if (layer) {
    const next = layer.nextDoor ? LAYER_BY_ID[layer.nextDoor] : null;
    const here = residentsOf(layer);
    return (
      <section className="flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-xl bg-obsidian-2 shadow-[var(--shadow-border)]">
          <div className="relative aspect-film w-full">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={layer.scene}
              poster={layer.poster}
              muted
              loop
              playsInline
              autoPlay
            />
            <div className="pointer-events-none absolute inset-0 film-vignette" />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between px-4 py-3">
              <div>
                <p className="font-display text-2xs font-semibold tracking-[0.28em] text-cyan">AGENTROPOLIS</p>
                <p className="mt-1 text-2xs tracking-[0.16em] text-mute">{layer.name}</p>
              </div>
              <p className="flex items-center gap-2 text-2xs tracking-[0.16em] text-mute">
                <span className="city-pulse size-1.5 rounded-full bg-red" />
                LIVE
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/90 to-transparent px-4 pb-4 pt-10">
              <p className="text-2xs tracking-[0.2em] text-cyan uppercase">{layer.layer}</p>
              <p className="mt-1 font-display text-lg font-semibold text-paper">{layer.name}</p>
            </div>
          </div>
        </div>

        <p className="max-w-3xl text-sm leading-relaxed text-mute">{layer.mandate}</p>

        {here.length ? (
          <ul className="flex flex-wrap gap-2">
            {here.map((a) => (
              <li
                key={a.id}
                className="flex h-11 items-center gap-3 rounded-md bg-obsidian-2 px-3 shadow-[var(--shadow-border)]"
              >
                <span className="city-pulse size-1.5 rounded-full bg-cyan" />
                <span className="font-display text-xs font-semibold text-paper">{a.name}</span>
                <span className="text-2xs tracking-[0.14em] text-mute uppercase">{a.status}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <LiveFloor layer={layer} />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onExit}
            className="h-11 rounded-md px-4 text-xs font-medium tracking-[0.16em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
          >
            Exit the building
          </button>
          <button
            type="button"
            onClick={() => onPlayFilm(layer.chapterId)}
            className="h-11 rounded-md bg-obsidian-2 px-4 text-xs font-medium tracking-[0.16em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
          >
            Watch in the film
          </button>
          {layer.tab ? (
            <button
              type="button"
              onClick={() => onOpenTab(layer.tab!)}
              className="h-11 rounded-md bg-obsidian-2 px-4 text-xs font-medium tracking-[0.16em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
            >
              Open the floor
            </button>
          ) : null}
          {next ? (
            <button
              type="button"
              data-next-door={next.id}
              onClick={() => onEnter(next.id)}
              className="h-11 rounded-md bg-obsidian-2 px-4 text-xs font-medium tracking-[0.16em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
            >
              Next door: {next.name}
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <div>
        <p className="text-xs tracking-[0.2em] text-cyan uppercase">The city</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-paper">Enter a building</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute">{CITY_INTRO}</p>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-obsidian-2 shadow-[var(--shadow-border)]">
        <div className="relative aspect-film w-full">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/media/web/botbae-hero.mp4"
            poster="/media/stills/botbae-hero.jpg"
            muted
            loop
            playsInline
            autoPlay
          />
          <div className="pointer-events-none absolute inset-0 film-vignette" />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-4 py-3">
            <div>
              <p className="font-display text-2xs font-semibold tracking-[0.28em] text-cyan">AGENTROPOLIS</p>
              <p className="mt-1 text-2xs tracking-[0.16em] text-mute">CITY OF AGENTS</p>
            </div>
            <p className="flex items-center gap-2 text-2xs tracking-[0.16em] text-mute">
              <span className="city-pulse size-1.5 rounded-full bg-red" />
              LIVE
            </p>
          </div>
          <div className="absolute inset-0 hidden sm:block">
            {CITY_LAYERS.map((l) => (
              <button
                key={l.id}
                type="button"
                data-hotspot={l.id}
                onClick={() => onEnter(l.id)}
                className="group absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ left: l.x, top: l.y }}
                aria-label={`Enter ${l.name}`}
              >
                <span className="relative flex size-4 items-center justify-center">
                  <span className="absolute size-4 rounded-full bg-cyan/25" />
                  <span className="city-pulse size-1.5 rounded-full bg-cyan" />
                </span>
                <span className="pointer-events-none absolute left-10 top-1/2 z-10 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-obsidian/85 px-2 py-1 font-display text-2xs font-semibold tracking-[0.14em] text-paper shadow-[var(--shadow-border)] group-hover:block group-focus-visible:block">
                  {l.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CITY_LAYERS.map((l) => (
          <li key={l.id}>
            <button
              type="button"
              data-enter={l.id}
              onClick={() => onEnter(l.id)}
              className="flex h-full w-full flex-col items-start gap-2 rounded-lg bg-obsidian-2 p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,color] duration-150 hover:text-cyan hover:shadow-[var(--shadow-border-hover)]"
            >
              <span className="flex w-full items-center justify-between gap-3">
                <span className="font-display text-sm font-semibold tracking-[0.12em] text-paper">{l.name}</span>
                <span className="text-2xs tracking-[0.16em] text-cyan">{l.code}</span>
              </span>
              <span className="text-2xs tracking-[0.16em] text-mute uppercase">{l.layer}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LiveFloor({ layer }: { layer: CityLayer }) {
  if (layer.id === "hermes") return <HermesFloor />;
  if (layer.id === "social") return <MagnetFloor />;
  if (layer.id === "atv" || layer.id === "entertain") return <BroadcastFloor />;
  if (layer.id === "construct") return <JobsFloor kind="construct" />;
  if (layer.id === "dock") return <JobsFloor kind="dock" />;
  return <ActivityFloor lines={layer.activity} />;
}

function HermesFloor() {
  const i = useTick(AGENT_FLOOR.length, 2200);
  const visible = useMemo(() => {
    const out = [];
    for (let k = 0; k < 5; k++) out.push(AGENT_FLOOR[(i + k) % AGENT_FLOOR.length]!);
    return out;
  }, [i]);

  return (
    <div className="rounded-lg bg-obsidian-2 p-5 shadow-[var(--shadow-border)]">
      <p className="flex items-center gap-2 text-2xs tracking-[0.2em] text-cyan uppercase">
        <span className="city-pulse size-1.5 rounded-full bg-red" />
        Group chat
      </p>
      <ol className="mt-4 flex flex-col gap-4">
        {visible.map((line, idx) => (
          <li key={`${line.from}-${idx}`} className="flex flex-col gap-1">
            <p className="text-2xs tracking-[0.16em] text-mute uppercase">
              {line.from} · {line.place}
            </p>
            <p className="text-sm leading-relaxed text-paper">{line.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MagnetFloor() {
  const [houseId, setHouseId] = useState("magnet");
  const house = SOCIAL_HOUSES.find((h) => h.id === houseId) ?? SOCIAL_HOUSES[1]!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {SOCIAL_HOUSES.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setHouseId(h.id)}
            className={
              houseId === h.id
                ? "h-11 rounded-md px-4 text-xs font-medium tracking-[0.16em] text-cyan shadow-[var(--shadow-border)]"
                : "h-11 rounded-md px-4 text-xs font-medium tracking-[0.16em] text-mute shadow-[var(--shadow-border)] hover:text-paper"
            }
          >
            {h.name}
          </button>
        ))}
      </div>
      <article className="rounded-lg bg-obsidian-2 p-5 shadow-[var(--shadow-border)]">
        <p className="text-2xs tracking-[0.2em] text-cyan uppercase">{house.kicker}</p>
        <h2 className="mt-2 font-display text-lg font-semibold text-paper">{house.name}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mute">{house.body}</p>
        <ul className="mt-6 flex flex-col gap-4">
          {house.posts.map((p) => (
            <li key={p.text} className="border-t border-line pt-4">
              <p className="text-2xs tracking-[0.16em] text-mute uppercase">
                {p.agent} · {p.channel}
              </p>
              <p className="mt-1 text-sm text-paper">{p.text}</p>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

function BroadcastFloor() {
  const shows = ATV_PROGRAMS.filter((p) => p.channel === "shows");
  return (
    <ul className="flex flex-col gap-2">
      {shows.map((p, idx) => (
        <li key={p.id} className="rounded-lg bg-obsidian-2 px-4 py-3 shadow-[var(--shadow-border)]">
          <p className="text-2xs tracking-[0.16em] text-cyan uppercase">{idx === 0 ? "Now playing" : p.channel}</p>
          <p className="mt-1 font-display text-sm font-semibold text-paper">{p.title}</p>
          <p className="mt-1 text-sm text-mute">{p.dek}</p>
        </li>
      ))}
    </ul>
  );
}

function JobsFloor({ kind }: { kind: "construct" | "dock" }) {
  return (
    <ul className="flex flex-col gap-2">
      {BUILD_JOBS.filter((j) => j.kind === kind).map((j) => (
        <li key={j.id} className="rounded-lg bg-obsidian-2 p-4 shadow-[var(--shadow-border)]">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-sm font-semibold text-paper">{j.name}</p>
            <p className="text-2xs tracking-[0.14em] text-cyan uppercase">{j.status}</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-mute">{j.note}</p>
        </li>
      ))}
    </ul>
  );
}

function ActivityFloor({ lines }: { lines: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {lines.map((line) => (
        <li key={line} className="flex items-start gap-3 text-sm text-paper">
          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-cyan" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}
