"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type Series = { key: string; label: string; color: string };

export function TrendChart({
  data,
  series,
}: {
  data: Record<string, string | number>[];
  series: Series[];
}) {
  const config: ChartConfig = {};
  for (const s of series) config[s.key] = { label: s.label, color: s.color };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <ChartContainer config={config} className="h-[240px] w-full">
        <LineChart accessibilityLayer data={data} margin={{ left: 0, right: 8, top: 4 }}>
          <CartesianGrid vertical={false} stroke="#E9EDF3" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} interval="preserveStartEnd" minTickGap={24} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={28} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {series.map((s) => (
            <Line
              key={s.key}
              dataKey={s.key}
              type="monotone"
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
}
