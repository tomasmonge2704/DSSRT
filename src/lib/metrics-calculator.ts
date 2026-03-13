import type { WeeklyMetrics, MetricKey, KpiCardData } from "@/types/metrics";
import { ALL_METRIC_KEYS, METRIC_LABELS as LABELS } from "@/types/metrics";
import type { MetricViewMode } from "@/lib/dashboard-filters";

export function calculateVariance(
  current: number,
  previous: number | null
): { percent: number | null; absolute: number | null } {
  if (previous === null || previous === 0) {
    return { percent: null, absolute: null };
  }
  const absolute = current - previous;
  const percent = Math.round(((current - previous) / previous) * 1000) / 10;
  return { percent, absolute };
}

export function aggregateMetricsByWeek(
  metrics: WeeklyMetrics[]
): { weekLabel: string; weekStartDate: string; [key: string]: number | string }[] {
  const weekMap = new Map<string, { weekLabel: string; weekStartDate: string; totals: Record<string, number> }>();

  for (const m of metrics) {
    const key = m.weekStartDate;
    if (!weekMap.has(key)) {
      weekMap.set(key, {
        weekLabel: m.weekLabel,
        weekStartDate: m.weekStartDate,
        totals: {},
      });
    }
    const entry = weekMap.get(key)!;
    for (const mk of ALL_METRIC_KEYS) {
      entry.totals[mk] = (entry.totals[mk] || 0) + m[mk];
    }
  }

  return Array.from(weekMap.values())
    .sort((a, b) => a.weekStartDate.localeCompare(b.weekStartDate))
    .map(({ weekLabel, weekStartDate, totals }) => ({
      weekLabel,
      weekStartDate,
      ...totals,
    }));
}

function sumMetrics(metrics: WeeklyMetrics[]): Record<MetricKey, number> {
  const totals = Object.fromEntries(
    ALL_METRIC_KEYS.map((metricKey) => [metricKey, 0])
  ) as Record<MetricKey, number>;

  for (const metric of metrics) {
    for (const metricKey of ALL_METRIC_KEYS) {
      totals[metricKey] += metric[metricKey];
    }
  }

  return totals;
}

export function getKpiData(
  metrics: WeeklyMetrics[],
  options: {
    mode?: MetricViewMode;
    comparisonMetrics?: WeeklyMetrics[];
  } = {}
): KpiCardData[] {
  if (metrics.length === 0) {
    return [];
  }

  if (options.mode === "cumulative") {
    const currentTotals = sumMetrics(metrics);
    const previousTotals =
      options.comparisonMetrics && options.comparisonMetrics.length > 0
        ? sumMetrics(options.comparisonMetrics)
        : null;

    return ALL_METRIC_KEYS.map((key) => {
      const currentValue = currentTotals[key] || 0;
      const previousValue = previousTotals ? previousTotals[key] || 0 : null;
      const { percent } = calculateVariance(currentValue, previousValue);

      return {
        metricKey: key,
        label: LABELS[key],
        currentValue,
        previousValue,
        variancePercent: percent,
      };
    });
  }

  const aggregated = aggregateMetricsByWeek(metrics);

  if (aggregated.length === 0) return [];

  const current = aggregated[aggregated.length - 1];
  const previous = aggregated.length > 1 ? aggregated[aggregated.length - 2] : null;

  return ALL_METRIC_KEYS.map((key) => {
    const currentValue = (current[key] as number) || 0;
    const previousValue = previous ? (previous[key] as number) || 0 : null;
    const { percent } = calculateVariance(currentValue, previousValue);

    return {
      metricKey: key,
      label: LABELS[key],
      currentValue,
      previousValue,
      variancePercent: percent,
    };
  });
}

export function getChartDataByAccount(
  metrics: WeeklyMetrics[],
  metricKey: MetricKey,
  mode: MetricViewMode = "weekly"
): { weekLabel: string; weekStartDate: string; elosodebresh: number; mundobresh: number }[] {
  const weekMap = new Map<string, { weekLabel: string; weekStartDate: string; elosodebresh: number; mundobresh: number }>();

  for (const m of metrics) {
    const key = m.weekStartDate;
    if (!weekMap.has(key)) {
      weekMap.set(key, {
        weekLabel: m.weekLabel,
        weekStartDate: m.weekStartDate,
        elosodebresh: 0,
        mundobresh: 0,
      });
    }
    const entry = weekMap.get(key)!;
    if (m.account === "@elosodebresh") {
      entry.elosodebresh = m[metricKey];
    } else {
      entry.mundobresh = m[metricKey];
    }
  }

  const weeklyData = Array.from(weekMap.values()).sort((a, b) =>
    a.weekStartDate.localeCompare(b.weekStartDate)
  );

  if (mode === "weekly") {
    return weeklyData;
  }

  let accumulatedOso = 0;
  let accumulatedMundo = 0;

  return weeklyData.map((week) => {
    accumulatedOso += week.elosodebresh;
    accumulatedMundo += week.mundobresh;

    return {
      ...week,
      elosodebresh: accumulatedOso,
      mundobresh: accumulatedMundo,
    };
  });
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + "K";
  }
  return value.toLocaleString();
}
