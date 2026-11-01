import Link from "next/link";
import { Bell, CalendarDays } from "lucide-react";
import { getProfile, getRuns } from "@/lib/api";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TZ = "Asia/Colombo";
const DAY = 86400000;

function shortDate(ms: number, withYear: boolean): string {
  return new Date(ms).toLocaleDateString("en-US", {
    timeZone: TZ,
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

export async function TopBar() {
  const [profileRes, runsRes] = await Promise.all([getProfile(), getRuns()]);

  const name = profileRes.ok && profileRes.data ? profileRes.data.display_name.trim() : "";
  const firstName = name ? name.split(/\s+/)[0] : "there";
  const initials = name
    ? name
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("")
    : "?";

  const hasFailedRun = runsRes.ok && runsRes.data.slice(0, 5).some((r) => r.status === "failed");

  const now = Date.now();
  const range = `${shortDate(now - 29 * DAY, false)} – ${shortDate(now, true)}`;

  return (
    <header className="flex flex-wrap items-center gap-3 border-b bg-card px-4 py-3 md:px-6">
      <SidebarTrigger className="-ml-1" />

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold leading-tight">Welcome back, {firstName}!</h1>
        <p className="truncate text-xs text-muted-foreground">Here is what is happening with your job search today.</p>
      </div>

      <div className="hidden items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm md:flex">
        <CalendarDays className="size-4 text-muted-foreground" />
        <span>{range}</span>
        <span className="text-xs text-muted-foreground">Last 30 days</span>
      </div>

      <Link
        href="/automation"
        aria-label={hasFailedRun ? "A recent workflow run failed" : "Workflow runs"}
        title={hasFailedRun ? "A recent workflow run failed" : "No new alerts"}
        className="relative flex size-9 items-center justify-center rounded-xl border bg-card text-muted-foreground hover:bg-accent"
      >
        <Bell className="size-4" />
        {hasFailedRun ? <span className="absolute right-2 top-2 size-2 rounded-full bg-[#F36C69]" /> : null}
      </Link>

      <Link href="/profile" className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-accent">
        <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {initials}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm font-medium">{name || "Set up profile"}</span>
          <span className="block text-xs text-muted-foreground">Local profile</span>
        </span>
      </Link>
    </header>
  );
}
