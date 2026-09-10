import type { AtralClass } from "@/lib/atg";
import { ATRAL_CLASSES } from "@/lib/atg";
import { cn } from "@/lib/utils";

const GLYPH: Record<AtralClass, string> = {
  identity: "M12 3 L19 12 L12 21 L5 12 Z M12 8 V16",
  intent: "M4 12 H16 M12 6 L18 12 L12 18",
  authority: "M7 20 V8 H9 V20 M15 20 V8 H17 V20 M5 8 H19",
  mandate: "M6 6 H18 V18 H6 Z M9 9 H15 V15 H9 Z",
  capability: "M5 12 H19 M12 5 L19 12 L12 19",
  evidence: "M6 16 H18 M6 12 H14 M6 8 H10",
  receipt: "M7 5 H17 V19 H7 Z M10 9 H14 M10 13 H14 M10 17 H12",
  protocol: "M12 4 V20 M4 12 H20 M7.5 7.5 L16.5 16.5 M16.5 7.5 L7.5 16.5",
};

export function AtralMark({
  kind,
  className,
  title,
}: {
  kind: AtralClass;
  className?: string;
  title?: string;
}) {
  const meta = ATRAL_CLASSES.find((c) => c.id === kind);
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-6 shrink-0", className)}
      aria-hidden={!title}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path
        d={GLYPH[kind]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <desc>{meta?.meaning ?? kind}</desc>
    </svg>
  );
}

export function AtralStrip({
  active,
  compact,
}: {
  active?: AtralClass;
  compact?: boolean;
}) {
  const items = compact
    ? ATRAL_CLASSES.filter((c) =>
        ["identity", "mandate", "authority", "evidence", "receipt"].includes(c.id),
      )
    : ATRAL_CLASSES;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Atral Script classes">
      {items.map((c) => (
        <li key={c.id}>
          <span
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-md px-2 text-2xs tracking-[0.14em] uppercase shadow-[var(--shadow-border)]",
              active === c.id ? "text-cyan" : "text-mute",
            )}
            title={c.meaning}
          >
            <AtralMark kind={c.id} />
            <span className="hidden sm:inline">{c.label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function AtranicFields({ fields, active }: { fields: readonly string[]; active?: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Atranic fields">
      {fields.map((field) => (
        <li
          key={field}
          className={cn(
            "rounded-sm px-2 py-1 font-mono text-2xs tracking-[0.08em] shadow-[var(--shadow-border)]",
            active === field ? "text-cyan" : "text-paper",
          )}
        >
          {field}
        </li>
      ))}
    </ul>
  );
}
