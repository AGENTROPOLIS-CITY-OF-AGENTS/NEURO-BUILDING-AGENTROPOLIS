import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CityFieldProps = {
  lit: boolean;
  accent: "cyan" | "pink";
};

const GLYPHS = "01<>/\\*+·";

function seed() {
  const nodes = Array.from({ length: 34 }, (_, i) => ({
    x: ((i * 37) % 94) + 3,
    y: ((i * 53) % 86) + 6,
    dur: 16 + (i % 8),
    delay: -(i * 1.15),
    char: GLYPHS[i % GLYPHS.length]!,
    pink: i % 5 === 0,
  }));
  const beams = Array.from({ length: 10 }, (_, i) => ({
    x: ((i * 13) % 92) + 4,
    dur: 8 + (i % 5),
    delay: -(i * 0.9),
    height: 18 + (i % 7) * 4,
    pink: i % 2 === 0,
  }));
  const links: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i]!.x - nodes[j]!.x;
      const dy = nodes[i]!.y - nodes[j]!.y;
      if (dx * dx + dy * dy < 160) links.push([i, j]);
    }
  }
  return { nodes, beams, links: links.slice(0, 42) };
}

export function CityField({ lit, accent }: CityFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const field = useMemo(() => seed(), []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - r.left) / Math.max(r.width, 1)) * 100,
        y: ((e.clientY - r.top) / Math.max(r.height, 1)) * 100,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn("pointer-events-none absolute inset-0 z-[1] overflow-hidden mix-blend-screen", !lit && "opacity-0")}
      aria-hidden
    >
      {field.beams.map((b, i) => (
        <span
          key={`b${i}`}
          className={cn("city-beam", b.pink ? "city-beam-pink" : accent === "pink" ? "city-beam-pink" : "city-beam-cyan")}
          style={{
            left: `${b.x}%`,
            height: `${b.height}%`,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {field.links.map(([a, b], i) => {
          const n1 = field.nodes[a]!;
          const n2 = field.nodes[b]!;
          const hot = n1.pink || n2.pink || accent === "pink";
          return (
            <line
              key={i}
              x1={n1.x}
              y1={n1.y}
              x2={n2.x}
              y2={n2.y}
              stroke={hot ? "var(--color-pink)" : "var(--color-cyan)"}
              strokeWidth="0.09"
              opacity="0.22"
            />
          );
        })}
        {mouse
          ? field.nodes
              .filter((n) => Math.hypot(n.x - mouse.x, n.y - mouse.y) < 16)
              .map((n, i) => (
                <line
                  key={`m${i}`}
                  x1={n.x}
                  y1={n.y}
                  x2={mouse.x}
                  y2={mouse.y}
                  stroke={n.pink ? "var(--color-pink)" : "var(--color-cyan)"}
                  strokeWidth="0.14"
                  opacity="0.5"
                />
              ))
          : null}
      </svg>
      {field.nodes.map((n, i) => (
        <span
          key={i}
          className={cn("city-glyph font-mono", n.pink || accent === "pink" ? "text-pink" : "text-cyan")}
          style={{
            left: `${n.x}%`,
            animationDuration: `${n.dur}s`,
            animationDelay: `${n.delay}s`,
          }}
        >
          {n.char}
        </span>
      ))}
    </div>
  );
}
