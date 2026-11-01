import Link from "next/link";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  CircleAlert,
  Database,
  Globe,
  Sparkles,
} from "lucide-react";
import { getJobs, getRuns } from "@/lib/api";
import { formatDate, formatDateTime, scoreBand, sourceLabel } from "@/lib/format";
import { companyCount, countBy, dailySeries, topCompanies, weekTrend } from "@/lib/stats";
import { TONE } from "@/lib/tone";
import { cn } from "@/lib/utils";
import { ApiError } from "@/components/career/api-error";
import { DonutCard, type DonutItem } from "@/components/career/donut-card";
import { Panel } from "@/components/career/panel";
import { Pill } from "@/components/career/pill";
import { ScoreBadge } from "@/components/career/score-badge";
import { StatCard } from "@/components/career/stat-card";
import { TrendChart, type Series } from "@/components/career/trend-chart";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PALETTE = ["#5092F0", "#4AC48A", "#FAB62E", "#F36C69", "#72788A"];

const WORK_MODES: { key: string; label: string; color: string }[] = [
  { key: "remote", label: "Remote", color: "#4AC48A" },
  { key: "hybrid", label: "Hybrid", color: "#5092F0" },
  { key: "onsite", label: "On-site", color: "#FAB62E" },
  { key: "unknown", label: "Not stated", color: "#C9D0DC" },
];

const RUN_ICON = {
  success: { icon: CheckCircle2, tone: "success" as const },
  partial: { icon: CircleAlert, tone: "warning" as const },
  failed: { icon: CircleAlert, tone: "danger" as const },
};

