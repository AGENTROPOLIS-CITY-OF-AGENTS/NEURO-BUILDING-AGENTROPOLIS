import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type DeckItem = {
  id: string;
  title: string;
  code: string;
  still: string;
  live?: boolean;
};

export function Deck3({
  items,
  selected,
  onSelect,
}: {
  items: DeckItem[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const index = Math.max(0, items.findIndex((item) => item.id === selected));

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const box = stage.current?.getBoundingClientRect();
    if (!box) return;
    const nx = (e.clientX - box.left) / box.width - 0.5;
    const ny = (e.clientY - box.top) / box.height - 0.5;
    setTilt({ x: ny * -7, y: nx * 12 });
  }, []);

  const onLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!items.length) return;
      e.preventDefault();
      const dir = e.deltaY > 0 || e.deltaX > 0 ? 1 : -1;
      const next = items[(index + dir + items.length) % items.length];
      if (next) onSelect(next.id);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [index, items, onSelect]);

  return (
    <div className="deck-world" data-deck>
      <div
        ref={stage}
        className="deck-stage"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {items.map((item, i) => {
          const off = i - index;
          const far = Math.abs(off) > 4;
          return (
            <button
              key={item.id}
              type="button"
              data-deck-card={item.id}
              aria-pressed={item.id === selected}
              aria-label={`${item.title} ${item.code}`}
              className={cn("deck-card", item.id === selected && "is-on", item.live && "is-live")}
              style={{
                transform: `translate(-50%, -50%) translateX(${off * 58}%) translateZ(${item.id === selected ? 96 : -Math.abs(off) * 48}px) rotateY(${off * -16}deg) scale(${item.id === selected ? 1 : 0.78})`,
                zIndex: 40 - Math.abs(off),
                opacity: far ? 0 : 1,
                pointerEvents: far ? "none" : "auto",
              }}
              onClick={() => onSelect(item.id)}
            >
              <span className="deck-thumb" aria-hidden>
                <img
                  src={item.still}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src = "/media/stills/octane/hero.jpg";
                  }}
                />
              </span>
              <span className="deck-meta">
                <span className="deck-code">{item.code}</span>
                <span className="deck-title">{item.title}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
