"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const config = {
  jobs: { label: "Jobs", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function JobsPerDayChart({ data }: { data: { day: string; jobs: number }[] }) {
  return (
    <ChartContainer config={config} className="h-[220px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="jobs" fill="var(--color-jobs)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
