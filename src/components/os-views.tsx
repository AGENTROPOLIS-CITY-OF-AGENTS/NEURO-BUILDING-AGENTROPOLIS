import { useEffect, useState } from "react";
import { FilmPlayer, type AspectMode } from "@/components/film-player";
import { StatusChip } from "@/components/status-chip";
import { EVOLUTION, RECORD_INTRO, VOICE_CANON } from "@/lib/canon";
import { ATV_CHANNELS, ATV_PROGRAMS, BUILD_JOBS } from "@/lib/city";
import { DestLink, HostCard, NetworkHosts, StudioHosts } from "@/components/dest-link";
import { AtralMark } from "@/components/atral-script";
import {
  AGENT_SPRITE_CONSTRAINT,
  BOTBAE_BUILDINGS,
  destById,
  destUrl,
  districtSurfaces,
  MCP_DEST_ID,
} from "@/lib/destinations";
import {
  ATRALITH_LINE,
  MCP_ASK,
  MCP_CLOSE,
  MCP_FINAL,
  MCP_FLOW,
  MCP_SUBTITLE,
  MCP_TITLE,
} from "@/lib/atg";
import { FILM_DURATION, chapterById } from "@/lib/film";
import {
  AGENTS,
  COLLECTIVES,
  DATA_MODE_NOTE,
  DISTRICTS,
  FLOOR,
  JSPACE,
  MCPS,
  OBSERVATORY,
  RUNTIMES,
  SIGNALS,
  type Collective,
  type ViewId,
} from "@/lib/grid";
import { AgentNode, Corridor, RuntimeChip } from "@/components/grid-chrome";
import { Deck3 } from "@/components/deck-3d";
import { ThresholdPortal } from "@/components/threshold-portal";
import { GridHub } from "@/components/grid-hub";
import { stillForDistrict } from "@/lib/stills";
import { useCompute } from "@/lib/compute";
import { INFO_CAPS, attentionFloor, infoDepthFor, rankAgents, take } from "@/lib/info";
import { cn } from "@/lib/utils";

type Jump = {
  onDistrict: (id: string) => void;
  onPlayFilm: (chapterId: string) => void;
};

export function OsView({
  view,
  onDistrict,
  onPlayFilm,
  filmSeek,
  onFilmSeekConsumed,
}: {
  view: ViewId;
  onDistrict: (id: string) => void;
  onPlayFilm: (chapterId: string) => void;
  filmSeek: number | null;
  onFilmSeekConsumed: () => void;
}) {
  if (view === "city") return null;
  return (
    <section
      data-os-view={view}
      className="os-veil pointer-events-auto absolute inset-x-0 top-14 bottom-28 z-20 overflow-y-auto px-4 py-5 md:top-28 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        {view === "agents" || view === "build" || view === "mcp" ? (
          <div className="hub-card mb-6">
            <GridHub onPick={onDistrict} onCenter={() => onDistrict("hermes")} />
          </div>
        ) : null}
        {view === "agents" ? <AgentsView onDistrict={onDistrict} onPlayFilm={onPlayFilm} /> : null}
        {view === "collectives" ? <CollectivesView onDistrict={onDistrict} /> : null}
        {view === "districts" ? <DistrictsView onDistrict={onDistrict} /> : null}
        {view === "mcp" ? <McpView onDistrict={onDistrict} /> : null}
        {view === "jspace" ? <JspaceView /> : null}
        {view === "observatory" ? <ObservatoryView /> : null}
        {view === "signals" ? <SignalsView /> : null}
        {view === "atv" ? (
          <AtvView onPlayFilm={onPlayFilm} filmSeek={filmSeek} onFilmSeekConsumed={onFilmSeekConsumed} />
        ) : null}
        {view === "build" ? <BuildView onPlayFilm={onPlayFilm} onDistrict={onDistrict} /> : null}
        {view === "archive" ? <ArchiveView /> : null}
      </div>
    </section>
  );
}

function PaneHead({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <header className="mb-6 max-w-3xl">
      <p className="text-2xs tracking-[0.22em] text-cyan uppercase">{kicker}</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-paper">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-mute">{body}</p>
    </header>
  );
}

