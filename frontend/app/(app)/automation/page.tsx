import { getRuns } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { ApiError } from "@/components/career/api-error";
import { PageHeader } from "@/components/career/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const WORKFLOWS = [
  { name: "01 - Remotive ingestion", state: "Implemented", note: "Fetches remote jobs, cleans and stores them" },
  { name: "02 - Arbeitnow ingestion", state: "Implemented", note: "Remote jobs only, HTML decoded" },
  { name: "03 - AI job matching", state: "Planned", note: "Rules score plus local AI (Ollama)" },
  { name: "04 - Daily report", state: "Planned", note: "Top matches summary" },
  { name: "05 - Error monitoring", state: "Planned", note: "Logs failed executions" },
];

const STATUS_STYLE = {
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  partial: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
} as const;

export default async function AutomationPage() {
  const res = await getRuns();

  return (
    <>
      <PageHeader title="Automation" description="What your n8n workflows have done." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Workflows</CardTitle>
          <CardDescription>
            Edit them in the n8n editor at{" "}
            <a className="underline underline-offset-4" href="http://localhost:5678" target="_blank" rel="noopener noreferrer">
              localhost:5678
            </a>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y text-sm">
            {WORKFLOWS.map((w) => (
              <li key={w.name} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="font-medium">{w.name}</p>
                  <p className="text-xs text-muted-foreground">{w.note}</p>
                </div>
                <Badge variant={w.state === "Implemented" ? "secondary" : "outline"}>{w.state}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Run history</CardTitle>
          <CardDescription>Last 20 runs logged to the workflow_runs table.</CardDescription>
        </CardHeader>
        <CardContent>
          {!res.ok ? (
            <ApiError message={res.error} hint="Check that the n8n workflow '05 - API runs' is active." />
          ) : res.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No runs logged yet. Each ingestion workflow writes one row per run when its Summary step succeeds.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Fetched</TableHead>
                  <TableHead className="text-right">Rejected</TableHead>
                  <TableHead className="text-right">Duplicates</TableHead>
                  <TableHead className="text-right">Inserted</TableHead>
                  <TableHead>Started</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {res.data.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.workflow_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={STATUS_STYLE[r.status]}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{r.fetched}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.rejected}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.duplicates}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.inserted}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDateTime(r.started_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
