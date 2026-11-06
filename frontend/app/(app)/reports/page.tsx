import { getLatestReport } from "@/lib/api";
import { formatDateTime, safeHttpsUrl, sourceLabel } from "@/lib/format";
import { ApiError } from "@/components/career/api-error";
import { PageHeader } from "@/components/career/page-header";
import { Panel } from "@/components/career/panel";
import { Pill } from "@/components/career/pill";
import { ScoreBadge } from "@/components/career/score-badge";

export default async function ReportsPage() {
  const res = await getLatestReport();

  if (!res.ok) {
    return (
      <>
        <PageHeader title="Reports" />
        <ApiError message={res.error} hint="Check that the n8n workflow '11 - API report' is active." />
      </>
    );
  }

  const report = res.data;
  if (!report) {
    return (
      <>
        <PageHeader title="Reports" description="A daily summary of your best matches." />
        <Panel title="No report yet">
          <p className="text-sm text-muted-foreground">
            Run the n8n workflow &quot;08 - Daily report&quot; once. The report appears here.
          </p>
        </Panel>
      </>
    );
  }

  const d = report.data;
  const stats = [
    { label: "New jobs (24h)", value: d.new_jobs },
    { label: "Scored jobs", value: d.scored },
    { label: "Strong (70+)", value: d.strong },
    { label: "Moderate (50-69)", value: d.moderate },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title={report.title} description={`Generated ${formatDateTime(report.created_at)}`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <Panel title="Top matches" subtitle="Best scoring jobs from the last 14 days">
        {d.top.length === 0 ? (
          <p className="text-sm text-muted-foreground">No job scored 50 or more yet.</p>
        ) : (
          <ul className="divide-y">
            {d.top.map((j) => {
              const link = safeHttpsUrl(j.source_url);
              return (
                <li key={j.id} className="space-y-1.5 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{j.title}</p>
                    <ScoreBadge score={Number(j.final_score)} />
                    {j.needs_review ? <Pill tone="warning">Needs review</Pill> : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {j.company ?? "Unknown company"} · {j.location ?? j.work_mode}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(j.matched_skills ?? []).map((s) => (
                      <Pill key={"m" + s} tone="success">{s}</Pill>
                    ))}
                    {(j.missing_skills ?? []).map((s) => (
                      <Pill key={"x" + s} tone="danger">missing: {s}</Pill>
                    ))}
                  </div>
                  {j.reasoning ? <p className="text-xs text-muted-foreground">{j.reasoning}</p> : null}
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-accent-foreground hover:underline"
                    >
                      View on {sourceLabel(j.source)} (via {sourceLabel(j.source)})
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <Panel title="Skills to learn next" subtitle="Skills most often missing in jobs that scored 40 or more">
        {d.gaps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recurring skill gaps yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {d.gaps.map((g) => (
              <Pill key={g.skill} tone="info">
                {g.skill} · {g.count} job{g.count === 1 ? "" : "s"}
              </Pill>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Markdown version" subtitle="Copy it into notes or an email">
        <details>
          <summary className="cursor-pointer text-sm text-muted-foreground">Show markdown</summary>
          <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-muted p-3 text-xs">{report.markdown}</pre>
        </details>
      </Panel>

      <p className="text-xs text-muted-foreground">
        Scores are estimates, not a guarantee of any outcome. Job data: Remotive and Arbeitnow.
      </p>
    </div>
  );
}
