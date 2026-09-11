import { CityField } from "@/components/city-field";
import { AGENTS, DISTRICTS, GRID_ROUTES, type District } from "@/lib/grid";
import { cn } from "@/lib/utils";

type CityStageProps = {
  selected: string | null;
  hovered: string | null;
  lit: boolean;
  quiet?: boolean;
  trail?: string[];
  trailKind?: "city" | "protocol";
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

const HUB = new Set(["mission", "hermes", "street", "construct", "parallax", "holofoil"]);
const OVERVIEW_POSTER = "/media/stills/city-overview.jpg";
const BOTBAE_POSTER = "/media/stills/botbae-hero.jpg";
const UTILITY_POSTER = "/media/stills/origin-ios.jpg";
const PX_POSTER = "/media/stills/px-lockup.jpg";

function depthScale(y: string, active: boolean, mission: boolean, isolate: boolean) {
  const near = parseFloat(y) / 100;
  const base = 0.76 + near * 0.42;
  const bump = active ? 1.18 : 1;
  const weight = mission ? 1.22 : isolate ? 1.14 : 1;
  return base * bump * weight;
}

function routePath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const lift = Math.min(7, len * 0.14);
  return `M ${x1} ${y1} Q ${mx - (dy / len) * lift} ${my + (dx / len) * lift} ${x2} ${y2}`;
}

