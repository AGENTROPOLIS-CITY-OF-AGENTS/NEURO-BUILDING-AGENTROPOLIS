import { cn } from "@/lib/utils";
import {
  COMPUTE_LABEL,
  COMPUTE_NOTE,
  COMPUTE_WEIGHTS,
  CORRIDOR,
  GATE_COPY,
  HIERARCHY,
  agentStateOf,
  gateForAgent,
  gateForStatus,
  QUANTIZE_LAW,
  type ComputeWeight,
  type CorridorStep,
  type GateKind,
  type ResponseSceneKind,
} from "@/lib/design-system";
import type { Agent, District, GridStatus } from "@/lib/grid";
import { INFO_CAPS, INFO_LABEL, deeperLabel, type InfoDepth } from "@/lib/info";
import { StatusChip } from "@/components/status-chip";

export function Disclose({
  depth,
  onDeeper,
}: {
  depth: InfoDepth;
  onDeeper: () => void;
}) {
  const label = deeperLabel(depth);
  if (!label) return null;
  return (
    <button
      type="button"
      data-disclose={depth}
      onClick={onDeeper}
      className="mt-4 flex h-11 w-full items-center justify-between rounded-md px-3 text-left shadow-[var(--shadow-border)] hover:text-cyan"
    >
      <span className="font-mono text-2xs tracking-[0.16em] text-mute">{INFO_LABEL[depth]}</span>
      <span className="font-mono text-2xs tracking-[0.16em] text-cyan">{label} →</span>
    </button>
  );
}

export function AttentionStrip({
  gated,
  executing,
  live,
}: {
  gated: number;
  executing: number;
  live: number;
}) {
  return (
    <p className="hidden shrink-0 items-center gap-2 font-mono text-2xs tracking-[0.12em] sm:flex" data-attention>
      {gated ? <span className="text-red">{gated} APPROVAL</span> : null}
      {executing ? <span className="text-cyan">{executing} EXEC</span> : null}
      {live ? <span className="text-cyan">{live} LIVE</span> : <span className="text-dim">0 LIVE</span>}
    </p>
  );
}

export function ComputeDock({
  value,
  onChange,
  className,
}: {
  value: ComputeWeight;
  onChange: (next: ComputeWeight) => void;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center rounded-md bg-obsidian/55 p-0.5 shadow-[var(--shadow-border)]", className)}
      role="group"
      aria-label={QUANTIZE_LAW}
      title={`${QUANTIZE_LAW} ${COMPUTE_NOTE[value]}`}
    >
      {COMPUTE_WEIGHTS.map((tier) => (
        <button
          key={tier}
          type="button"
          data-compute={tier}
          onClick={() => onChange(tier)}
          className={cn(
            "h-11 min-w-9 px-1.5 font-mono text-2xs tracking-[0.12em] uppercase transition-colors duration-150 sm:px-2",
            value === tier ? "bg-obsidian-3 text-cyan" : "text-mute hover:text-cyan",
          )}
        >
          {COMPUTE_LABEL[tier]}
        </button>
      ))}
    </div>
  );
}

