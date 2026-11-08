"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUSES = [
  { value: "new", label: "Not applied" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export function JobActions({
  jobId,
  initialSaved,
  initialStatus,
}: {
  jobId: number;
  initialSaved: boolean;
  initialStatus: string;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [status, setStatus] = useState(initialStatus === "saved" ? "new" : initialStatus);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(next: { saved: boolean; status: string }) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/job-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId, ...next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not save");
      setSaved(next.saved);
      setStatus(next.status);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-2">
      <h3 className="font-medium">Your tracking</h3>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={saved ? "default" : "outline"}
          disabled={busy}
          onClick={() => update({ saved: !saved, status })}
        >
          <Bookmark className="mr-1.5 size-4" />
          {saved ? "Saved" : "Save job"}
        </Button>
        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={status}
          disabled={busy}
          aria-label="Application status"
          onChange={(e) => update({ saved, status: e.target.value })}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <p className="text-xs text-muted-foreground">
        You apply on the original site yourself. This only records what you did.
      </p>
    </section>
  );
}
