"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MODES = ["remote", "hybrid", "onsite"] as const;
const areaClass = "min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

function toList(text: string): string[] {
  return Array.from(new Set(text.split(/[,\n]/).map((s) => s.trim()).filter(Boolean)));
}

function toText(list: string[] | undefined): string {
  return (list ?? []).join(", ");
}

type Status = { kind: "idle" | "saving" | "ok" | "error"; message?: string };

export function ProfileForm({ initial }: { initial: Profile | null }) {
  const [name, setName] = useState(initial?.display_name ?? "");
  const [years, setYears] = useState(String(initial?.experience_years ?? 0));
  const [roles, setRoles] = useState(toText(initial?.target_roles));
  const [skills, setSkills] = useState(toText(initial?.skills));
  const [mustHave, setMustHave] = useState(toText(initial?.must_have));
  const [avoid, setAvoid] = useState(toText(initial?.avoid_keywords));
  const [locations, setLocations] = useState(toText(initial?.preferred_locations));
  const [modes, setModes] = useState<string[]>(initial?.work_modes ?? []);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function toggleMode(mode: string) {
    setModes((prev) => (prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: name.trim() || "Candidate",
          experience_years: Number(years),
          target_roles: toList(roles),
          skills: toList(skills).map((s) => s.toLowerCase()),
          must_have: toList(mustHave).map((s) => s.toLowerCase()),
          avoid_keywords: toList(avoid).map((s) => s.toLowerCase()),
          preferred_locations: toList(locations),
          work_modes: modes,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setStatus({ kind: "ok", message: "Profile saved." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About you</CardTitle>
          <CardDescription>Used by the matching workflow. Stored only in your local database.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sample Candidate" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="years">Years of experience</Label>
            <Input id="years" type="number" min={0} max={60} step={0.5} value={years} onChange={(e) => setYears(e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="roles">Target roles (comma separated)</Label>
            <Input id="roles" value={roles} onChange={(e) => setRoles(e.target.value)} placeholder="Software Developer, Backend Developer" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Lowercase, comma separated.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skills">Your skills</Label>
            <textarea id="skills" className={areaClass} value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="python, sql, n8n, javascript" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="must">Must have</Label>
              <Input id="must" value={mustHave} onChange={(e) => setMustHave(e.target.value)} placeholder="python" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avoid">Avoid keywords</Label>
              <Input id="avoid" value={avoid} onChange={(e) => setAvoid(e.target.value)} placeholder="senior, lead, 10+ years" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Where you want to work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loc">Preferred locations</Label>
            <Input id="loc" value={locations} onChange={(e) => setLocations(e.target.value)} placeholder="Remote, Colombo" />
          </div>
          <div className="flex flex-wrap gap-4">
            {MODES.map((m) => (
              <label key={m} className="flex items-center gap-2 text-sm capitalize">
                <input type="checkbox" checked={modes.includes(m)} onChange={() => toggleMode(m)} />
                {m === "onsite" ? "On-site" : m}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status.kind === "saving"}>
          {status.kind === "saving" ? "Saving…" : "Save profile"}
        </Button>
        {status.kind === "ok" ? <span className="text-sm text-emerald-600">{status.message}</span> : null}
        {status.kind === "error" ? <span className="text-sm text-destructive">{status.message}</span> : null}
      </div>
    </form>
  );
}
