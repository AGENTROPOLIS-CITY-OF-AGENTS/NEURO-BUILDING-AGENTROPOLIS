import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { StatusChip } from "@/components/status-chip";
import {
  civicHosts,
  destFrame,
  destUrl,
  networkHosts,
  studioHosts,
  verifiedHosts,
  type Destination,
} from "@/lib/destinations";
import liveHosts from "@/lib/live-hosts.json";
import { cn } from "@/lib/utils";

export function DestLink({
  dest,
  className,
}: {
  dest: Destination;
  className?: string;
}) {
  const url = destUrl(dest);
  const inner = (
    <>
      <span className="min-w-0 truncate">{dest.label}</span>
      <StatusChip status={dest.status} className="shrink-0" />
    </>
  );
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        data-dest={dest.id}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-md px-3 text-left text-xs tracking-[0.08em] text-paper shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:text-cyan active:scale-[0.96]",
          className,
        )}
      >
        {inner}
      </a>
    );
  }
  return (
    <div
      data-dest={dest.id}
      className={cn(
        "flex h-11 w-full items-center justify-between gap-3 rounded-md px-3 text-xs tracking-[0.08em] text-mute shadow-[var(--shadow-border)]",
        className,
      )}
    >
      {inner}
    </div>
  );
}

function hostOf(dest: Destination) {
  return dest.href?.replace(/^https:\/\//, "").replace(/\/$/, "") ?? dest.label;
}

export function StudioRail({ className }: { className?: string }) {
  return (
    <nav
      data-studio-hosts="rail"
      aria-label="NEURO MetaX studio hosts"
      className={cn("hidden items-center gap-0.5 md:flex", className)}
    >
      <span className="pr-1 font-mono text-2xs tracking-[0.16em] text-cyan uppercase">Studio</span>
      {studioHosts().map((dest) => (
        <a
          key={dest.id}
          href={dest.href}
          target="_blank"
          rel="noreferrer"
          data-dest={dest.id}
          title={`${dest.label} · LIVE`}
          className="inline-flex h-11 items-center px-1.5 font-mono text-2xs tracking-[0.04em] text-paper/80 transition-colors duration-150 hover:text-cyan"
        >
          {hostOf(dest).replace("neurometax", "")}
        </a>
      ))}
    </nav>
  );
}

function kenDelay(id: string) {
  let n = 0;
  for (const ch of id) n = (n + ch.charCodeAt(0) * 13) % 17;
  return n;
}

export function HostCard({ dest, live = true }: { dest: Destination; live?: boolean }) {
  const url = destUrl(dest);
  const shot = destFrame(dest);
  const body = (
    <>
      {shot ? (
        <span className={cn("host-promo host-live-shot relative mb-2 block aspect-video overflow-hidden rounded-sm ring-1 ring-cyan/35", !live && "host-live-shot-still")}>
          <img
            src={shot}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
            style={{ animationDelay: `-${kenDelay(dest.id)}s` }}
          />
        </span>
      ) : null}
      <span className="flex items-center justify-between gap-2">
        <span className="font-display text-sm font-semibold tracking-[0.08em] text-paper">{dest.label}</span>
        <StatusChip status={dest.status} />
      </span>
      <span className="mt-0.5 font-mono text-2xs tracking-[0.04em] text-cyan">{hostOf(dest)}</span>
    </>
  );
  const cls =
    "flex min-h-11 w-full flex-col justify-center rounded-md bg-obsidian/45 px-3 py-2 text-left shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:text-cyan hover:shadow-[var(--shadow-border-hover)] active:scale-[0.96]";
  if (url) {
    return (
      <a href={url} target="_blank" rel="noreferrer" data-dest={dest.id} data-host-promo={shot ? "1" : undefined} className={cls}>
        {body}
      </a>
    );
  }
  return (
    <div data-dest={dest.id} className={cls}>
      {body}
    </div>
  );
}

function HostFold({
  id,
  kicker,
  label,
  count,
  children,
}: {
  id: string;
  kicker: string;
  label: string;
  count: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section data-host-fold={id} className="rounded-md bg-obsidian/25 ring-1 ring-cyan/18 backdrop-blur-sm">
      <button
        type="button"
        data-host-fold-toggle={id}
        aria-expanded={open}
        aria-controls={`host-fold-${id}`}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center justify-between gap-3 px-3 text-left transition-colors duration-150 hover:text-cyan"
      >
        <span className="min-w-0 truncate">
          <span className="font-mono text-2xs tracking-[0.16em] text-cyan uppercase">{kicker}</span>
          <span className="ml-2 text-2xs text-mute">{label}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="font-mono text-2xs tabular-nums text-dim">{String(count).padStart(2, "0")}</span>
          <ChevronDown
            className={cn("size-4 text-mute transition-transform duration-150 ease-out", open && "rotate-180 text-cyan")}
            aria-hidden
          />
        </span>
      </button>
      <div
        id={`host-fold-${id}`}
        className={cn("grid transition-[grid-template-rows] duration-200 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

/** Start Here host stack: AGENTROPOLIS stays open. NEURO and network fold away. */
export function StartHosts({ className }: { className?: string }) {
  const civic = civicHosts();
  const studio = studioHosts();
  const network = networkHosts();
  return (
    <div data-start-hosts className={cn("flex flex-col gap-2", className)}>
      {civic.map((dest) => (
        <section key={dest.id} data-civic-host className="rounded-md bg-obsidian/25 p-3 ring-1 ring-cyan/28 backdrop-blur-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-2xs tracking-[0.18em] text-cyan uppercase">AGENTROPOLIS</p>
            <p className="text-2xs text-mute">Civic host · LIVE</p>
          </div>
          <div className="mt-2">
            <HostCard dest={dest} />
          </div>
        </section>
      ))}
      <HostFold id="neuro" kicker="NEURO" label="Studio hosts" count={studio.length}>
        <ul className="grid gap-2 sm:grid-cols-3">
          {studio.map((dest) => (
            <li key={dest.id}>
              <HostCard dest={dest} />
            </li>
          ))}
        </ul>
      </HostFold>
      <HostFold id="network" kicker="Network" label="Live hosts" count={network.length}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {network.map((dest) => (
            <li key={dest.id}>
              <HostCard dest={dest} />
            </li>
          ))}
        </ul>
      </HostFold>
    </div>
  );
}

export function VerifiedHosts({ className }: { className?: string }) {
  return (
    <section
      data-verified-hosts
      className={cn("rounded-md bg-obsidian/25 p-3 ring-1 ring-cyan/18 backdrop-blur-sm", className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-2xs tracking-[0.18em] text-cyan uppercase">Verified LIVE hosts</p>
        <p className="text-2xs text-mute">Live captures · working build</p>
      </div>
      <p className="mt-1 font-mono text-2xs tracking-[0.08em] text-dim">
        Under construction. Screenshots of the live sites, not cinematic stand-ins. Captured {new Date(liveHosts.capturedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.
      </p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {verifiedHosts().map((dest) => (
          <li key={dest.id}>
            <HostCard dest={dest} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function StudioHosts({ className }: { className?: string }) {
  return (
    <section
      data-studio-hosts="panel"
      className={cn("rounded-md bg-obsidian/92 p-3 ring-1 ring-cyan/50 backdrop-blur-md", className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-2xs tracking-[0.18em] text-cyan uppercase">NEURO MetaX · verified LIVE</p>
        <p className="text-2xs text-mute">Not GitHub Pages.</p>
      </div>
      <ul className="mt-2 grid gap-2 sm:grid-cols-3">
        {studioHosts().map((dest) => (
          <li key={dest.id}>
            <HostCard dest={dest} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function NetworkHosts({ className }: { className?: string }) {
  return (
    <section
      data-network-hosts="panel"
      className={cn("rounded-md bg-obsidian/92 p-3 ring-1 ring-pink/45 backdrop-blur-md", className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-2xs tracking-[0.18em] text-pink uppercase">Network · verified LIVE</p>
        <p className="text-2xs text-mute">Not GitHub Pages. Not wiredchaos.github.io.</p>
      </div>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {networkHosts().map((dest) => (
          <li key={dest.id}>
            <HostCard dest={dest} />
          </li>
        ))}
      </ul>
    </section>
  );
}