export function CityStage({ selected, hovered, lit, quiet, trail, trailKind, onHover, onSelect }: CityStageProps) {
  const district = DISTRICTS.find((d) => d.id === selected) ?? null;
  const inspect = DISTRICTS.find((d) => d.id === hovered && d.id !== selected) ?? null;
  const construct = district?.id === "construct";
  const utility = district?.id === "utility";
  const parallax = district?.id === "parallax";
  const isolate = construct || utility || parallax;
  const protocol = trailKind === "protocol";
  const packet = protocol ? DISTRICTS.find((d) => d.id === selected) : null;
  const gated = protocol && selected === "aegis";
  const poster = construct ? BOTBAE_POSTER : utility ? UTILITY_POSTER : parallax ? PX_POSTER : OVERVIEW_POSTER;

  return (
    <div
      className={cn(
        "relative h-full min-h-[28rem] w-full overflow-hidden bg-obsidian-2",
        construct && "botbae-world",
        utility && "utility-world",
        parallax && "parallax-world",
      )}
      style={{ backgroundImage: `url(${poster})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_38%]"
        aria-hidden
      />

      <div className="city-atmosphere pointer-events-none absolute inset-0" />
      {quiet || (!selected && !trail) ? null : <CityField lit={lit && !utility} accent={construct ? "pink" : "cyan"} />}

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {GRID_ROUTES.map(([a, b]) => {
          const da = DISTRICTS.find((d) => d.id === a);
          const db = DISTRICTS.find((d) => d.id === b);
          if (!da || !db) return null;
          const overview = !selected && !trail;
          if (overview && (!HUB.has(a) || !HUB.has(b))) return null;
          const hot = selected === a || selected === b || hovered === a || hovered === b;
          const onTrail = Boolean(trail && trail.includes(a) && trail.includes(b));
          const botbaeRoute = a === "construct" || b === "construct";
          const utilityRoute = a === "utility" || b === "utility";
          const parallaxRoute = a === "parallax" || b === "parallax";
          const d = routePath(parseFloat(da.x), parseFloat(da.y), parseFloat(db.x), parseFloat(db.y));
          const fade = quiet || overview
            ? hot
              ? 0.7
              : 0.22
            : isolate && !hot
              ? 0.22
              : hot || onTrail
                ? 1
                : trail
                  ? 0.28
                  : 0.4;
          const stroke = botbaeRoute
            ? "var(--color-pink)"
            : utilityRoute
              ? "var(--color-red)"
              : parallaxRoute
                ? "var(--color-cyan)"
                : "var(--color-cyan)";
          const trim =
            botbaeRoute
              ? "var(--color-cyan)"
              : gated && (a === "aegis" || b === "aegis")
                ? "var(--color-red)"
                : parallaxRoute
                  ? "var(--color-red)"
                  : "var(--color-pink)";
          return (
            <g key={`${a}-${b}`} opacity={fade}>
              <path d={d} fill="none" stroke="#07080c" strokeWidth={hot ? 1.05 : 0.82} strokeLinecap="round" />
              <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth={hot ? 0.48 : protocol ? 0.4 : 0.34}
                strokeLinecap="round"
                strokeDasharray={protocol && onTrail ? "1.4 0.9" : undefined}
              />
              <path
                d={d}
                fill="none"
                stroke={trim}
                strokeWidth={hot ? 0.16 : 0.1}
                strokeLinecap="round"
                opacity={0.95}
              />
            </g>
          );
        })}
        {protocol && trail
          ? trail.slice(0, -1).map((id, i) => {
              const next = trail[i + 1];
              const da = DISTRICTS.find((d) => d.id === id);
              const db = next ? DISTRICTS.find((d) => d.id === next) : undefined;
              if (!da || !db) return null;
              const d = routePath(parseFloat(da.x), parseFloat(da.y), parseFloat(db.x), parseFloat(db.y));
              const hot = selected === da.id || selected === db.id;
              const hold = da.id === "aegis" || db.id === "aegis";
              return (
                <g key={`p-${id}-${next}`} opacity={hot ? 1 : 0.72}>
                  <path d={d} fill="none" stroke="#07080c" strokeWidth={1.15} strokeLinecap="round" />
                  <path
                    d={d}
                    fill="none"
                    stroke={hold ? "var(--color-red)" : "var(--color-cyan)"}
                    strokeWidth={hot ? 0.55 : 0.42}
                    strokeLinecap="round"
                    strokeDasharray="1.6 1"
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke="var(--color-pink)"
                    strokeWidth={0.14}
                    strokeLinecap="round"
                    opacity={0.9}
                  />
                </g>
              );
            })
          : null}
      </svg>

      <div className={cn("absolute inset-0", isolate && "opacity-70")}>
        {DISTRICTS.filter((d) => {
          if (selected || hovered || trail) {
            return HUB.has(d.id) || d.id === selected || d.id === hovered || Boolean(trail?.includes(d.id));
          }
          return HUB.has(d.id);
        }).map((d) => (
          <DistrictNode
            key={d.id}
            district={d}
            active={selected === d.id}
            dim={
              (quiet && hovered !== d.id && selected !== d.id) ||
              (hovered !== null && hovered !== d.id && selected !== d.id) ||
              (isolate && d.id !== district?.id) ||
              Boolean(trail && !trail.includes(d.id) && selected !== d.id && hovered !== d.id)
            }
            named={selected === d.id || hovered === d.id}
            hold={protocol && d.id === "aegis" && selected === "aegis"}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
        {selected
          ? AGENTS.filter((a) => a.districtId === selected).map((a, i) => {
              const home = DISTRICTS.find((d) => d.id === a.districtId);
              if (!home) return null;
              return (
                <span
                  key={a.id}
                  data-presence={a.id}
                  aria-hidden
                  title="Temporary presence"
                  className="presence-tick pointer-events-none absolute"
                  style={{
                    left: home.x,
                    top: home.y,
                    animationDelay: `${i * 0.55}s`,
                    opacity: a.status === "idle" ? 0.28 : 0.7,
                  }}
                />
              );
            })
          : null}
        {packet ? (
          <span
            data-protocol-packet
            aria-hidden
            title="Mandate in transit. Not an agent body."
            className={cn("protocol-packet pointer-events-none absolute z-20", gated && "protocol-packet-gate")}
            style={{ left: packet.x, top: packet.y }}
          />
        ) : null}
      </div>

      {inspect ? (
        <div className="pointer-events-none absolute bottom-20 left-4 z-10 max-w-sm rounded-md bg-obsidian/50 px-3 py-2 shadow-[var(--shadow-border)] backdrop-blur-sm sm:left-6">
          <p className="font-display text-xs font-semibold tracking-[0.16em] text-cyan">{inspect.name}</p>
          <p className="mt-1 text-2xs tracking-[0.14em] text-mute uppercase">
            {inspect.kind} · {inspect.status}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function DistrictNode({
  district,
  active,
  dim,
  named,
  hold,
  onHover,
  onSelect,
}: {
  district: District;
  active: boolean;
  dim: boolean;
  named: boolean;
  hold?: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const flushRight = parseFloat(district.x) > 72;
  const residents = AGENTS.filter((a) => a.districtId === district.id);
  const construct = district.id === "construct";
  const mission = district.id === "mission";
  const atg = district.id === "atg";
  const utility = district.id === "utility";
  const parallax = district.id === "parallax";
  const planned = district.status === "PLANNED";
  const isolate = construct || utility || parallax;
  const scale = depthScale(district.y, active, mission, isolate);

  return (
    <button
      type="button"
      data-district={district.id}
      aria-label={`Enter ${district.name}`}
      onMouseEnter={() => onHover(district.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(district.id)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(district.id)}
      className={cn(
        "group absolute z-10 flex flex-col",
        flushRight ? "items-end" : "items-start",
        dim && "opacity-45",
        planned && !active && "opacity-70",
      )}
      style={{
        left: district.x,
        top: district.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      <span className="relative flex size-12 items-center justify-center">
        {active ? (
          <>
            <span className="topo-orbit pointer-events-none absolute" />
            <span className="topo-orbit topo-orbit-2 pointer-events-none absolute" />
          </>
        ) : null}
        <span
          className={cn(
            "pointer-events-none absolute left-1/2 top-[62%] h-2 w-8 -translate-x-1/2 rounded-full blur-[2px]",
            construct ? "bg-pink/70" : utility ? "bg-red/70" : parallax ? "bg-cyan/70" : "bg-cyan/60",
          )}
        />
        <span
          className={cn(
            "topo-node absolute",
            mission && "topo-node-mission",
            construct && "topo-node-construct",
            utility && "topo-node-utility",
            parallax && "topo-node-parallax",
            atg && "topo-node-atg",
            hold && "topo-node-gate",
            active && "topo-node-active",
          )}
        />
        <span
          className={cn(
            "city-pulse absolute size-8 rounded-full",
            construct ? "bg-pink/25" : utility ? "bg-red/25" : "bg-cyan/20",
          )}
        />
      </span>
      <span
        className={cn(
          "topo-code absolute top-2 font-mono text-2xs font-semibold tracking-[0.14em]",
          construct && "topo-code-pink",
          utility && "topo-code-red",
          parallax && "topo-code-parallax",
          flushRight ? "right-12" : "left-12",
        )}
      >
        {district.code}
      </span>
      {named ? (
        <span
          className={cn(
            "topo-code absolute top-7 max-w-[10rem] text-2xs tracking-[0.1em]",
            construct && "topo-code-pink",
            utility && "topo-code-red",
            parallax && "topo-code-parallax",
            flushRight ? "right-12 text-right" : "left-12 text-left",
          )}
        >
          {district.name}
        </span>
      ) : null}
      {active && residents.length ? (
        <span
          className={cn(
            "topo-code absolute top-16 max-w-[11rem] text-2xs tracking-[0.12em]",
            flushRight ? "right-0 text-right" : "left-0 text-left",
          )}
        >
          {residents.map((a) => a.name).join(" · ")}
        </span>
      ) : null}
    </button>
  );
}