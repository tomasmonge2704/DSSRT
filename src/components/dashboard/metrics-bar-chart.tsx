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
import { metricsChartConfig } from "@/lib/chart-config";
import { formatNumber } from "@/lib/metrics-calculator";
import type { MetricKey } from "@/types/metrics";
import { METRIC_LABELS } from "@/types/metrics";

interface ChartDataPoint {
  weekLabel: string;
  weekStartDate: string;
  elosodebresh: number;
  mundobresh: number;
}

interface MetricsBarChartProps {
  data: ChartDataPoint[];
  metricKey: MetricKey;
}

export function MetricsBarChart({ data, metricKey }: MetricsBarChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {METRIC_LABELS[metricKey]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={metricsChartConfig} className="aspect-auto h-[200px] w-full">
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
            <Bar
              dataKey="elosodebresh"
              fill="var(--color-elosodebresh)"
              radius={[4, 4, 0, 0]}
              name="elosodebresh"
            />
            <Bar
              dataKey="mundobresh"
              fill="var(--color-mundobresh)"
              radius={[4, 4, 0, 0]}
              name="mundobresh"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
