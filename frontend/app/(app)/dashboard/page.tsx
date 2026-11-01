import Link from "next/link";
import { Briefcase, Database, Globe, Sparkles } from "lucide-react";
import { getJobs, getRuns } from "@/lib/api";
import { dayKey, formatDate, formatDateTime, sourceLabel } from "@/lib/format";
import { ApiError } from "@/components/career/api-error";
import { JobsPerDayChart } from "@/components/career/jobs-per-day-chart";
import { PageHeader } from "@/components/career/page-header";
import { ScoreBadge } from "@/components/career/score-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const [jobsRes, runsRes] = await Promise.all([getJobs(), getRuns()]);

  if (!jobsRes.ok) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <ApiError
          message={jobsRes.error}
          hint="Check that Docker is running and that the n8n workflow '04 - API jobs' is active."
        />
      </>
    );
  }

  const jobs = jobsRes.data;
  const runs = runsRes.ok ? runsRes.data : [];

  const total = jobs.length;
  const remote = jobs.filter((j) => j.work_mode === "remote").length;
  const scored = jobs.filter((j) => j.final_score !== null).length;

  const bySource = new Map<string, number>();
  for (const j of jobs) bySource.set(j.source, (bySource.get(j.source) ?? 0) + 1);

  const perDay = new Map<string, number>();
  for (const j of jobs) {
    if (!j.posted_at) continue;
    const key = dayKey(j.posted_at);
    if (key) perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }
  const chartData = Array.from({ length: 14 }, (_, i) => {
    const key = dayKey(new Date(Date.now() - (13 - i) * 86400000).toISOString()) ?? "";
    return { day: key.slice(5), jobs: perDay.get(key) ?? 0 };
  });

  const recent = jobs.slice(0, 6);

  const stats = [
    { label: "Total jobs", value: total, icon: Briefcase, note: "in your database" },
    { label: "Remote jobs", value: remote, icon: Globe, note: `${total ? Math.round((remote / total) * 100) : 0}% of all jobs` },
    { label: "Sources", value: bySource.size, icon: Database, note: Array.from(bySource.keys()).map(sourceLabel).join(", ") || "none" },
    { label: "Scored jobs", value: scored, icon: Sparkles, note: scored === 0 ? "AI matching not run yet" : "with match scores" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of the jobs collected by your n8n workflows." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <s.icon className="size-4" />
                {s.label}
              </CardDescription>
              <CardTitle className="text-3xl tabular-nums">{s.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">{s.note}</CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Jobs by posted date</CardTitle>
            <CardDescription>Last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <JobsPerDayChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Latest runs</CardTitle>
            <CardDescription>
              <Link href="/automation" className="underline-offset-4 hover:underline">
                See all workflow runs
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {runs.length === 0 ? (
              <p className="text-muted-foreground">No runs logged yet.</p>
            ) : (
              runs.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.workflow_name}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(r.started_at)}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    +{r.inserted} new · {r.duplicates} dup
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent jobs</CardTitle>
          <CardDescription>
            <Link href="/jobs" className="underline-offset-4 hover:underline">
              Browse and filter all jobs
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No jobs yet. Run an ingestion workflow in n8n.</p>
          ) : (
            <ul className="divide-y">
              {recent.map((j) => (
                <li key={j.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{j.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {j.company ?? "Unknown company"} · {formatDate(j.posted_at)}
                    </p>
                  </div>
                  <Badge variant="outline">via {sourceLabel(j.source)}</Badge>
                  <ScoreBadge score={j.final_score} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
