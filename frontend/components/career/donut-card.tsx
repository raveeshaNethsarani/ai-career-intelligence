"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Panel } from "@/components/career/panel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type DonutItem = { key: string; label: string; value: number; color: string };

export function DonutCard({
  title,
  subtitle,
  items,
  centerLabel,
}: {
  title: string;
  subtitle?: string;
  items: DonutItem[];
  centerLabel: string;
}) {
  const total = items.reduce((sum, i) => sum + i.value, 0);
  const config: ChartConfig = {};
  for (const i of items) config[i.key] = { label: i.label, color: i.color };

  const slices = total > 0 ? items.filter((i) => i.value > 0) : [{ key: "empty", label: "No data", value: 1, color: "#E9EDF3" }];

  return (
    <Panel title={title} subtitle={subtitle}>
      <div className="flex items-center gap-4">
        <div className="relative size-[150px] shrink-0">
          <ChartContainer config={config} className="size-full">
            <PieChart>
              {total > 0 ? <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="key" />} /> : null}
              <Pie data={slices} dataKey="value" nameKey="key" innerRadius={46} outerRadius={70} paddingAngle={slices.length > 1 ? 2 : 0} stroke="none">
                {slices.map((s) => (
                  <Cell key={s.key} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold tabular-nums">{total}</span>
            <span className="text-[11px] text-muted-foreground">{centerLabel}</span>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.key} className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: i.color }} />
                <span className="truncate text-muted-foreground">{i.label}</span>
              </span>
              <span className="shrink-0 tabular-nums">
                {i.value}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({total > 0 ? Math.round((i.value / total) * 1000) / 10 : 0}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
