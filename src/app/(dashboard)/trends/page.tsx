"use client";

import { useState } from "react";
import { useMetrics } from "@/hooks/use-metrics";
import { MetricsLineChart } from "@/components/dashboard/metrics-line-chart";
import { AccountFilter, type FilterValue } from "@/components/dashboard/account-filter";
import { DateRangePicker, type DateRangePreset } from "@/components/dashboard/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { getChartDataByAccount } from "@/lib/metrics-calculator";
import type { AccountHandle, MetricKey } from "@/types/metrics";
import { METRIC_LABELS, ALL_METRIC_KEYS } from "@/types/metrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function getDateRange(preset: DateRangePreset) {
  if (preset === "all") return {};
  const weeks = preset === "last4" ? 4 : preset === "last6" ? 6 : 8;
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - weeks * 7);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

export default function TrendsPage() {
  const [accountFilter, setAccountFilter] = useState<FilterValue>("all");
  const [dateRange, setDateRange] = useState<DateRangePreset>("all");

  const accounts: AccountHandle[] =
    accountFilter === "all" ? [] : [accountFilter];
  const dates = getDateRange(dateRange);

  const { data, isLoading } = useMetrics({ accounts, ...dates });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Tendencias</h1>
        <div className="flex gap-2">
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
                data={getChartDataByAccount(data, key)}
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
