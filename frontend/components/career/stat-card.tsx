import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { TONE, type Tone } from "@/lib/tone";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
  trend,
}: {
  label: string;
  value: number | string;
  note: string;
  icon: LucideIcon;
  tone: Tone;
  trend?: number | null;
}) {
  const up = (trend ?? 0) >= 0;
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl border", TONE[tone])}>
          <Icon className="size-5" />
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        {trend !== undefined && trend !== null ? (
          <span className={cn("flex items-center font-medium", up ? "text-[#289E68]" : "text-[#D9423F]")}>
            {up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
            {Math.abs(trend)}%
          </span>
        ) : null}
        <span>{note}</span>
      </p>
    </div>
  );
}
