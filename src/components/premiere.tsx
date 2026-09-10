import { useState } from "react";
import { FilmPlayer, type AspectMode } from "@/components/film-player";
import { CityMap } from "@/components/city-map";
import {
  AgentsPane,
  ArchivePane,
  AtvPane,
  BuildPane,
  SignalsPane,
  SocialPane,
} from "@/components/city-panes";
import { FOUNDER, SITE_TAGLINE, SITE_TITLE, TOURS, YEAR } from "@/lib/canon";
import { NAV, type TabId } from "@/lib/city";
import { CHAPTERS, formatTimecode, chapterById } from "@/lib/film";
import { cn } from "@/lib/utils";

export function Premiere() {
  const [tab, setTab] = useState<TabId>("film");
  const [aspect, setAspect] = useState<AspectMode>("film");
  const [seekTo, setSeekTo] = useState<number | null>(null);
  const [entered, setEntered] = useState<string | null>(null);

  const playFilm = (chapterId: string) => {
    const ch = chapterById(chapterId);
    if (!ch) return;
    setTab("film");
    setSeekTo(ch.start);
  };

  return (
    <div className="min-h-dvh bg-obsidian text-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="font-display text-lg font-semibold tracking-[0.22em] text-paper">{SITE_TITLE}</p>
            <p className="mt-1 text-xs tracking-[0.16em] text-mute uppercase">{SITE_TAGLINE}</p>
          </div>
          <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" aria-label="Premiere">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "h-11 shrink-0 px-3 text-xs font-medium tracking-[0.16em] uppercase transition-colors duration-150",
                  tab === item.id ? "text-cyan" : "text-mute hover:text-paper",
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {tab === "film" ? (
          <section className="flex flex-col gap-6">
            <FilmPlayer
              aspect={aspect}
              onAspect={setAspect}
              seekTo={seekTo}
              onSeekConsumed={() => setSeekTo(null)}
            />
            <ChapterRail onJump={(start) => setSeekTo(start)} />
            <TourRow onJump={playFilm} />
          </section>
        ) : null}

        {tab === "city" ? (
          <CityMap
            entered={entered}
            onEnter={setEntered}
            onExit={() => setEntered(null)}
            onOpenTab={setTab}
            onPlayFilm={playFilm}
          />
        ) : null}

        {tab === "agents" ? <AgentsPane onPlayFilm={playFilm} onOpenTab={setTab} /> : null}
        {tab === "social" ? <SocialPane onPlayFilm={playFilm} onOpenTab={setTab} /> : null}
        {tab === "atv" ? <AtvPane onPlayFilm={playFilm} onOpenTab={setTab} /> : null}
        {tab === "build" ? <BuildPane onPlayFilm={playFilm} onOpenTab={setTab} /> : null}
        {tab === "signals" ? <SignalsPane /> : null}
        {tab === "archive" ? <ArchivePane /> : null}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-[11px] tracking-[0.12em] text-dim sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            {SITE_TITLE} · {FOUNDER} · {YEAR}
          </p>
          <p>A city of agents. Not a harness demo.</p>
        </div>
      </footer>
    </div>
  );
}

function TourRow({ onJump }: { onJump: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TOURS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onJump(t.chapterId)}
          className="h-11 rounded-md bg-obsidian-2 px-4 text-[11px] font-medium tracking-[0.16em] text-paper shadow-[var(--shadow-border)] transition-[box-shadow,color] duration-150 hover:text-cyan hover:shadow-[var(--shadow-border-hover)]"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function ChapterRail({ onJump }: { onJump: (start: number) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {CHAPTERS.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onJump(c.start)}
          className="flex h-11 shrink-0 items-center gap-2 rounded-md px-3 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
        >
          <span className="font-display text-xs font-semibold text-paper">{c.label}</span>
          <span className="text-[10px] tabular-nums text-mute">{formatTimecode(c.start)}</span>
        </button>
      ))}
    </div>
  );
}
