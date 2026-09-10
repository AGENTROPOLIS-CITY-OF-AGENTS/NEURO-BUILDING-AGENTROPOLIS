import { AtralMark, AtralStrip, AtranicFields } from "@/components/atral-script";
import { DestLink } from "@/components/dest-link";
import {
  AGENT_ECONOMY,
  ATG_CTAS,
  ATG_HERO,
  ATG_NAME,
  ATG_QUESTIONS,
  ATG_SECONDARY,
  ATG_STACK,
  ATG_STANDARD,
  ATG_SUBTITLE,
  ATG_THESIS,
  ATG_WHY,
  ATG_WHY_BODY,
  ATRANIC_CYCLE,
  ATRALITH_KIT,
  ATRALITH_LINE,
  PROTOCOL_RUNS,
} from "@/lib/atg";
import { destById } from "@/lib/destinations";

export function AtgInterior({
  onProtocol,
  onMcp,
  onDistrict,
}: {
  onProtocol: (at?: number) => void;
  onMcp: () => void;
  onDistrict: (id: string) => void;
}) {
  const atg = destById("atg-pages");
  const kit = destById("atralith-kit");
  const mcp = destById("mcp-pages");

  const go = (action: "atg" | "mcp" | "city" | "protocol" | "parallax") => {
    if (action === "protocol") onProtocol(0);
    else if (action === "mcp") onMcp();
    else if (action === "parallax") onDistrict("parallax");
    else if (action === "city") onDistrict("mission");
  };

  return (
    <div data-atg-floor>
      <p className="text-2xs tracking-[0.2em] text-cyan uppercase">{ATG_SUBTITLE}</p>
      <p className="mt-2 font-display text-xl font-semibold tracking-tight text-paper">{ATG_NAME}</p>
      <p className="mt-3 text-sm leading-relaxed text-paper">{ATG_THESIS}</p>
      <p className="mt-2 text-sm leading-relaxed text-mute">{ATG_HERO}</p>
      <button
        type="button"
        data-atg-run
        onClick={() => onProtocol(0)}
        className="mt-4 h-11 w-full rounded-md bg-paper px-4 text-2xs tracking-[0.14em] text-obsidian shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:bg-cyan active:scale-[0.96]"
      >
        RUN A MANDATE
      </button>

      <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Stack</p>
      <ul className="mt-2 flex flex-col gap-1">
        {ATG_STACK.map((layer) => (
          <li key={layer.id} className="rounded-md px-3 py-2 shadow-[var(--shadow-border)]">
            <p className="font-display text-xs font-semibold tracking-[0.08em] text-paper">{layer.name}</p>
            <p className="mt-1 text-2xs leading-relaxed text-mute">{layer.role}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Why ATG must exist</p>
      <p className="mt-2 text-sm leading-relaxed text-mute">{ATG_WHY_BODY}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {ATG_WHY.map((item) => (
          <li key={item} className="rounded-sm px-2 py-1 text-2xs tracking-[0.12em] text-paper shadow-[var(--shadow-border)]">
            {item}
          </li>
        ))}
      </ul>
      <ul className="mt-3 flex flex-col gap-1">
        {ATG_QUESTIONS.map((q) => (
          <li key={q} className="text-2xs tracking-[0.08em] text-mute">
            {q}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Protocol geography</p>
      <p className="mt-2 text-2xs leading-relaxed text-dim">
        The city is the operating surface. Each hop is a contract moment.
      </p>
      <ol className="mt-2 flex flex-col gap-1">
        {PROTOCOL_RUNS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              data-atg-hop={s.id}
              onClick={() => onProtocol(i)}
              className="flex h-11 w-full items-center gap-3 rounded-md px-3 text-left shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:text-cyan active:scale-[0.96]"
            >
              <AtralMark kind={s.glyph} className="size-4 text-cyan" />
              <span className="min-w-0">
                <span className="block truncate text-xs text-paper">{s.title}</span>
                <span className="block truncate text-2xs tracking-[0.12em] text-mute uppercase">{s.kicker}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Atranic</p>
      <p className="mt-2 text-sm leading-relaxed text-mute">
        The semantic language inside ATG. It describes what agent messages mean.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {ATRANIC_CYCLE.map((cycle) => (
          <li key={cycle.phase}>
            <p className="text-2xs tracking-[0.16em] text-cyan uppercase">{cycle.phase}</p>
            <div className="mt-1">
              <AtranicFields fields={cycle.fields} />
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Atral Script</p>
      <p className="mt-2 text-sm leading-relaxed text-mute">
        Visual language tied to identity, intent, authority, and protocol meaning. Not random symbols.
      </p>
      <div className="mt-3">
        <AtralStrip />
      </div>

      <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">ATRALITH</p>
      <p className="mt-2 text-sm leading-relaxed text-mute">{ATRALITH_LINE}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {ATRALITH_KIT.map((item) => (
          <li key={item} className="rounded-sm px-2 py-1 text-2xs tracking-[0.12em] text-paper shadow-[var(--shadow-border)]">
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Agent economy</p>
      <ul className="mt-2 grid grid-cols-2 gap-2">
        {AGENT_ECONOMY.map((item) => (
          <li key={item.id} className="rounded-md px-3 py-2 shadow-[var(--shadow-border)]">
            <p className="text-2xs tracking-[0.16em] text-cyan uppercase">{item.name}</p>
            <p className="mt-1 text-2xs leading-relaxed text-mute">{item.body}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Open standard</p>
      <p className="mt-2 text-sm leading-relaxed text-mute">
        ATG is the protocol. ATRALITH is the reference kit. Dependent on no model, no runtime, no MCP server, no vendor.
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {ATG_STANDARD.map((item) => (
          <li key={item} className="rounded-sm px-2 py-1 text-2xs tracking-[0.12em] text-paper shadow-[var(--shadow-border)]">
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Surfaces</p>
      <ul className="mt-2 flex flex-col gap-1">
        {atg ? (
          <li>
            <DestLink dest={atg} />
            <p className="px-3 pt-1 text-2xs leading-relaxed text-dim">{atg.note}</p>
          </li>
        ) : null}
        {kit ? (
          <li>
            <DestLink dest={kit} />
            <p className="px-3 pt-1 text-2xs leading-relaxed text-dim">{kit.note}</p>
          </li>
        ) : null}
        {mcp ? (
          <li>
            <DestLink dest={mcp} />
            <p className="px-3 pt-1 text-2xs leading-relaxed text-dim">{mcp.note}</p>
          </li>
        ) : null}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        {ATG_CTAS.map((cta) => (
          <button
            key={cta.id}
            type="button"
            onClick={() => {
              if (cta.id === "build") onProtocol(1);
              else if (cta.id === "implement") onProtocol(3);
              else onMcp();
            }}
            className="h-11 rounded-md bg-obsidian-2 px-4 text-2xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:text-cyan active:scale-[0.96]"
          >
            {cta.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {ATG_SECONDARY.map((cta) => (
          <button
            key={cta.id}
            type="button"
            onClick={() => go(cta.action)}
            className="h-11 rounded-md px-4 text-2xs tracking-[0.14em] text-mute shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:text-cyan active:scale-[0.96]"
          >
            {cta.label}
          </button>
        ))}
      </div>
    </div>
  );
}
