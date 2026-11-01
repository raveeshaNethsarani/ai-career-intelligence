import { Pill } from "@/components/career/pill";
import { scoreBand } from "@/lib/format";

export function ScoreBadge({ score }: { score: number | null }) {
  const band = scoreBand(score);
  if (band === "none") return <Pill tone="neutral">Not scored</Pill>;

  const tone = band === "strong" ? "success" : band === "moderate" ? "info" : "warning";
  return (
    <Pill tone={tone} dot>
      {Math.round(score as number)}% match
    </Pill>
  );
}