export function Corridor({
  active,
  className,
}: {
  active?: CorridorStep | null;
  className?: string;
}) {
  const idx = active ? CORRIDOR.indexOf(active) : -1;
  return (
    <ol className={cn("flex flex-wrap items-center gap-1", className)} data-corridor aria-label="Execution corridor">
      {CORRIDOR.map((step, i) => {
        const done = idx >= 0 && i < idx;
        const here = step === active;
        return (
          <li key={step} className="flex items-center gap-1">
            {i > 0 ? <span className={cn("text-2xs", done || here ? "text-cyan" : "text-dim")}>→</span> : null}
            <span
              data-gate={here ? "path" : done ? "receipt" : "locked"}
              className={cn(
                "rounded-sm px-1.5 py-0.5 font-mono text-2xs tracking-[0.12em]",
                here && "bg-cyan/15 text-cyan",
                done && !here && "text-cyan",
                !done && !here && "text-dim",
              )}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function HierarchyTrail({
  at,
  className,
}: {
  at?: string;
  className?: string;
}) {
  return (
    <p className={cn("font-mono text-2xs tracking-[0.16em] text-mute uppercase", className)} data-hierarchy>
      {HIERARCHY.map((level, i) => (
        <span key={level}>
          {i > 0 ? <span className="text-dim"> → </span> : null}
          <span className={level === at ? "text-cyan" : undefined}>{level}</span>
        </span>
      ))}
    </p>
  );
}

export function GateChip({ kind, label }: { kind: GateKind; label?: string }) {
  return (
    <span
      data-gate={kind}
      title={GATE_COPY[kind]}
      className={cn(
        "inline-flex h-6 items-center rounded-sm px-2 font-mono text-2xs tracking-[0.14em] uppercase",
        kind === "path" && "bg-cyan/15 text-cyan",
        kind === "receipt" && "text-cyan shadow-[var(--shadow-border)]",
        kind === "approval" && "gate-pulse text-red shadow-[var(--shadow-border)]",
        kind === "barrier" && "bg-red/15 text-red",
        kind === "locked" && "text-dim shadow-[var(--shadow-border)]",
      )}
    >
      {label ?? kind}
    </span>
  );
}

export function RuntimeChip({ label, tone = "path" }: { label: string; tone?: GateKind }) {
  return (
    <span
      data-runtime
      className={cn(
        "inline-flex h-6 items-center rounded-sm px-2 font-mono text-2xs tracking-[0.14em] uppercase",
        tone === "barrier" || tone === "approval" ? "text-red" : "text-cyan",
        "shadow-[var(--shadow-border)]",
      )}
    >
      {label}
    </span>
  );
}

export function AgentNode({
  agent,
  onOpen,
  onSelect,
}: {
  agent: Agent;
  onOpen?: (districtId: string) => void;
  onSelect?: (agentId: string) => void;
}) {
  const state = agentStateOf(agent.status);
  const gate = gateForAgent(agent.status);
  const inner = (
    <>
      <span className="min-w-0">
        <span className="block font-display text-sm font-semibold text-cyan">{agent.name}</span>
        <span className="block truncate text-2xs tracking-[0.12em] text-mute">
          {agent.role} · {agent.place}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <GateChip kind={gate} label={state} />
        <span className="text-2xs tracking-[0.12em] text-mute uppercase">{agent.runtime}</span>
      </span>
    </>
  );
  if (!onOpen && !onSelect) {
    return <div className="flex h-14 items-center justify-between gap-3 rounded-lg bg-obsidian-2 px-4 shadow-[var(--shadow-border)]">{inner}</div>;
  }
  return (
    <button
      type="button"
      data-agent={agent.id}
      onClick={() => {
        if (onSelect) onSelect(agent.id);
        else if (onOpen) onOpen(agent.districtId);
      }}
      className="flex h-14 w-full items-center justify-between gap-3 rounded-lg bg-obsidian-2 px-4 text-left shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:text-cyan active:scale-[0.96]"
    >
      {inner}
    </button>
  );
}

export function DistrictCard({
  district,
  onOpen,
}: {
  district: District;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(district.id)}
      className="flex w-full items-start justify-between gap-4 rounded-md px-4 py-3 text-left shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:text-cyan active:scale-[0.96]"
    >
      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-3">
          <span className="font-display text-sm font-semibold tracking-[0.12em] text-cyan">{district.name}</span>
          <span className="font-mono text-2xs text-dim">{district.code}</span>
          <span className="text-2xs tracking-[0.16em] text-mute uppercase">{district.kind}</span>
        </span>
        <span className="mt-1 block text-sm text-mute">{district.role}</span>
      </span>
      <StatusChip status={district.status} className="mt-1 shrink-0" />
    </button>
  );
}

export function ReceiptCard({
  id,
  title,
  body,
  verified,
}: {
  id: string;
  title: string;
  body: string;
  verified: boolean;
}) {
  return (
    <article data-receipt={id} className="rounded-md px-3 py-3 shadow-[var(--shadow-border)]">
      <p className="flex items-center justify-between gap-2">
        <span className="font-mono text-2xs tracking-[0.16em] text-cyan">{id}</span>
        <GateChip kind={verified ? "receipt" : "barrier"} label={verified ? "RECEIPT" : "UNVERIFIED"} />
      </p>
      <h3 className="mt-2 font-display text-sm font-semibold tracking-[0.08em] text-cyan">{title}</h3>
      <p className="mt-1 text-2xs leading-relaxed text-mute">{body}</p>
    </article>
  );
}

export function ResponseScene({
  kind,
  title,
  claim,
  evidence,
  agents,
  status,
}: {
  kind: ResponseSceneKind;
  title: string;
  claim: string;
  evidence: string[];
  agents?: { name: string; state: string }[];
  status?: GridStatus;
}) {
  const gate = status ? gateForStatus(status) : "receipt";
  return (
    <section data-response-scene={kind} className="response-scene mt-4 rounded-md px-3 py-3 shadow-[var(--shadow-border)]">
      <p className="flex items-center justify-between gap-2">
        <span className="font-mono text-2xs tracking-[0.18em] text-cyan">{kind}</span>
        <GateChip kind={gate} label={status ?? kind} />
      </p>
      <h3 className="mt-2 font-display text-sm font-semibold tracking-[0.08em] text-cyan">{title}</h3>
      <p className="mt-2 text-2xs leading-relaxed text-mute">
        <span className="text-dim">CLAIM · </span>
        {claim}
      </p>
      {agents?.length ? (
        <ul className="mt-3 flex flex-col gap-1">
          {agents.map((a) => (
            <li key={a.name} className="flex items-center justify-between gap-2 font-mono text-2xs tracking-[0.12em]">
              <span className="text-cyan">{a.name}</span>
              <span className="text-mute">{a.state}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="mt-3 flex flex-col gap-1">
        {evidence.map((line) => (
          <li key={line} className="text-2xs leading-relaxed text-mute">
            <span className="text-cyan">RECEIPT · </span>
            {line}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-2xs tracking-[0.12em] text-dim uppercase">Structured state. Not chain-of-thought.</p>
    </section>
  );
}

function sandboxOf(runtime: string): { kind: GateKind; label: string }[] {
  switch (runtime) {
    case "hermes":
      return [
        { kind: "path", label: "NETWORK ALLOWED" },
        { kind: "path", label: "TOOL APPROVED" },
        { kind: "locked", label: "PRODUCTION LOCKED" },
      ];
    case "nemoclaw":
      return [
        { kind: "barrier", label: "FILESYSTEM DENIED" },
        { kind: "barrier", label: "NETWORK DENIED" },
        { kind: "approval", label: "APPROVAL REQUIRED" },
      ];
    case "botbae":
      return [
        { kind: "path", label: "TOOL APPROVED" },
        { kind: "locked", label: "PRODUCTION LOCKED" },
      ];
    case "human":
      return [{ kind: "path", label: "AUTHORITY" }];
    case "local":
      return [
        { kind: "locked", label: "EDGE" },
        { kind: "locked", label: "GGUF NOT BUNDLED" },
      ];
    default:
      return [{ kind: "locked", label: "CAPABILITY UNAVAILABLE" }];
  }
}

export function AgentDock({
  agent,
  districtName,
  onBack,
  depth = "expand",
}: {
  agent: Agent;
  districtName: string;
  onBack: () => void;
  depth?: InfoDepth;
}) {
  const caps = INFO_CAPS[depth];
  const state = agentStateOf(agent.status);
  const gate = gateForAgent(agent.status);
  const corridor: CorridorStep =
    state === "COMPLETE" ? "RECEIPT" : state === "WAITING" ? "POLICY" : state === "EXECUTING" ? "EXECUTE" : "PLAN";
  return (
    <aside
      data-agent-dock={agent.id}
      data-info={depth}
      className="os-drawer absolute inset-x-0 bottom-28 z-40 flex max-h-80 flex-col rounded-t-xl bg-obsidian/88 shadow-[var(--shadow-border)] backdrop-blur-md md:inset-y-16 md:bottom-16 md:right-0 md:left-auto md:w-80 md:max-h-none md:rounded-l-xl"
    >
      <div className="flex items-start justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <p className="text-2xs tracking-[0.2em] text-cyan uppercase">Agent · {districtName}</p>
          <h2 className="mt-1 font-display text-lg font-semibold tracking-[0.08em] text-cyan">{agent.name}</h2>
          <HierarchyTrail at="AGENT" className="mt-2" />
        </div>
        <button type="button" onClick={onBack} className="flex size-11 items-center justify-center text-mute hover:text-cyan" aria-label="Back to district">
          ×
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        <Corridor className="mb-4" active={corridor} />
        <p className="text-2xs tracking-[0.16em] text-mute uppercase">Mandate</p>
        <p className="mt-1 text-sm leading-relaxed text-cyan">{agent.task || agent.role}</p>
        <p className="mt-4 text-2xs tracking-[0.16em] text-mute uppercase">Runtime surface</p>
        <div className="mt-2 flex flex-wrap gap-1">
          <RuntimeChip label={agent.runtime} tone={gate} />
          <GateChip kind={gate} label={state} />
        </div>
        {caps.sandbox ? (
          <>
            <p className="mt-4 text-2xs tracking-[0.16em] text-mute uppercase">NEMOCLAW bounds · representation</p>
            <ul className="mt-2 flex flex-wrap gap-1">
              {sandboxOf(agent.runtime).map((b) => (
                <li key={b.label}>
                  <GateChip kind={b.kind} label={b.label} />
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {caps.response ? (
          <ResponseScene
            kind="AGENT STATUS"
            title={agent.name}
            claim={agent.task || agent.role}
            agents={[{ name: agent.name, state }]}
            evidence={[
              `${districtName} · ${agent.place}`,
              "This floor shows state. It does not grant production authorization.",
            ]}
          />
        ) : null}
        <div className="mt-4">
          <ReceiptCard
            id={`RCPT-${agent.id.toUpperCase()}`}
            title="Preview receipt"
            body="Generated does not equal verified. Execute remains gated until a human says otherwise."
            verified={false}
          />
        </div>
      </div>
    </aside>
  );
}