function AgentsView({ onDistrict }: Jump) {
  const [compute] = useCompute();
  const caps = INFO_CAPS[infoDepthFor(compute)];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!caps.tickerMs || !caps.chat) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % FLOOR.length), caps.tickerMs);
    return () => window.clearInterval(id);
  }, [caps.tickerMs, caps.chat]);
  const roster = take(rankAgents(AGENTS), caps.agents);
  const visible = caps.chat
    ? Array.from({ length: Math.min(5, FLOOR.length) }, (_, k) => FLOOR[(i + k) % FLOOR.length]!)
    : take(attentionFloor(FLOOR), 2);

  return (
    <div>
      <PaneHead
        kicker="Agent society"
        title="Named. Persistent. Gated."
        body="This roster is a canonical preview of the society layer. It is not live telemetry. Surfaces on this floor: HERMES, NEMOCLAW, NEMOTRON, Codex, local/custom, BotBae. Runtime states are representation only. Execution is not this page."
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <ul className="flex flex-col gap-2 lg:col-span-2">
          {roster.map((a) => (
            <li key={a.id}>
              <AgentNode agent={a} onOpen={onDistrict} />
            </li>
          ))}
        </ul>
        <div className="rounded-lg bg-obsidian-2 p-5 shadow-[var(--shadow-border)] lg:col-span-3">
          <p className="flex items-center gap-2 text-2xs tracking-[0.2em] text-cyan uppercase">
            <span className="city-pulse size-1.5 rounded-full bg-red" />
            Group chat · {caps.chat ? "preview" : "attention"}
          </p>
          <ol className="mt-4 flex flex-col gap-4">
            {visible.map((line, idx) => (
              <li key={`${line.from}-${idx}`}>
                <p className="text-2xs tracking-[0.16em] text-mute uppercase">
                  {line.from} · {line.place}
                </p>
                <p className="mt-1 text-sm text-paper">{line.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {RUNTIMES.map((r) => (
          <li key={r.id} className="rounded-lg bg-obsidian-2 p-4 shadow-[var(--shadow-border)]">
            <p className="flex items-center justify-between gap-2">
              <span className="font-display text-sm font-semibold text-cyan">{r.name}</span>
              <RuntimeChip label={r.id === "human" ? "AUTHORITY" : "SURFACE"} />
            </p>
            <p className="mt-2 text-sm text-mute">{r.role}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-2xs text-dim">{AGENT_SPRITE_CONSTRAINT}</p>
    </div>
  );
}

function CollectivesView({ onDistrict }: { onDistrict: (id: string) => void }) {
  const [id, setId] = useState(COLLECTIVES[1]!.id);
  const col = COLLECTIVES.find((c) => c.id === id) ?? COLLECTIVES[0]!;
  const district = DISTRICTS.find((d) => d.id === col.districtId)!;
  const cards = COLLECTIVES.map((c) => {
    const d = DISTRICTS.find((x) => x.id === c.districtId)!;
    return {
      id: c.id,
      title: d.name,
      code: d.code,
      still: stillForDistrict(d.id),
      live: d.status === "LIVE",
    };
  });
  return (
    <div>
      <PaneHead
        kicker="Collectives"
        title="Governed coordination"
        body="Every district has a collective. Scroll the stack. Click a container to light it. Collective talk never grants authority."
      />
      <Deck3 items={cards} selected={id} onSelect={setId} />
      <CollectiveBody col={col} districtName={district.name} still={stillForDistrict(district.id)} onOpen={() => onDistrict(district.id)} />
    </div>
  );
}

export function CollectiveBody({
  col,
  districtName,
  still,
  onOpen,
}: {
  col: Collective;
  districtName: string;
  still?: string;
  onOpen?: () => void;
}) {
  return (
    <article className="deck-slab p-5">
      {still ? (
        <div className="deck-thumb mb-4 h-36 overflow-hidden">
          <img
            src={still}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/media/stills/octane/hero.jpg";
            }}
          />
        </div>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-2xs tracking-[0.2em] text-cyan uppercase">{districtName}</p>
          <h2 className="mt-2 font-display text-lg font-semibold text-paper">District collective</h2>
        </div>
        {onOpen ? <ThresholdPortal label="Enter" onClick={onOpen} /> : null}
      </div>
      <ol className="mt-5">
        <Corridor />
      </ol>
      <p className="mt-4 text-sm leading-relaxed text-mute">{col.context}</p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <Pair label="Participants" value={col.participants.join(" · ") || "Unassigned"} />
        <Pair label="Escalation" value={col.escalation} />
        <Pair label="Subtasks" value={col.subtasks.join(" · ")} />
        <Pair label="Receipts" value={col.receipts.join(" · ")} />
        <Pair label="Confidence" value={col.confidence} />
        <Pair label="Blockers" value={col.blockers.join(" ")} />
      </dl>
    </article>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-2xs tracking-[0.16em] text-cyan uppercase">{label}</dt>
      <dd className="mt-1 text-sm text-paper">{value}</dd>
    </div>
  );
}

function DistrictsView({ onDistrict }: { onDistrict: (id: string) => void }) {
  const [compute] = useCompute();
  const caps = INFO_CAPS[infoDepthFor(compute)];
  const ranked = [...DISTRICTS].sort((a, b) => {
    const r = (s: string) => (s === "LIVE" ? 0 : s === "OFFLINE" ? 1 : s === "AVAILABLE" ? 2 : 3);
    return r(a.status) - r(b.status);
  });
  const list = take(ranked, Math.max(caps.agents * 2, 6));
  const cards = list.map((d) => ({
    id: d.id,
    title: d.name,
    code: d.code,
    still: stillForDistrict(d.id),
    live: d.status === "LIVE",
  }));
  const [id, setId] = useState(list[0]?.id ?? "hermes");
  const current = list.find((d) => d.id === id) ?? list[0];
  return (
    <div>
      <PaneHead
        kicker="Districts"
        title="The grid, named"
        body="Each district is a place with a mandate. Scroll the stack. Click a container to light it. LIVE is a verified Pages surface."
      />
      <Deck3 items={cards} selected={id} onSelect={setId} />
      {current ? (
        <div className="deck-slab flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-2xs tracking-[0.2em] text-cyan uppercase">{current.code}</p>
            <h2 className="mt-2 font-display text-lg font-semibold text-paper">{current.name}</h2>
            <p className="mt-2 max-w-xl text-sm text-mute">{current.role}</p>
          </div>
          <ThresholdPortal label="Enter" onClick={() => onDistrict(current.id)} />
        </div>
      ) : null}
    </div>
  );
}

function McpView({ onDistrict }: { onDistrict: (id: string) => void }) {
  const [id, setId] = useState(MCPS[0]!.id);
  const mcp = MCPS.find((m) => m.id === id) ?? MCPS[0]!;
  const dest = destById(MCP_DEST_ID[mcp.id] ?? "");
  return (
    <div>
      <PaneHead kicker={MCP_SUBTITLE} title={MCP_TITLE} body={MCP_ASK} />
      <p className="mb-4 max-w-3xl text-sm leading-relaxed text-mute">
        {MCP_CLOSE[0]} {MCP_CLOSE[1]} {MCP_CLOSE[2]}
      </p>
      <ol className="mb-6 flex flex-wrap items-center gap-2">
        {MCP_FLOW.map((step, i) => (
          <li key={step} className="flex items-center gap-2">
            {i > 0 ? <span className="text-dim">→</span> : null}
            <span className="rounded-sm px-2 py-1 text-2xs tracking-[0.14em] text-cyan shadow-[var(--shadow-border)]">
              {step}
            </span>
          </li>
        ))}
      </ol>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          data-atg-from-mcp
          onClick={() => onDistrict("atg")}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-paper px-4 text-2xs tracking-[0.14em] text-obsidian shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:bg-cyan active:scale-[0.96]"
        >
          <AtralMark kind="mandate" className="size-4" />
          Inspect ATG
        </button>
        <button
          type="button"
          onClick={() => onDistrict("aegis")}
          className="h-11 rounded-md px-4 text-2xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
        >
          Open AEGIS
        </button>
        <button
          type="button"
          onClick={() => onDistrict("sentinel")}
          className="h-11 rounded-md px-4 text-2xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
        >
          Open SENTINEL-6
        </button>
      </div>
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-mute">{ATRALITH_LINE}</p>
      <p className="mb-6 font-display text-sm font-semibold tracking-[0.08em] text-paper">{MCP_FINAL}</p>
      <p className="mb-6 text-2xs leading-relaxed text-dim">
        Public MCP surfaces from the city estate. Repository existence does not equal live runtime. This session has no live MCP endpoint connected. Tool lists are from public READMEs. MCP does not provide governance by itself.
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        {MCPS.map((m) => (
          <button
            key={m.id}
            type="button"
            data-mcp={m.id}
            onClick={() => setId(m.id)}
            className={cn(
              "h-11 rounded-md px-3 text-2xs font-medium tracking-[0.12em] shadow-[var(--shadow-border)]",
              id === m.id ? "text-cyan" : "text-mute hover:text-paper",
            )}
          >
            {m.name}
          </button>
        ))}
      </div>
      <article className="rounded-lg bg-obsidian-2 p-5 shadow-[var(--shadow-border)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-2xs tracking-[0.16em] text-mute uppercase">{mcp.owner}</p>
            <h2 className="mt-1 font-display text-lg font-semibold text-paper">{mcp.name}</h2>
            <p className="mt-1 font-mono text-2xs text-dim">{mcp.repo}</p>
          </div>
          <StatusChip status={mcp.status} />
        </div>
        {dest ? (
          <div className="mt-4 max-w-md">
            <DestLink dest={dest} />
            <p className="mt-2 text-2xs text-dim">{dest.note}</p>
          </div>
        ) : null}
        <p className="mt-4 text-sm leading-relaxed text-mute">{mcp.summary}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Pair label="District" value={mcp.district} />
          <Pair label="Transport" value={mcp.transport} />
          <Pair label="Authority" value={mcp.authority} />
          <Pair label="Source" value={mcp.source} />
          <Pair label="Receipt behavior" value={mcp.receipt} />
        </dl>
        <p className="mt-6 text-2xs tracking-[0.16em] text-cyan uppercase">Tools</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {mcp.tools.map((t) => (
            <li key={t} className="rounded-sm px-2 py-1 font-mono text-2xs text-paper shadow-[var(--shadow-border)]">
              {t}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

function JspaceView() {
  const dest = destById("mcp-pages");
  const nmx = destById("host-nmxai");
  return (
    <div>
      <PaneHead kicker="J-SPACE ∞" title={JSPACE.title} body={JSPACE.dek} />
      <div className="relative mb-6 overflow-hidden rounded-lg shadow-[var(--shadow-border)]">
        <img
          src="/media/stills/jspace-pad.jpg"
          alt=""
          className="h-56 w-full object-cover object-[center_70%] md:h-72"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
        <p className="absolute bottom-4 left-4 max-w-lg text-xs tracking-[0.16em] text-cyan uppercase">
          Commons pad. Deliberation chamber. Not a live thought stream.
        </p>
      </div>
      <p className="mb-6 max-w-3xl text-sm text-mute">{DATA_MODE_NOTE}</p>
      {dest ? (
        <div className="mb-6 max-w-md">
          <DestLink dest={dest} />
        </div>
      ) : null}
      {nmx ? (
        <div className="mb-6 max-w-md">
          <DestLink dest={nmx} />
        </div>
      ) : null}
      <ul className="grid gap-3 md:grid-cols-2">
        {JSPACE.rooms.map((r) => (
          <li key={r.id} className="rounded-lg bg-obsidian-2 p-5 shadow-[var(--shadow-border)]">
            <p className="text-2xs tracking-[0.16em] text-cyan uppercase">{r.id}</p>
            <h2 className="mt-2 font-display text-lg font-semibold text-paper">{r.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">{r.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ObservatoryView() {
  const [id, setId] = useState(OBSERVATORY.views[0]!.id);
  const view = OBSERVATORY.views.find((v) => v.id === id) ?? OBSERVATORY.views[0]!;
  return (
    <div>
      <PaneHead kicker="Intelligence Observatory" title="See the grid without pretending it is live" body={OBSERVATORY.note} />
      <div className="mb-6 flex flex-wrap gap-2">
        {OBSERVATORY.views.map((v) => (
          <button
            key={v.id}
            type="button"
            data-obs={v.id}
            onClick={() => setId(v.id)}
            className={cn(
              "h-11 rounded-md px-4 text-xs tracking-[0.14em] shadow-[var(--shadow-border)]",
              id === v.id ? "text-cyan" : "text-mute hover:text-paper",
            )}
          >
            {v.name}
          </button>
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {view.lines.map((line) => (
          <li key={line} className="rounded-lg bg-obsidian-2 px-4 py-3 text-sm text-paper shadow-[var(--shadow-border)]">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SignalsView() {
  return (
    <div>
      <PaneHead kicker="Signals" title="High signal" body="Transmissions from around the city. Preview of the beat, not a status page pretending to be production." />
      <ul className="flex flex-col gap-2">
        {SIGNALS.map((s) => (
          <li key={s.text} className="rounded-lg bg-obsidian-2 px-4 py-3 shadow-[var(--shadow-border)]">
            <p className="text-2xs tracking-[0.16em] text-cyan uppercase">{s.place}</p>
            <p className="mt-1 text-sm text-paper">{s.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AtvView({
  onPlayFilm,
  filmSeek,
  onFilmSeekConsumed,
}: {
  onPlayFilm: (chapterId: string) => void;
  filmSeek: number | null;
  onFilmSeekConsumed: () => void;
}) {
  const [channel, setChannel] = useState<(typeof ATV_CHANNELS)[number]["id"]>("shows");
  const [active, setActive] = useState("doc");
  const [aspect, setAspect] = useState<AspectMode>("film");
  const programs = ATV_PROGRAMS.filter((p) => p.channel === channel);
  const program = ATV_PROGRAMS.find((p) => p.id === active) ?? ATV_PROGRAMS[0]!;
  const isDoc = program.id === "doc";
  const gmn = destById("host-gmn");
  const hostDest = program.destId ? destById(program.destId) : undefined;

  useEffect(() => {
    if (filmSeek != null) {
      setChannel("shows");
      setActive("doc");
    }
  }, [filmSeek]);

  return (
    <div>
      <PaneHead kicker="ATV Network" title="The city on air" body="Live programming as architecture. The documentary is a show inside the system it describes. /signals carries NEURO MetaX host promos. Each host is a verified LIVE site." />
      {gmn ? (
        <div className="mb-4 max-w-md">
          <DestLink dest={gmn} />
        </div>
      ) : null}
      <div className="mb-4 flex flex-wrap gap-2">
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
              "h-11 rounded-md px-4 text-xs tracking-[0.14em] shadow-[var(--shadow-border)]",
              channel === c.id ? "text-cyan" : "text-mute hover:text-paper",
            )}
          >
            {c.route}
          </button>
        ))}
      </div>
      {isDoc ? (
        <FilmPlayer aspect={aspect} onAspect={setAspect} seekTo={filmSeek} onSeekConsumed={onFilmSeekConsumed} />
      ) : (
        <div className="relative overflow-hidden rounded-xl bg-obsidian-2 shadow-[var(--shadow-border)]">
          <div className="relative aspect-film w-full">
            {hostDest ? (
              <div className="host-live-shot absolute inset-0">
                <img src={program.poster} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
              </div>
            ) : (
              <video className="absolute inset-0 h-full w-full object-cover" src={program.scene} poster={program.poster} muted loop playsInline autoPlay />
            )}
            <div className="pointer-events-none absolute inset-0 film-vignette" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/90 to-transparent px-4 pb-4 pt-10">
              <p className="font-display text-lg font-semibold text-paper">{program.title}</p>
              <p className="mt-1 text-xs text-mute">{program.dek}</p>
              {hostDest ? (
                <div className="mt-3 max-w-md">
                  <DestLink dest={hostDest} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {programs.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => {
                setActive(p.id);
                if (p.chapterId && p.id === "doc") {
                  const ch = chapterById(p.chapterId);
                  if (ch) onPlayFilm(p.chapterId);
                }
              }}
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
      {program.chapterId && !isDoc ? (
        <button
          type="button"
          onClick={() => onPlayFilm(program.chapterId!)}
          className="mt-4 h-11 rounded-md bg-obsidian-2 px-4 text-xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
        >
          Play in the documentary
        </button>
      ) : null}
    </div>
  );
}

function BuildView({ onPlayFilm, onDistrict }: { onPlayFilm: (chapterId: string) => void; onDistrict: (id: string) => void }) {
  const botbae = destById("botbae-pages");
  const discord = destById("discord");
  const telegram = destById("telegram");
  const civic = destById("host-agentropolis");
  return (
    <div>
      <PaneHead kicker="BOTBAE" title="The city expands" body="BOTBAE is live. Outside communities arrive through the dock. Stacking tools is the method. Discord and Telegram are first client surfaces and they are not live yet." />
      {civic ? (
        <div className="mb-4 max-w-sm">
          <HostCard dest={civic} />
        </div>
      ) : null}
      <StudioHosts className="mb-4 max-w-3xl" />
      <NetworkHosts className="mb-8 max-w-3xl" />
      {botbae ? (
        <div className="mb-6 max-w-md">
          <DestLink dest={botbae} />
        </div>
      ) : null}
      <div className="mb-8 grid gap-2 sm:grid-cols-2">
        {BOTBAE_BUILDINGS.map((b) => {
          const dest = b.destId ? destById(b.destId) : undefined;
          const url = dest ? destUrl(dest) : undefined;
          return url && dest ? (
            <DestLink key={b.id} dest={{ ...dest, label: b.name, status: b.status }} />
          ) : (
            <div key={b.id} data-building={b.id} className="flex h-11 items-center justify-between rounded-md px-3 shadow-[var(--shadow-border)]">
              <span className="text-xs tracking-[0.08em] text-mute">{b.name}</span>
              <StatusChip status={b.status} />
            </div>
          );
        })}
      </div>
      <div className="mb-8 grid gap-2 sm:grid-cols-2">
        {discord ? <DestLink dest={discord} /> : null}
        {telegram ? <DestLink dest={telegram} /> : null}
      </div>
      <p className="mb-8 text-2xs text-dim">{AGENT_SPRITE_CONSTRAINT}</p>
      <div className="grid gap-6 md:grid-cols-3">
        {([
          ["construct", "Construction"],
          ["dock", "Docking"],
          ["utility", "Utility Grid"],
        ] as const).map(([kind, label]) => (
          <div key={kind}>
            <p className="text-2xs tracking-[0.2em] text-cyan uppercase">{label}</p>
            <ul className="mt-3 flex flex-col gap-3">
              {BUILD_JOBS.filter((j) => j.kind === kind).map((j) => (
                <li key={j.id}>
                  <button
                    type="button"
                    onClick={() => onDistrict(kind === "utility" ? "utility" : kind === "dock" ? "dock" : "construct")}
                    className="w-full rounded-lg bg-obsidian-2 p-4 text-left shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:text-cyan active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-display text-sm font-semibold text-paper">{j.name}</p>
                      <p className={cn("text-2xs tracking-[0.14em] uppercase", j.status === "Deny" ? "text-red" : "text-cyan")}>{j.status}</p>
                    </div>
                    <p className="mt-2 text-sm text-mute">{j.note}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onPlayFilm("solo")}
        className="mt-6 h-11 rounded-md bg-obsidian-2 px-4 text-xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] hover:text-cyan"
      >
        Watch construction in the film
      </button>
    </div>
  );
}

function ArchiveView() {
  const runtime = `${Math.floor(FILM_DURATION / 60)} min ${String(Math.round(FILM_DURATION % 60)).padStart(2, "0")} sec`;
  return (
    <div>
      <PaneHead kicker="Archive" title="The record" body={RECORD_INTRO} />
      <p className="mb-6 font-mono text-xs text-dim">Runtime {runtime} · Voice locked American English</p>
      <ol className="mb-8 flex flex-wrap items-center gap-2">
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
            <p className="text-2xs tracking-[0.2em] text-cyan uppercase">{block.kicker}</p>
            <h2 className="mt-2 font-display text-lg font-semibold text-paper">{block.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">{block.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
