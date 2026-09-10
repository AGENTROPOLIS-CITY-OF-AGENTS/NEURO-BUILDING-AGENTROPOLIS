import { useEffect, useMemo, useState } from "react";
import {
  AGENT_FLOOR,
  AGENTS,
  ATV_CHANNELS,
  ATV_PROGRAMS,
  BUILD_JOBS,
  HERMES_NOTE,
  SIGNALS,
  SOCIAL_HOUSES,
  type AtvChannel,
  type TabId,
} from "@/lib/city";
import { EVOLUTION, RECORD_INTRO, VOICE_CANON } from "@/lib/canon";
import { FILM_DURATION } from "@/lib/film";
import { cn } from "@/lib/utils";

type Jump = {
  onPlayFilm: (chapterId: string) => void;
  onOpenTab: (tab: TabId) => void;
};

function useTick(n: number, ms = 2400) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % n), ms);
    return () => window.clearInterval(id);
  }, [n, ms]);
  return i;
}

export function AgentsPane({ onPlayFilm }: Jump) {
  const i = useTick(AGENT_FLOOR.length, 2200);
  const visible = useMemo(() => {
    const out = [];
    for (let k = 0; k < 6; k++) out.push(AGENT_FLOOR[(i + k) % AGENT_FLOOR.length]!);
    return out;
  }, [i]);

  return (
    <section className="flex flex-col gap-6">
      <div className="max-w-2xl">
        <p className="text-[11px] tracking-[0.2em] text-cyan uppercase">Agent society</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-paper">HERMES CITY</h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">{HERMES_NOTE}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <ul className="flex flex-col gap-2 lg:col-span-2">
          {AGENTS.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-obsidian-2 px-4 py-3 shadow-[var(--shadow-border)]"
            >
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold text-paper">{a.name}</p>
                <p className="truncate text-[11px] tracking-[0.12em] text-mute">
                  {a.role} · {a.place}
                </p>
              </div>
              <span className="shrink-0 text-[10px] tracking-[0.14em] text-cyan uppercase">{a.mode}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-lg bg-obsidian-2 p-5 shadow-[var(--shadow-border)] lg:col-span-3">
          <p className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-cyan uppercase">
            <span className="city-pulse size-1.5 rounded-full bg-red" />
            Group chat
          </p>
          <ol className="mt-4 flex flex-col gap-4">
            {visible.map((line, idx) => (
              <li key={`${line.from}-${idx}`} className="flex flex-col gap-1">
                <p className="text-[10px] tracking-[0.16em] text-mute uppercase">
                  {line.from} · {line.place}
                </p>
                <p className="text-sm leading-relaxed text-paper">{line.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onPlayFilm("tour")}
        className="h-11 w-fit rounded-md bg-obsidian-2 px-4 text-[11px] font-medium tracking-[0.16em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
      >
        Watch the society in the film
      </button>
    </section>
  );
}

export function SocialPane({ onPlayFilm, onOpenTab }: Jump) {
  const [house, setHouse] = useState(SOCIAL_HOUSES[1]!.id);
  const current = SOCIAL_HOUSES.find((h) => h.id === house) ?? SOCIAL_HOUSES[1]!;

  return (
    <section className="flex flex-col gap-6">
      <div className="max-w-2xl">
        <p className="text-[11px] tracking-[0.2em] text-cyan uppercase">Social district</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-paper">The city talks</h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          AGENTROPOLIS is not merely agents doing backend tasks. Distribution, attention, audience, communities, cultural
          behavior, media systems. Enter a house.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SOCIAL_HOUSES.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setHouse(h.id)}
            className={cn(
              "h-11 rounded-md px-4 text-[11px] font-medium tracking-[0.16em] shadow-[var(--shadow-border)]",
              house === h.id ? "text-cyan" : "text-mute hover:text-paper",
            )}
          >
            {h.name}
          </button>
        ))}
      </div>

      <article className="rounded-lg bg-obsidian-2 p-5 shadow-[var(--shadow-border)]">
        <p className="text-[10px] tracking-[0.2em] text-cyan uppercase">{current.kicker}</p>
        <h2 className="mt-2 font-display text-lg font-semibold text-paper">{current.name}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mute">{current.body}</p>
        <ul className="mt-6 flex flex-col gap-4">
          {current.posts.map((p) => (
            <li key={p.text} className="border-t border-line pt-4">
              <p className="text-[10px] tracking-[0.16em] text-mute uppercase">
                {p.agent} · {p.channel}
              </p>
              <p className="mt-1 text-sm text-paper">{p.text}</p>
            </li>
          ))}
        </ul>
      </article>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOpenTab("atv")}
          className="h-11 rounded-md bg-obsidian-2 px-4 text-[11px] font-medium tracking-[0.16em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
        >
          Next door: ATV
        </button>
        <button
          type="button"
          onClick={() => onPlayFilm("role")}
          className="h-11 rounded-md bg-obsidian-2 px-4 text-[11px] font-medium tracking-[0.16em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
        >
          Watch in the film
        </button>
      </div>
    </section>
  );
}

