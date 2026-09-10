import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type MouseEvent } from "react";
import {
  CHAPTERS,
  FILM_DURATION,
  VO_END,
  captionAt,
  chapterAt,
  formatTimecode,
  shotAt,
} from "@/lib/film";
import { DISTRICT_BY_CHAPTER } from "@/lib/canon";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2, Pause, Play, Volume2, VolumeX } from "lucide-react";

export type AspectMode = "film" | "feed";

export type FilmHandle = {
  playFrom: (seconds: number) => void;
  pause: () => void;
};

type FilmPlayerProps = {
  aspect: AspectMode;
  onAspect: (next: AspectMode) => void;
  seekTo: number | null;
  onSeekConsumed: () => void;
  cinematic?: boolean;
  active?: boolean;
};

type Layer = "a" | "b";

export const FilmPlayer = forwardRef<FilmHandle, FilmPlayerProps>(function FilmPlayer(
  { aspect, onAspect, seekTo, onSeekConsumed, cinematic, active = true },
  ref,
) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const frontRef = useRef<Layer>("a");
  const shotIdRef = useRef("");
  const [front, setFront] = useState<Layer>("a");
  const [layerA, setLayerA] = useState(shotAt(0).poster);
  const [layerB, setLayerB] = useState(shotAt(0).poster);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [hover, setHover] = useState(true);

  const shot = shotAt(time);
  const caption = captionAt(time);
  const chapter = chapterAt(time);
  const district = DISTRICT_BY_CHAPTER[chapter.id] ?? "AGENTROPOLIS";
  const progress = Math.min(1, time / FILM_DURATION);

  const playingRef = useRef(false);
  const clockRef = useRef(0);

  const syncLayer = useCallback((t: number) => {
    const next = shotAt(t);
    if (next.id === shotIdRef.current) return;
    shotIdRef.current = next.id;
    const incoming: Layer = frontRef.current === "a" ? "b" : "a";
    if (incoming === "a") setLayerA(next.poster);
    else setLayerB(next.poster);
    frontRef.current = incoming;
    setFront(incoming);
  }, []);

  useEffect(() => {
    shotIdRef.current = shotAt(0).id;
    frontRef.current = "a";
    setFront("a");
    setLayerA(shotAt(0).poster);
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const audio = audioRef.current;
      const hasAudio = Boolean(audio && audio.duration && !Number.isNaN(audio.duration) && audio.src);
      if (hasAudio && audio && !audio.paused && !audio.ended) {
        const t = audio.currentTime;
        clockRef.current = t;
        setTime(t);
        setPlaying(true);
        playingRef.current = true;
        if (t >= FILM_DURATION - 0.05) {
          setEnded(true);
          setPlaying(false);
          playingRef.current = false;
        }
        syncLayer(t);
      } else if (playingRef.current) {
        const dt = (now - last) / 1000;
        clockRef.current = Math.min(FILM_DURATION, clockRef.current + dt);
        const t = clockRef.current;
        setTime(t);
        syncLayer(t);
        if (t >= FILM_DURATION - 0.05) {
          setEnded(true);
          setPlaying(false);
          playingRef.current = false;
        }
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [syncLayer]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    setStarted(true);
    setEnded(false);
    playingRef.current = true;
    if (clockRef.current >= FILM_DURATION - 0.2) clockRef.current = 0;
    if (audio && audio.src) {
      if (audio.currentTime >= FILM_DURATION - 0.2) audio.currentTime = 0;
      try {
        await audio.play();
      } catch {
        /* quantized: no vo in production artifact — clock continues */
      }
    }
    setPlaying(true);
    syncLayer(clockRef.current);
  }, [syncLayer]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    playingRef.current = false;
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) pause();
    else void play();
  }, [play, pause, playing]);

  const seek = useCallback(
    (t: number) => {
      const clamped = Math.max(0, Math.min(FILM_DURATION - 0.05, t));
      clockRef.current = clamped;
      const audio = audioRef.current;
      if (audio && audio.src) audio.currentTime = clamped;
      setTime(clamped);
      setEnded(clamped >= VO_END);
      shotIdRef.current = "";
      syncLayer(clamped);
    },
    [syncLayer],
  );

  useImperativeHandle(ref, () => ({
    playFrom: (seconds: number) => {
      setStarted(true);
      setEnded(false);
      seek(seconds);
      void play();
    },
    pause,
  }));

  useEffect(() => {
    if (seekTo == null) return;
    setStarted(true);
    seek(seekTo);
    void play();
    onSeekConsumed();
  }, [seekTo, seek, play, onSeekConsumed]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        toggle();
      } else if (e.key === "m") {
        setMuted((v) => !v);
      } else if (e.key === "ArrowRight") {
        seek(time + 5);
      } else if (e.key === "ArrowLeft") {
        seek(time - 5);
      } else if (e.key === "f") {
        onAspect(aspect === "film" ? "feed" : "film");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, toggle, seek, time, aspect, onAspect]);

  const onBar = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(x * FILM_DURATION);
    if (!started) void play();
  };

  const showChrome = hover || !playing || !started;
  const hideCaptions = shot.kind === "black" || shot.kind === "title";
  const showCredits = shot.kind === "black" || ended;

  return (
    <div
      data-film-player
      className={cn(
        "relative mx-auto overflow-hidden bg-obsidian shadow-[var(--shadow-border)]",
        cinematic
          ? "h-full w-full max-w-none rounded-none"
          : aspect === "film"
            ? "aspect-film w-full max-w-6xl rounded-xl"
            : "aspect-feed w-full max-w-sm rounded-lg",
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPointerDown={() => setHover(true)}
    >
      <audio ref={audioRef} preload="none" muted={muted} />
      <img
        src={layerA || "/media/stills/octane/hero.jpg"}
        alt=""
        onError={(e) => {
          e.currentTarget.src = "/media/stills/octane/hero.jpg";
        }}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out",
          front === "a" && shot.kind !== "black" ? "opacity-100" : "opacity-0",
          playing ? "film-ken" : "",
        )}
      />
      <img
        src={layerB || "/media/stills/octane/hero.jpg"}
        alt=""
        onError={(e) => {
          e.currentTarget.src = "/media/stills/octane/hero.jpg";
        }}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out",
          front === "b" && shot.kind !== "black" ? "opacity-100" : "opacity-0",
          playing ? "film-ken" : "",
        )}
      />

      <div className="pointer-events-none absolute inset-0 film-vignette" />

      {showCredits ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-obsidian px-6 text-center">
          <p className="font-display text-sm font-semibold tracking-[0.28em] text-cyan">AGENTROPOLIS</p>
          <p className="text-xs tracking-[0.18em] text-mute uppercase">A city built for agents</p>
          <p className="mt-4 text-xs text-dim">NEURO · 2026</p>
        </div>
      ) : null}

      {!started ? (
        <button
          type="button"
          onClick={() => void play()}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-obsidian/40"
          aria-label="Play film"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-paper text-obsidian shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:scale-105">
            <Play className="ml-0.5 size-7" fill="currentColor" />
          </span>
          <span className="font-display text-xs font-semibold tracking-[0.32em] text-paper">PLAY FILM</span>
        </button>
      ) : null}

      {started && !hideCaptions && caption ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 z-10 flex justify-center px-4",
            aspect === "feed" ? "bottom-20" : shot.captionLift ? "bottom-32" : "bottom-16",
          )}
          aria-live="polite"
        >
          <p className="film-caption max-w-3xl text-center text-xs font-medium leading-snug text-paper sm:text-sm">
            {caption.text}
          </p>
        </div>
      ) : null}

      <div
        className={cn(
          "absolute inset-x-0 top-0 z-10 flex items-start justify-between px-3 py-3 transition-opacity duration-200 sm:px-4",
          showChrome ? "opacity-100" : "opacity-0",
        )}
      >
        <div>
          <p className="font-display text-[10px] font-semibold tracking-[0.28em] text-cyan">AGENTROPOLIS</p>
          <p className="mt-1 text-[10px] tracking-[0.16em] text-mute">{district}</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] tracking-[0.16em] text-mute">
          <span className="size-1.5 rounded-full bg-red" />
          <span className="tabular-nums text-paper">{formatTimecode(time)}</span>
        </div>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-obsidian/90 to-transparent px-3 pb-3 pt-8 transition-opacity duration-200 sm:px-4",
          showChrome ? "opacity-100" : "opacity-0",
        )}
      >
        <button
          type="button"
          className="relative mb-2 block h-3 w-full"
          aria-label="Seek"
          onClick={onBar}
        >
          <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-line" />
          {CHAPTERS.map((c) => (
            <span
              key={c.id}
              className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan"
              style={{ left: `${(c.start / FILM_DURATION) * 100}%` }}
            />
          ))}
          <span
            className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-cyan"
            style={{ width: `${progress * 100}%` }}
          />
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggle}
            className="flex size-11 items-center justify-center rounded-md text-paper hover:text-cyan"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="ml-0.5 size-4" fill="currentColor" />}
          </button>
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            className="flex size-11 items-center justify-center rounded-md text-paper hover:text-cyan"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <p className="hidden min-w-0 flex-1 truncate text-[10px] tracking-[0.14em] text-mute uppercase sm:block">
            {chapter.label}
          </p>
          <button
            type="button"
            onClick={() => onAspect(aspect === "film" ? "feed" : "film")}
            className="flex size-11 items-center justify-center rounded-md text-paper hover:text-cyan"
            aria-label={aspect === "film" ? "Feed frame" : "Cinema frame"}
          >
            {aspect === "film" ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
});
