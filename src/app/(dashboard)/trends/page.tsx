"use client";

import { useState } from "react";
import { useMetrics } from "@/hooks/use-metrics";
import { MetricsLineChart } from "@/components/dashboard/metrics-line-chart";
import { AccountFilter, type FilterValue } from "@/components/dashboard/account-filter";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { getChartDataByAccount } from "@/lib/metrics-calculator";
import type { AccountHandle } from "@/types/metrics";
import { METRIC_LABELS, ALL_METRIC_KEYS } from "@/types/metrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  filterMetricsByPreset,
  type DateRangePreset,
} from "@/lib/dashboard-filters";

export default function TrendsPage() {
  const [accountFilter, setAccountFilter] = useState<FilterValue>("all");
  const [dateRange, setDateRange] = useState<DateRangePreset>("all");

  const accounts: AccountHandle[] =
    accountFilter === "all" ? [] : [accountFilter];
  const { data: allMetrics, isLoading } = useMetrics();
  const filteredMetrics = filterMetricsByPreset(allMetrics, dateRange, accounts);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Tendencias</h1>
        <div className="flex flex-wrap gap-2">
          <AccountFilter value={accountFilter} onChange={setAccountFilter} />
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-lg" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="views" className="space-y-4">
          <TabsList className="flex-wrap">
            {ALL_METRIC_KEYS.map((key) => (
              <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
                {METRIC_LABELS[key]}
              </TabsTrigger>
            ))}
          </TabsList>
          {ALL_METRIC_KEYS.map((key) => (
            <TabsContent key={key} value={key}>
              <MetricsLineChart
                data={getChartDataByAccount(filteredMetrics, key)}
                metricKey={key}
                selectedAccount={accountFilter}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
