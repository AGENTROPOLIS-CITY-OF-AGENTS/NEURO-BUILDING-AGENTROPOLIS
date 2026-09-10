import { StartCta } from "@/components/start-cta";
import { FLOOR_MODES, type FloorMode } from "@/lib/journeys";
import { cn } from "@/lib/utils";

export function FloorDock({
  mode,
  onMode,
}: {
  mode: FloorMode;
  onMode: (next: FloorMode) => void;
}) {
  return (
    <nav
      data-floor-dock
      aria-label="How you move through the city"
      className={cn(
        "absolute inset-x-0 z-[45] flex justify-center px-2",
        mode === "start" ? "bottom-[26%] md:bottom-[28%]" : "bottom-12 sm:bottom-14",
      )}
    >
      <div className="hero-dock">
        {FLOOR_MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            data-mode={item.id}
            onClick={() => onMode(item.id)}
            className={cn("hero-chip", mode === item.id && "is-on")}
          >
            <span className="sm:hidden">{item.short}</span>
            <span className="hidden sm:inline">{item.label}</span>
            {item.id === "start" && mode === "start" ? <span className="hero-chip-arrow">→</span> : null}
          </button>
        ))}
      </div>
    </nav>
  );
}

export function StartHere({
  onGuide,
  onFilm,
  onCity,
  onBuild,
  onProtocol,
  onStreet,
}: {
  onGuide: () => void;
  onFilm: () => void;
  onCity: () => void;
  onBuild: () => void;
  onProtocol: () => void;
  onStreet: () => void;
}) {
  return (
    <div data-start className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div className="hero-stage" aria-hidden>
        <div className="hero-ken">
          <img src="/media/stills/octane/hero.jpg" alt="" />
        </div>
        <div className="hero-vignette" />
        <div className="hero-scan" />
      </div>

      <p className="hero-rail hero-rail-left">
        Real agents.
        <br />
        Real worlds.
        <br />
        No limits.
      </p>
      <p className="hero-rail hero-rail-right">
        Agents
        <br />
        Infrastructure
        <br />
        Intelligence
        <br />
        Commerce
        <br />
        Culture
        <span className="mt-6 block text-cyan">
          One grid
          <br />
          Infinite possibilities.
        </span>
      </p>

      <aside className="hero-board hero-board-left" aria-hidden>
        <span>Agents are infrastructure</span>
      </aside>
      <aside className="hero-board hero-board-right" aria-hidden>
        <span>Quantize compute · visuals · models · information together</span>
      </aside>

      <div className="pointer-events-auto absolute inset-x-0 top-[16%] z-10 md:top-[18%]">
        <StartCta onEnter={onCity} />
      </div>

      <div className="sr-only">
        <button type="button" data-start-path="guide" data-tour="tour" onClick={onGuide}>
          See how the city actually runs
        </button>
        <button type="button" data-start-path="protocol" data-tour="protocol" onClick={onProtocol}>
          Inspect the protocol
        </button>
        <button type="button" data-start-path="film" data-film onClick={onFilm}>
          Watch the record
        </button>
        <button type="button" data-start-opt="build" onClick={onBuild}>
          Start building
        </button>
        <button type="button" data-start-opt="street" onClick={onStreet}>
          Walk Main Street
        </button>
      </div>
    </div>
  );
}