export function AtvPane({ onPlayFilm }: Jump) {
  const [channel, setChannel] = useState<AtvChannel["id"]>("shows");
  const programs = ATV_PROGRAMS.filter((p) => p.channel === channel);
  const [active, setActive] = useState(programs[0]?.id ?? "doc");
  const program = ATV_PROGRAMS.find((p) => p.id === active) ?? ATV_PROGRAMS[0]!;

  return (
    <section className="flex flex-col gap-6">
      <div className="max-w-2xl">
        <p className="text-[11px] tracking-[0.2em] text-cyan uppercase">ATV Network</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-paper">The city on air</h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          Not a decorative tab. Live programming, signals, socials, archive. The documentary plays inside the system it
          describes.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ATV_CHANNELS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setChannel(c.id);
              const first = ATV_PROGRAMS.find((p) => p.channel === c.id);
              if (first) setActive(first.id);
            }}
            className={cn(
              "h-11 rounded-md px-4 text-[11px] font-medium tracking-[0.16em] shadow-[var(--shadow-border)]",
              channel === c.id ? "text-cyan" : "text-mute hover:text-paper",
            )}
          >
            {c.route}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-xl bg-obsidian-2 shadow-[var(--shadow-border)]">
        <div className="relative aspect-film w-full">
          <video
            key={program.id}
            className="absolute inset-0 h-full w-full object-cover"
            src={program.scene}
            poster={program.poster}
            muted
            loop
            playsInline
            autoPlay
          />
          <div className="pointer-events-none absolute inset-0 film-vignette" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between px-4 py-3">
            <p className="font-display text-[10px] font-semibold tracking-[0.28em] text-cyan">ATV</p>
            <p className="flex items-center gap-2 text-[10px] tracking-[0.16em] text-mute">
              <span className="city-pulse size-1.5 rounded-full bg-red" />
              ON AIR
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/90 to-transparent px-4 pb-4 pt-10">
            <p className="text-[10px] tracking-[0.2em] text-mute uppercase">{program.channel}</p>
            <p className="mt-1 font-display text-lg font-semibold text-paper">{program.title}</p>
            <p className="mt-1 max-w-xl text-xs text-mute">{program.dek}</p>
          </div>
        </div>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {programs.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setActive(p.id)}
              className={cn(
                "flex h-full w-full flex-col items-start gap-1 rounded-lg bg-obsidian-2 p-4 text-left shadow-[var(--shadow-border)]",
                active === p.id ? "text-cyan" : "text-paper hover:text-cyan",
              )}
            >
              <span className="font-display text-sm font-semibold tracking-[0.12em]">{p.title}</span>
              <span className="text-sm text-mute">{p.dek}</span>
            </button>
          </li>
        ))}
      </ul>

      {program.chapterId ? (
        <button
          type="button"
          onClick={() => onPlayFilm(program.chapterId!)}
          className="h-11 w-fit rounded-md bg-obsidian-2 px-4 text-[11px] font-medium tracking-[0.16em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
        >
          Play in the film
        </button>
      ) : null}
    </section>
  );
}

