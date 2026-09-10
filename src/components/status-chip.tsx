import { cn } from "@/lib/utils";
import type { GridStatus } from "@/lib/grid";

export type ChipStatus = GridStatus | "MISSING";

export function StatusChip({ status, className }: { status: ChipStatus; className?: string }) {
  return (
    <span
      data-gate={
        status === "LIVE" ? "path" : status === "MISSING" || status === "OFFLINE" ? "barrier" : status === "PLANNED" ? "locked" : "receipt"
      }
      className={cn(
        "inline-flex h-6 items-center rounded-sm px-2 font-mono text-2xs tracking-[0.14em]",
        status === "LIVE" && "bg-cyan/15 text-cyan",
        status === "AVAILABLE" && "text-cyan shadow-[var(--shadow-border)]",
        status === "PLANNED" && "text-mute shadow-[var(--shadow-border)]",
        status === "OFFLINE" && "bg-red/15 text-red",
        status === "PREVIEW" && "text-mute shadow-[var(--shadow-border)]",
        status === "MISSING" && "text-red shadow-[var(--shadow-border)]",
        className,
      )}
    >
      {status}
    </span>
  );
}