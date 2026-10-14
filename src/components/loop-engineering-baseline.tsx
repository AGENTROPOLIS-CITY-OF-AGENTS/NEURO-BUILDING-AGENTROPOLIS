import { useState } from "react";

const FLOW = [
  "Cheap Gates",
  "Reflex Decision",
  "QRAG",
  "Dense Feedback",
  "Quantization Torque",
  "VERITY",
  "Receipt",
  "Audit",
] as const;

const TERMINAL = [
  "Completed",
  "Blocked",
  "Budget Exhausted",
  "Review Required",
  "Retry Eligible",
  "Failed",
] as const;

export function LoopEngineeringBaseline() {
  const [open, setOpen] = useState(false);

  return (
    <aside className="fixed right-3 bottom-3 z-[90] flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-2 sm:right-5 sm:bottom-5">
      {open ? (
        <section
          id="qrag-baseline-panel"
          aria-label="AGENTROPOLIS bounded cognition baseline"
          className="w-[min(28rem,calc(100vw-1.5rem))] rounded-xl bg-obsidian/95 p-4 text-paper shadow-[var(--shadow-border)] backdrop-blur-xl"
        >
          <p className="text-2xs tracking-[0.2em] text-cyan uppercase">
            AGENTROPOLIS · Bounded Cognition
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold tracking-tight text-paper">
            Loop Engineering Baseline
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-mute">
            QRAG is the Quantized Retrieval-Augmented Generation Loop: a bounded closed-loop retrieval architecture that
            iteratively retrieves, evaluates, executes, verifies, and re-queries under explicit token, cost, quality, and
            retry constraints.
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Bounded cognition flow">
            {FLOW.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <span
                  className={
                    item === "QRAG" || item === "Quantization Torque"
                      ? "rounded-md bg-cyan/10 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-cyan shadow-[var(--shadow-border)]"
                      : "rounded-md bg-obsidian-2 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-paper shadow-[var(--shadow-border)]"
                  }
                >
                  {item}
                </span>
                {index < FLOW.length - 1 ? <span className="text-cyan/60">→</span> : null}
              </span>
            ))}
          </div>

          <div className="mt-3 rounded-md bg-obsidian-2 p-3 shadow-[var(--shadow-border)]">
            <p className="font-mono text-[10px] tracking-[0.12em] text-cyan uppercase">
              Retrieve → Evaluate → Execute → Verify → Re-query ↻
            </p>
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] text-mute sm:grid-cols-4">
              <span>Token Budget</span>
              <span>Cost Budget</span>
              <span>Quality Threshold</span>
              <span>Retry Limit</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center font-mono text-[10px] tracking-[0.08em] uppercase">
            <span className="rounded-md bg-cyan/10 px-2 py-1.5 text-cyan">Increase</span>
            <span className="rounded-md bg-red/10 px-2 py-1.5 text-red">Decrease</span>
            <span className="rounded-md bg-cyan/10 px-2 py-1.5 text-cyan">Redirect</span>
          </div>

          <p className="mt-3 border-l-2 border-red pl-3 text-xs leading-relaxed text-paper">
            <strong>Classifier output is evidence, not authority.</strong> AEGIS, the Execution Envelope, tool permissions,
            and explicit human approval remain separate gates.
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Loop terminal states">
            {TERMINAL.map((state) => (
              <span key={state} className="rounded-full bg-obsidian-3 px-2 py-1 font-mono text-[9px] tracking-[0.08em] text-mute uppercase">
                {state}
              </span>
            ))}
          </div>

          <p className="mt-3 text-[10px] leading-relaxed text-dim">
            Architecture disclosure only. Values are not presented as live telemetry unless connected to an attributable runtime source.
          </p>
        </section>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-controls="qrag-baseline-panel"
        onClick={() => setOpen((value) => !value)}
        className="h-11 rounded-full bg-obsidian/92 px-4 font-mono text-[10px] font-semibold tracking-[0.14em] text-cyan shadow-[var(--shadow-border)] backdrop-blur-xl transition-transform active:scale-[0.97]"
      >
        QRAG BASELINE
      </button>
    </aside>
  );
}
