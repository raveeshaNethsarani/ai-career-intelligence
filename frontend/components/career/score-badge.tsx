import { Badge } from "@/components/ui/badge";
import { scoreBand } from "@/lib/format";

const STYLES = {
  strong: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  moderate: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  weak: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
} as const;

export function ScoreBadge({ score }: { score: number | null }) {
  const band = scoreBand(score);
  if (band === "none") return <Badge variant="outline">Not scored</Badge>;
  return (
    <Badge variant="secondary" className={STYLES[band]}>
      {Math.round(score as number)}%
    </Badge>
  );
}