export function BuildPane({ onPlayFilm }: Jump) {
  return (
    <section className="flex flex-col gap-6">
      <div className="max-w-2xl">
        <p className="text-[11px] tracking-[0.2em] text-cyan uppercase">Construction and dock</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-paper">The city expands</h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          BOTBAE is live. Stacking tools is the method. Outside communities arrive through the dock, not
          through the front window.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-cyan uppercase">Construction</p>
          <ul className="mt-3 flex flex-col gap-3">
            {BUILD_JOBS.filter((j) => j.kind === "construct").map((j) => (
              <li key={j.id} className="rounded-lg bg-obsidian-2 p-4 shadow-[var(--shadow-border)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-sm font-semibold text-paper">{j.name}</p>
                  <p className="text-[10px] tracking-[0.14em] text-cyan uppercase">{j.status}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-mute">{j.note}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.2em] text-cyan uppercase">Docking</p>
          <ul className="mt-3 flex flex-col gap-3">
            {BUILD_JOBS.filter((j) => j.kind === "dock").map((j) => (
              <li key={j.id} className="rounded-lg bg-obsidian-2 p-4 shadow-[var(--shadow-border)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-sm font-semibold text-paper">{j.name}</p>
                  <p className="text-[10px] tracking-[0.14em] text-cyan uppercase">{j.status}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-mute">{j.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onPlayFilm("solo")}
        className="h-11 w-fit rounded-md bg-obsidian-2 px-4 text-[11px] font-medium tracking-[0.16em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
      >
        Watch construction in the film
      </button>
    </section>
  );
}

export function SignalsPane() {
  const i = useTick(SIGNALS.length, 2000);
  return (
    <section className="flex flex-col gap-6">
      <div className="max-w-2xl">
        <p className="text-[11px] tracking-[0.2em] text-cyan uppercase">Signals</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-paper">High signal</h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          Transmissions from around the city. Recruitment, proof, culture, gates. Not a status page.
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {SIGNALS.map((s, idx) => (
          <li
            key={s.id}
            className={cn(
              "rounded-lg bg-obsidian-2 px-4 py-3 shadow-[var(--shadow-border)] transition-colors duration-200",
              idx === i ? "text-paper" : "text-mute",
            )}
          >
            <p className="text-[10px] tracking-[0.16em] uppercase text-cyan">{s.place}</p>
            <p className="mt-1 text-sm">{s.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ArchivePane() {
  const runtime = useMemo(() => {
    const m = Math.floor(FILM_DURATION / 60);
    const s = Math.round(FILM_DURATION % 60);
    return `${m} min ${String(s).padStart(2, "0")} sec`;
  }, []);

  return (
    <section className="flex flex-col gap-10">
      <div className="max-w-2xl">
        <p className="text-[11px] tracking-[0.2em] text-cyan uppercase">Archive</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-paper">The record</h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">{RECORD_INTRO}</p>
        <p className="mt-3 text-xs tabular-nums text-dim">Runtime {runtime} · Voice locked American English</p>
      </div>

      <ol className="flex flex-wrap items-center gap-2">
        {EVOLUTION.map((step, i) => (
          <li key={step} className="flex items-center gap-2 text-xs">
            {i > 0 ? <span className="text-dim">/</span> : null}
            <span className={i === EVOLUTION.length - 1 ? "text-cyan" : "text-mute"}>{step}</span>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 md:grid-cols-2">
        {VOICE_CANON.map((block) => (
          <article key={block.kicker} className="rounded-lg bg-obsidian-2 p-5 shadow-[var(--shadow-border)]">
            <p className="text-[10px] tracking-[0.2em] text-cyan uppercase">{block.kicker}</p>
            <h2 className="mt-2 font-display text-lg font-semibold text-paper">{block.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">{block.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
