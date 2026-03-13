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
import { metricsChartConfig } from "@/lib/chart-config";
import { formatNumber } from "@/lib/metrics-calculator";
import type { MetricKey, AccountHandle } from "@/types/metrics";
import { METRIC_LABELS } from "@/types/metrics";

interface ChartDataPoint {
  weekLabel: string;
  weekStartDate: string;
  elosodebresh: number;
  mundobresh: number;
}

interface MetricsLineChartProps {
  data: ChartDataPoint[];
  metricKey: MetricKey;
  selectedAccount?: AccountHandle | "all";
}

export function MetricsLineChart({
  data,
  metricKey,
  selectedAccount = "all",
}: MetricsLineChartProps) {
  const showOso = selectedAccount === "all" || selectedAccount === "@elosodebresh";
  const showMundo = selectedAccount === "all" || selectedAccount === "@mundobresh";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{METRIC_LABELS[metricKey]} por Semana</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={metricsChartConfig} className="aspect-auto h-[350px] w-full">
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
            {showOso && (
              <Line
                type="monotone"
                dataKey="elosodebresh"
                stroke="var(--color-elosodebresh)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="elosodebresh"
              />
            )}
            {showMundo && (
              <Line
                type="monotone"
                dataKey="mundobresh"
                stroke="var(--color-mundobresh)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="mundobresh"
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
