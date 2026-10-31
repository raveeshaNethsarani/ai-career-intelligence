"use client";

import { usePathname, useRouter } from "next/navigation";
import { Briefcase, LayoutDashboard, Settings, Sparkles, UserRound, Workflow } from "lucide-react";
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
  { href: "/profile", label: "My profile", icon: UserRound },
  { href: "/automation", label: "Automation", icon: Workflow },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function CareerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <div className="grid text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">AI Career</span>
            <span className="text-xs text-muted-foreground">Intelligence</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
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
      </SidebarContent>
      <SidebarFooter>
        <p className="px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          Job data: Remotive, Arbeitnow. Runs locally.
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
