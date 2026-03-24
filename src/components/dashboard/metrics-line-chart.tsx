"use client";

import {
  LineChart,
  Line,
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
import type { MetricKey, AccountHandle, TikTokAccount } from "@/types/metrics";
import { METRIC_LABELS } from "@/types/metrics";
import type { MetricViewMode } from "@/lib/dashboard-filters";

interface MetricsLineChartProps {
  data: Record<string, string | number>[];
  metricKey: MetricKey;
  selectedAccount?: AccountHandle | "all";
  viewMode?: MetricViewMode;
  accounts: TikTokAccount[];
}

export function MetricsLineChart({
  data,
  metricKey,
  selectedAccount = "all",
  viewMode = "weekly",
  accounts,
}: MetricsLineChartProps) {
  const chartConfig = buildChartConfig(accounts);
  const visibleAccounts =
    selectedAccount === "all"
      ? accounts
      : accounts.filter((a) => a.handle === selectedAccount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {viewMode === "cumulative"
            ? `${METRIC_LABELS[metricKey]} acumulado`
            : `${METRIC_LABELS[metricKey]} por Semana`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="weekLabel"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => formatNumber(v)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatNumber(Number(value))}
                />
              }
            />
            {visibleAccounts.map((account) => {
              const key = account.handle.replace("@", "");
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={key}
                />
              );
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
