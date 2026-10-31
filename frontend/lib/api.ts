import "server-only";
import { n8nGet, n8nPost } from "@/lib/n8n";
import type { Job, Profile, ProfileInput, WorkflowRun } from "@/lib/types";

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function safe<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export function getJobs() {
  return safe(async () => (await n8nGet<{ jobs: Job[] }>("api-jobs")).jobs);
}

export function getRuns() {
  return safe(async () => (await n8nGet<{ runs: WorkflowRun[] }>("api-runs")).runs);
}

export function getProfile() {
  return safe(async () => (await n8nGet<{ profile: Profile | null }>("api-profile")).profile);
}

export function saveProfile(input: ProfileInput) {
  return safe(async () => (await n8nPost<{ profile: Profile }>("api-profile-save", input)).profile);
}
