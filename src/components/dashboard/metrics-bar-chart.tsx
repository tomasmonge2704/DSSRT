"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildChartConfig } from "@/lib/chart-config";
import { formatNumber } from "@/lib/metrics-calculator";
import type { MetricKey, TikTokAccount } from "@/types/metrics";
import { METRIC_LABELS } from "@/types/metrics";

interface MetricsBarChartProps {
  data: Record<string, string | number>[];
  metricKey: MetricKey;
  accounts: TikTokAccount[];
}

export function MetricsBarChart({ data, metricKey, accounts }: MetricsBarChartProps) {
  const chartConfig = buildChartConfig(accounts);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {METRIC_LABELS[metricKey]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="weekLabel"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => formatNumber(v)}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatNumber(Number(value))}
                />
              }
            />
            {accounts.map((account) => {
              const key = account.handle.replace("@", "");
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={`var(--color-${key})`}
                  radius={[4, 4, 0, 0]}
                  name={key}
                />
              );
            })}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
