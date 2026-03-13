"use client";

import { useState } from "react";
import { useMetrics } from "@/hooks/use-metrics";
import { MetricsBarChart } from "@/components/dashboard/metrics-bar-chart";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { getChartDataByAccount } from "@/lib/metrics-calculator";
import { ALL_METRIC_KEYS } from "@/types/metrics";
import {
  filterMetricsByPreset,
  type DateRangePreset,
} from "@/lib/dashboard-filters";

export default function ComparePage() {
  const [dateRange, setDateRange] = useState<DateRangePreset>("all");
  const { data: allMetrics, isLoading } = useMetrics();
  const filteredMetrics = filterMetricsByPreset(allMetrics, dateRange);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comparar Cuentas</h1>
          <p className="text-sm text-muted-foreground">
            @elosodebresh vs @mundobresh
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[260px] rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {ALL_METRIC_KEYS.map((key) => (
            <MetricsBarChart
              key={key}
              data={getChartDataByAccount(filteredMetrics, key)}
              metricKey={key}
            />
          ))}
        </div>
      )}
    </div>
  );
}
