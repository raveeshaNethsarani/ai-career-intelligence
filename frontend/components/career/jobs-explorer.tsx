"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import type { Job } from "@/lib/types";
import { formatDate, safeHttpsUrl, sourceLabel } from "@/lib/format";
import { ScoreBadge } from "@/components/career/score-badge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const selectClass = "h-9 rounded-md border border-input bg-background px-3 text-sm";

export function JobsExplorer({ jobs }: { jobs: Job[] }) {
  const [q, setQ] = useState("");
  const [source, setSource] = useState("all");
  const [mode, setMode] = useState("all");
  const [sort, setSort] = useState<"newest" | "score">("newest");
  const [scoredOnly, setScoredOnly] = useState(false);
  const [selected, setSelected] = useState<Job | null>(null);

  const sources = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.source))).sort(),
    [jobs],
  );

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = jobs.filter((j) => {
      if (source !== "all" && j.source !== source) return false;
      if (mode !== "all" && j.work_mode !== mode) return false;
      if (scoredOnly && j.final_score === null) return false;
      if (!needle) return true;
      return `${j.title} ${j.company ?? ""} ${j.location ?? ""}`.toLowerCase().includes(needle);
    });
    if (sort === "score") {
      list.sort((a, b) => (b.final_score ?? -1) - (a.final_score ?? -1));
    }
    return list;
  }, [jobs, q, source, mode, sort, scoredOnly]);

  const link = selected ? safeHttpsUrl(selected.source_url) : null;
  const isSample = selected?.source === "synthetic";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, company or location"
            className="pl-9"
            aria-label="Search jobs"
          />
        </div>
        <select className={selectClass} value={source} onChange={(e) => setSource(e.target.value)} aria-label="Source">
          <option value="all">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {sourceLabel(s)}
            </option>
          ))}
        </select>
        <select className={selectClass} value={mode} onChange={(e) => setMode(e.target.value)} aria-label="Work mode">
          <option value="all">Any work mode</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">On-site</option>
          <option value="unknown">Unknown</option>
        </select>
        <select
          className={selectClass}
          value={sort}
          onChange={(e) => setSort(e.target.value as "newest" | "score")}
          aria-label="Sort"
        >
          <option value="newest">Newest first</option>
          <option value="score">Best match first</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={scoredOnly} onChange={(e) => setScoredOnly(e.target.checked)} />
          Scored only
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {visible.length} of {jobs.length} jobs
      </p>

      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No jobs match these filters.
        </div>
      ) : (
        <ul className="divide-y rounded-2xl border bg-card">
          {visible.map((job) => (
            <li key={job.id}>
              <button
                type="button"
                onClick={() => setSelected(job)}
                className="flex w-full items-start gap-3 p-3 text-left hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{job.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {job.company ?? "Unknown company"} · {job.location ?? "Location not stated"} ·{" "}
                    {formatDate(job.posted_at)}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  via {sourceLabel(job.source)}
                </Badge>
                <ScoreBadge score={job.final_score} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{selected.title}</SheetTitle>
                <SheetDescription>
                  {selected.company ?? "Unknown company"} · {selected.location ?? "Location not stated"}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">via {sourceLabel(selected.source)}</Badge>
                  <Badge variant="secondary">{selected.work_mode}</Badge>
                  {selected.employment_type ? <Badge variant="secondary">{selected.employment_type}</Badge> : null}
                  <Badge variant="outline">Posted {formatDate(selected.posted_at)}</Badge>
                </div>

                <section className="space-y-2">
                  <h3 className="font-medium">Match</h3>
                  {selected.final_score === null ? (
                    <p className="text-muted-foreground">
                      Not scored yet. Scores appear after the AI matching workflow has run.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <ScoreBadge score={selected.final_score} />
                        <span className="text-muted-foreground">
                          Rules {selected.rules_score ?? "n/a"} · AI {selected.ai_score ?? "n/a"}
                        </span>
                      </div>
                      {(selected.matched_skills ?? []).length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {(selected.matched_skills ?? []).map((s) => (
                            <Badge key={s} className="bg-[#ECF9F2] text-[#289E68] border border-[#C6EEDC]" variant="secondary">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                      {(selected.missing_skills ?? []).length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {(selected.missing_skills ?? []).map((s) => (
                            <Badge key={s} className="bg-[#FEECEB] text-[#D9423F] border border-[#FBD0CF]" variant="secondary">
                              missing: {s}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                      {selected.reasoning ? <p className="text-muted-foreground">{selected.reasoning}</p> : null}
                      <p className="text-xs text-muted-foreground">
                        Scores are estimates, not a guarantee of any outcome.
                      </p>
                    </div>
                  )}
                </section>

                {selected.snippet ? (
                  <section className="space-y-2">
                    <h3 className="font-medium">Description (preview)</h3>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {selected.snippet}
                      {selected.snippet.length >= 600 ? "…" : ""}
                    </p>
                  </section>
                ) : null}

                {link && !isSample ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants(), "w-full")}
                  >
                    View on {sourceLabel(selected.source)}
                    <ExternalLink className="ml-2 size-4" />
                  </a>
                ) : null}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
