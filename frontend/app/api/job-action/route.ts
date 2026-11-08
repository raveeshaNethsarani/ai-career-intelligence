import { NextResponse } from "next/server";
import { saveJobAction } from "@/lib/api";

const STATUSES = ["new", "saved", "applied", "interview", "offer", "rejected"];

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const jobId = Number(b.job_id);

  if (!Number.isInteger(jobId) || jobId <= 0) {
    return NextResponse.json({ error: "Invalid job id" }, { status: 400 });
  }
  if (typeof b.saved !== "boolean") {
    return NextResponse.json({ error: "saved must be true or false" }, { status: 400 });
  }
  if (typeof b.status !== "string" || !STATUSES.includes(b.status)) {
    return NextResponse.json({ error: "Unknown status" }, { status: 400 });
  }

  const result = await saveJobAction({ job_id: jobId, saved: b.saved, status: b.status });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
  return NextResponse.json({ action: result.data });
}
