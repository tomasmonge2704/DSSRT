"use client";

import { useState } from "react";
import { useMetrics } from "@/hooks/use-metrics";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { MetricsLineChart } from "@/components/dashboard/metrics-line-chart";
import { MetricsTable } from "@/components/dashboard/metrics-table";
import { AccountFilter, type FilterValue } from "@/components/dashboard/account-filter";
import { DateRangePicker, type DateRangePreset } from "@/components/dashboard/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getKpiData,
  getChartDataByAccount,
} from "@/lib/metrics-calculator";
import type { AccountHandle, MetricKey } from "@/types/metrics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { METRIC_LABELS, ALL_METRIC_KEYS } from "@/types/metrics";

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

export default function OverviewPage() {
  const [accountFilter, setAccountFilter] = useState<FilterValue>("all");
  const [dateRange, setDateRange] = useState<DateRangePreset>("all");
  const [chartMetric, setChartMetric] = useState<MetricKey>("views");

  const accounts: AccountHandle[] =
    accountFilter === "all" ? [] : [accountFilter];
  const dates = getDateRange(dateRange);

  const { data, isLoading } = useMetrics({
    accounts,
    ...dates,
  });

  const kpiData = getKpiData(data);
  const chartData = getChartDataByAccount(data, chartMetric);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Overview</h1>
        <div className="flex gap-2">
          <AccountFilter value={accountFilter} onChange={setAccountFilter} />
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-lg" />
          ))}
        </div>
      ) : (
        <KpiGrid data={kpiData} />
      )}

      <div className="flex items-center gap-2">
        <Select
          value={chartMetric}
          onValueChange={(v) => setChartMetric(v as MetricKey)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{METRIC_LABELS[chartMetric]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ALL_METRIC_KEYS.map((key) => (
              <SelectItem key={key} value={key}>
                {METRIC_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-[400px] rounded-lg" />
      ) : (
        <MetricsLineChart
          data={chartData}
          metricKey={chartMetric}
          selectedAccount={accountFilter}
        />
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Datos Semanales</h2>
        {isLoading ? (
          <Skeleton className="h-[300px] rounded-lg" />
        ) : (
          <MetricsTable data={data} />
        )}
      </div>
    </div>
  );
}
