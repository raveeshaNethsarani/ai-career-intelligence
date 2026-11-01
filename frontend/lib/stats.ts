import { dayKey } from "@/lib/format";
import type { Job } from "@/lib/types";

const DAY = 86400000;

export function countBy<T>(items: T[], key: (item: T) => string): Map<string, number> {
  const m = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

export function weekTrend(jobs: Job[], now: number = Date.now()) {
  let current = 0;
  let previous = 0;
  for (const j of jobs) {
    if (!j.posted_at) continue;
    const t = new Date(j.posted_at).getTime();
    if (Number.isNaN(t)) continue;
    const age = now - t;
    if (age < 0) continue;
    if (age < 7 * DAY) current += 1;
    else if (age < 14 * DAY) previous += 1;
  }
  const pct = previous === 0 ? null : Math.round(((current - previous) / previous) * 1000) / 10;
  return { current, previous, pct };
}

export function dailySeries(
  jobs: Job[],
  sources: string[],
  days: number,
  now: number = Date.now(),
): Record<string, string | number>[] {
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const k = dayKey(new Date(now - i * DAY).toISOString());
    if (k) keys.push(k);
  }

  const rows = new Map<string, Record<string, number>>();
  for (const k of keys) {
    const row: Record<string, number> = {};
    for (const s of sources) row[s] = 0;
    rows.set(k, row);
  }

  for (const j of jobs) {
    if (!j.posted_at || !sources.includes(j.source)) continue;
    const k = dayKey(j.posted_at);
    const row = k ? rows.get(k) : undefined;
    if (row) row[j.source] += 1;
  }

  return keys.map((k) => ({ day: k.slice(5), ...(rows.get(k) ?? {}) }));
}

export function companyCount(jobs: Job[]): number {
  const names = new Set<string>();
  for (const j of jobs) {
    const name = (j.company ?? "").trim();
    if (name) names.add(name);
  }
  return names.size;
}

export type CompanyRow = {
  company: string;
  jobs: number;
  remote: number;
  sources: string[];
  latest: string | null;
};

export function topCompanies(jobs: Job[], limit: number): CompanyRow[] {
  const map = new Map<string, { company: string; jobs: number; remote: number; sources: Set<string>; latest: string | null }>();
  for (const j of jobs) {
    const name = (j.company ?? "").trim();
    if (!name) continue;
    const entry = map.get(name) ?? { company: name, jobs: 0, remote: 0, sources: new Set<string>(), latest: null };
    entry.jobs += 1;
    if (j.work_mode === "remote") entry.remote += 1;
    entry.sources.add(j.source);
    if (j.posted_at && (!entry.latest || j.posted_at > entry.latest)) entry.latest = j.posted_at;
    map.set(name, entry);
  }
  return Array.from(map.values())
    .sort((a, b) => b.jobs - a.jobs || a.company.localeCompare(b.company))
    .slice(0, limit)
    .map((e) => ({ ...e, sources: Array.from(e.sources) }));
}
