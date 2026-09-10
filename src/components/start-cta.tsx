import { cn } from "@/lib/utils";
import { QUANTIZE_LAW } from "@/lib/design-system";

const LINES = [
  { text: "THE CITY IS THE", tone: "cyan" },
  { text: "OPERATING", tone: "red" },
  { text: "SURFACE.", tone: "mix" },
] as const;

export function StartCta({
  onEnter,
  className,
}: {
  onEnter: () => void;
  className?: string;
}) {
  return (
    <section data-start-cta className={cn("relative mx-auto flex max-w-5xl flex-col items-center px-4 text-center", className)}>
      <p className="hero-kicker">AGENTROPOLIS</p>
      <h1 className="hero-type">
        {LINES.map((line) => (
          <span key={line.text} className={cn("hero-type-line", `is-${line.tone}`)}>
            <span className="hero-type-extrude" aria-hidden>
              {line.text}
            </span>
            <span className="hero-type-face" data-text={line.text}>
              {line.text}
            </span>
          </span>
        ))}
      </h1>
      <p className="hero-sub">Explore · Build · Connect · Deploy</p>
      <p data-quantize className="hero-quantize">
        {QUANTIZE_LAW}
      </p>
      <button type="button" data-start-enter className="sr-only" onClick={onEnter}>
        Enter the city
      </button>
    </section>
  );
}