export default async function DashboardPage() {
  const [jobsRes, runsRes] = await Promise.all([getJobs(), getRuns()]);

  if (!jobsRes.ok) {
    return (
      <ApiError
        message={jobsRes.error}
        hint="Check that Docker is running and that the n8n workflow '04 - API jobs' is active."
      />
    );
  }

  const jobs = jobsRes.data;
  const runs = runsRes.ok ? runsRes.data : [];

  const total = jobs.length;
  const remote = jobs.filter((j) => j.work_mode === "remote").length;
  const scoredJobs = jobs.filter((j) => j.final_score !== null);
  const avgScore = scoredJobs.length
    ? Math.round(scoredJobs.reduce((s, j) => s + (j.final_score ?? 0), 0) / scoredJobs.length)
    : null;
  const companies = companyCount(jobs);
  const trend = weekTrend(jobs);

  const sourceCounts = Array.from(countBy(jobs, (j) => j.source)).sort((a, b) => b[1] - a[1]);
  const sourceItems: DonutItem[] = sourceCounts.map(([key, value], i) => ({
    key,
    label: sourceLabel(key),
    value,
    color: PALETTE[i % PALETTE.length],
  }));

  const series: Series[] = sourceItems.slice(0, 3).map((s) => ({ key: s.key, label: s.label, color: s.color }));
  const seriesData = dailySeries(jobs, series.map((s) => s.key), 30);

  const modeCounts = countBy(jobs, (j) => j.work_mode);
  const modeItems: DonutItem[] = WORK_MODES.map((m) => ({
    key: m.key,
    label: m.label,
    value: modeCounts.get(m.key) ?? 0,
    color: m.color,
  }));

  const bandCounts = countBy(jobs, (j) => scoreBand(j.final_score));
  const bandItems: DonutItem[] = [
    { key: "strong", label: "Strong (70+)", value: bandCounts.get("strong") ?? 0, color: "#4AC48A" },
    { key: "moderate", label: "Moderate (50–69)", value: bandCounts.get("moderate") ?? 0, color: "#5092F0" },
    { key: "weak", label: "Weak (under 50)", value: bandCounts.get("weak") ?? 0, color: "#FAB62E" },
    { key: "none", label: "Not scored", value: bandCounts.get("none") ?? 0, color: "#C9D0DC" },
  ];

  const latest = jobs.slice(0, 5);
  const top = topCompanies(jobs, 6);
  const scoredPct = total ? Math.round((scoredJobs.length / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total jobs"
          value={total}
          icon={Briefcase}
          tone="info"
          trend={trend.pct}
          note={trend.pct === null ? `${trend.current} new in the last 7 days` : "vs previous 7 days"}
        />
        <StatCard
          label="Remote jobs"
          value={remote}
          icon={Globe}
          tone="success"
          note={`${total ? Math.round((remote / total) * 100) : 0}% of all jobs`}
        />
        <StatCard label="Companies" value={companies} icon={Building2} tone="warning" note="hiring right now" />
        <StatCard
          label="Sources"
          value={sourceCounts.length}
          icon={Database}
          tone="neutral"
          note={sourceItems.map((s) => s.label).join(", ") || "none yet"}
        />
        <StatCard
          label="Scored jobs"
          value={scoredJobs.length}
          icon={Sparkles}
          tone="info"
          note={avgScore === null ? "AI matching not run yet" : `average score ${avgScore}%`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel title="Jobs collected" subtitle="By posted date, last 30 days" className="lg:col-span-3">
          <TrendChart data={seriesData} series={series} />
        </Panel>
        <div className="lg:col-span-2">
          <DonutCard title="Jobs by source" subtitle="Where your jobs come from" items={sourceItems} centerLabel="Total jobs" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DonutCard title="Work mode" items={modeItems} centerLabel="Jobs" />

        <Panel title="AI matching">
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <div className={cn("flex size-14 items-center justify-center rounded-full border", TONE.info)}>
              <Sparkles className="size-6" />
            </div>
            <p className="text-3xl font-semibold tabular-nums">{scoredJobs.length}</p>
            <p className="text-sm text-muted-foreground">of {total} jobs scored</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E9EDF3]">
              <div className="h-full rounded-full bg-primary" style={{ width: `${scoredPct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">
              {scoredJobs.length === 0
                ? "Matching compares every job with your profile. It has not run yet."
                : "Scores compare each job with your profile. They are estimates."}
            </p>
            <Link href="/profile" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Review your profile
            </Link>
          </div>
        </Panel>

        <DonutCard title="Match results" items={bandItems} centerLabel="Jobs" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Latest jobs"
          action={
            <Link href="/jobs" className="text-xs font-medium text-accent-foreground hover:underline">
              View all
            </Link>
          }
        >
          {latest.length === 0 ? (
            <p className="text-sm text-muted-foreground">No jobs yet. Run an ingestion workflow in n8n.</p>
          ) : (
            <ul className="divide-y">
              {latest.map((j) => (
                <li key={j.id} className="flex items-center gap-3 py-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground">
                    {(j.company ?? j.title).trim().charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{j.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {j.company ?? "Unknown company"} · {formatDate(j.posted_at)}
                    </p>
                  </div>
                  <Pill tone="neutral" className="hidden sm:inline-flex">
                    via {sourceLabel(j.source)}
                  </Pill>
                  <ScoreBadge score={j.final_score} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Recent activity"
          action={
            <Link href="/automation" className="text-xs font-medium text-accent-foreground hover:underline">
              View all
            </Link>
          }
        >
          {!runsRes.ok ? (
            <p className="text-sm text-muted-foreground">Could not load workflow runs.</p>
          ) : runs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No workflow runs logged yet. Each ingestion run adds a row here when it finishes.
            </p>
          ) : (
            <ul className="divide-y">
              {runs.slice(0, 5).map((r) => {
                const meta = RUN_ICON[r.status];
                return (
                  <li key={r.id} className="flex items-center gap-3 py-2.5">
                    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl border", TONE[meta.tone])}>
                      <meta.icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.workflow_name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.inserted} new, {r.duplicates} duplicates, {r.rejected} rejected
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(r.started_at)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>

      <Panel
        title="Top companies"
        subtitle="Companies with the most open jobs"
        action={
          <Link href="/jobs" className="text-xs font-medium text-accent-foreground hover:underline">
            Browse jobs
          </Link>
        }
      >
        {top.length === 0 ? (
          <p className="text-sm text-muted-foreground">No company data yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Open jobs</TableHead>
                <TableHead className="text-right">Remote</TableHead>
                <TableHead>Latest posting</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top.map((c) => (
                <TableRow key={c.company}>
                  <TableCell className="font-medium">{c.company}</TableCell>
                  <TableCell className="text-muted-foreground">{c.sources.map(sourceLabel).join(", ")}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.jobs}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.remote}</TableCell>
                  <TableCell>{formatDate(c.latest)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>

      {total >= 200 ? (
        <p className="text-xs text-muted-foreground">Charts and tables use the latest 200 jobs.</p>
      ) : null}
    </div>
  );
}
