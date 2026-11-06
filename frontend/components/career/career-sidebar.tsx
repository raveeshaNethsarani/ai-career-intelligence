"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  UserRound,
  Workflow,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/profile", label: "My profile", icon: UserRound },
  { href: "/automation", label: "Automation", icon: Workflow },
  { href: "/settings", label: "Settings", icon: Settings },
];

const quickClass =
  "flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground";

export function CareerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex h-12 items-center gap-3 px-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
            <Sparkles className="size-5" />
          </div>
          <div className="grid text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-[15px] font-bold tracking-tight text-foreground">AI Career</span>
            <span className="text-[11px] text-muted-foreground">Intelligence</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                    className="h-10 rounded-xl text-[13.5px] font-medium data-[active=true]:font-semibold data-[active=true]:shadow-[inset_3px_0_0_#5092F0]"
                    onClick={() => router.push(item.href)}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Quick actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 px-1">
              <Link href="/profile" className={quickClass}>
                <UserRound className="size-4 text-primary" />
                Edit profile
              </Link>
              <Link href="/jobs" className={quickClass}>
                <Briefcase className="size-4 text-primary" />
                Browse jobs
              </Link>
              <a href="http://localhost:5678" target="_blank" rel="noopener noreferrer" className={quickClass}>
                <ExternalLink className="size-4 text-primary" />
                Open n8n editor
              </a>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="rounded-2xl border bg-background p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <span className="size-2 rounded-full bg-[#4AC48A]" />
            Running locally
          </p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">
            Job data from Remotive and Arbeitnow. Your profile stays on this machine.
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
