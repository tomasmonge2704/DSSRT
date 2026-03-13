import type { AccountHandle, WeeklyMetrics } from "@/types/metrics";

export type DateRangePreset = "all" | "last4" | "last6" | "last8";
export type MetricViewMode = "weekly" | "cumulative";

export const DATE_RANGE_LABELS: Record<DateRangePreset, string> = {
  all: "Todas las semanas",
  last4: "Ultimas 4 semanas",
  last6: "Ultimas 6 semanas",
  last8: "Ultimas 8 semanas",
};

export const METRIC_VIEW_MODE_LABELS: Record<MetricViewMode, string> = {
  weekly: "Por semana",
  cumulative: "Total acumulado",
};

const PRESET_WEEK_COUNTS: Record<Exclude<DateRangePreset, "all">, number> = {
  last4: 4,
  last6: 6,
  last8: 8,
};

function sortMetrics(metrics: WeeklyMetrics[]): WeeklyMetrics[] {
  return [...metrics].sort(
    (a, b) =>
      a.weekStartDate.localeCompare(b.weekStartDate) ||
      a.account.localeCompare(b.account)
  );
}

function filterByAccounts(
  metrics: WeeklyMetrics[],
  accounts: AccountHandle[]
): WeeklyMetrics[] {
  if (accounts.length === 0) {
    return sortMetrics(metrics);
  }

  return sortMetrics(metrics.filter((metric) => accounts.includes(metric.account)));
}

export function getDistinctWeeks(metrics: WeeklyMetrics[]): string[] {
  return Array.from(new Set(metrics.map((metric) => metric.weekStartDate))).sort(
    (a, b) => a.localeCompare(b)
  );
}

export function filterMetricsByPreset(
  metrics: WeeklyMetrics[],
  preset: DateRangePreset,
  accounts: AccountHandle[] = []
): WeeklyMetrics[] {
  const filtered = filterByAccounts(metrics, accounts);
  if (preset === "all") {
    return filtered;
  }

  const weekCount = PRESET_WEEK_COUNTS[preset];
  const selectedWeeks = getDistinctWeeks(filtered).slice(-weekCount);
  const selectedWeekSet = new Set(selectedWeeks);

  return filtered.filter((metric) => selectedWeekSet.has(metric.weekStartDate));
}

export function getPreviousMetricsByPreset(
  metrics: WeeklyMetrics[],
  preset: DateRangePreset,
  accounts: AccountHandle[] = []
): WeeklyMetrics[] {
  const filtered = filterByAccounts(metrics, accounts);
  const currentMetrics = filterMetricsByPreset(filtered, preset);
  const currentWeeks = getDistinctWeeks(currentMetrics);

  if (currentWeeks.length === 0) {
    return [];
  }

  const allWeeks = getDistinctWeeks(filtered);
  const firstCurrentWeekIndex = allWeeks.indexOf(currentWeeks[0]);

  if (firstCurrentWeekIndex <= 0) {
    return [];
  }

  const previousWeeks = allWeeks.slice(
    Math.max(0, firstCurrentWeekIndex - currentWeeks.length),
    firstCurrentWeekIndex
  );

  if (previousWeeks.length !== currentWeeks.length) {
    return [];
  }

  const previousWeekSet = new Set(previousWeeks);
  return filtered.filter((metric) => previousWeekSet.has(metric.weekStartDate));
}
