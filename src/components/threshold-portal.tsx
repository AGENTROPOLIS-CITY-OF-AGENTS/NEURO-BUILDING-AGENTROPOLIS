import { cn } from "@/lib/utils";

type ThresholdPortalProps = {
  label?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
} & Record<`data-${string}`, string | undefined>;

export function ThresholdPortal({ label = "Enter", onClick, href, className, ...data }: ThresholdPortalProps) {
  const inner = (
    <>
      <span className="threshold-portal-frame" aria-hidden>
        <span className="threshold-portal-well" />
        <span className="threshold-portal-leaf is-left" />
        <span className="threshold-portal-leaf is-right" />
        <span className="threshold-portal-sill" />
      </span>
      <span className="threshold-portal-copy">{label}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cn("threshold-portal", className)} aria-label={label} {...data}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cn("threshold-portal", className)} aria-label={label} {...data}>
      {inner}
    </button>
  );
}
