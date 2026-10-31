import { NextResponse } from "next/server";
import { getJobs } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getJobs();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }
  return NextResponse.json({ jobs: result.data });
}
