const TZ = "Asia/Colombo";

export function formatDate(iso: string | null): string {
  if (!iso) return "Unknown date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  return d.toLocaleDateString("en-GB", { timeZone: TZ, day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString("en-GB", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function dayKey(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-CA", { timeZone: TZ });
}

const SOURCES: Record<string, string> = {
  remotive: "Remotive",
  arbeitnow: "Arbeitnow",
  synthetic: "Sample data",
};

export function sourceLabel(source: string): string {
  return SOURCES[source] ?? source;
}

export function safeHttpsUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return /^https:\/\/[^\s]+$/.test(url) ? url : null;
}

export type ScoreBand = "strong" | "moderate" | "weak" | "none";

export function scoreBand(score: number | null): ScoreBand {
  if (score === null || Number.isNaN(score)) return "none";
  if (score >= 70) return "strong";
  if (score >= 50) return "moderate";
  return "weak";
}
