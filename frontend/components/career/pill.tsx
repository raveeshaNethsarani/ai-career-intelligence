import { cn } from "@/lib/utils";
import { DOT, TONE, type Tone } from "@/lib/tone";

export function Pill({
  tone = "neutral",
  dot = false,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONE[tone],
        className,
      )}
    >
      {dot ? <span className={cn("size-1.5 rounded-full", DOT[tone])} /> : null}
      {children}
    </span>
  );
}
