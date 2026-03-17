import type { AccountHandle, WeeklyMetrics } from "@/types/metrics";

export type StaticDateRangePreset = "all" | "last4" | "last6" | "last8";
export type WeekDateRangePreset = `week:${string}`;
export type DateRangePreset = StaticDateRangePreset | WeekDateRangePreset;
export type MetricViewMode = "weekly" | "cumulative";

export const DATE_RANGE_LABELS: Record<StaticDateRangePreset, string> = {
  all: "Todas las semanas",
  last4: "Ultimas 4 semanas",
  last6: "Ultimas 6 semanas",
  last8: "Ultimas 8 semanas",
};

export const METRIC_VIEW_MODE_LABELS: Record<MetricViewMode, string> = {
  weekly: "Por semana",
  cumulative: "Total acumulado",
};

const PRESET_WEEK_COUNTS: Record<Exclude<StaticDateRangePreset, "all">, number> = {
  last4: 4,
  last6: 6,
  last8: 8,
};

const WEEK_PRESET_PREFIX = "week:";

export interface WeekOption {
  weekStartDate: string;
  weekEndDate: string;
  weekLabel: string;
}

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
  return getDistinctWeekOptions(metrics).map((week) => week.weekStartDate);
}

export function getDistinctWeekOptions(metrics: WeeklyMetrics[]): WeekOption[] {
  const weekMap = new Map<string, WeekOption>();

  for (const metric of sortMetrics(metrics)) {
    if (!weekMap.has(metric.weekStartDate)) {
      weekMap.set(metric.weekStartDate, {
        weekStartDate: metric.weekStartDate,
        weekEndDate: metric.weekEndDate,
        weekLabel: metric.weekLabel,
      });
    }
  }

  return Array.from(weekMap.values()).sort((a, b) =>
    a.weekStartDate.localeCompare(b.weekStartDate)
  );
}

export function getWeekPreset(weekStartDate: string): WeekDateRangePreset {
  return `${WEEK_PRESET_PREFIX}${weekStartDate}`;
}

export function isWeekPreset(preset: DateRangePreset): preset is WeekDateRangePreset {
  return preset.startsWith(WEEK_PRESET_PREFIX);
}

export function getWeekStartDateFromPreset(preset: DateRangePreset): string | null {
  if (!isWeekPreset(preset)) {
    return null;
  }

  const weekStartDate = preset.slice(WEEK_PRESET_PREFIX.length).trim();
  return weekStartDate || null;
}

export function getDateRangePresetLabel(
  preset: DateRangePreset,
  metrics: WeeklyMetrics[] = []
): string {
  if (!isWeekPreset(preset)) {
    return DATE_RANGE_LABELS[preset];
  }

  const weekStartDate = getWeekStartDateFromPreset(preset);
  if (!weekStartDate) {
    return "Semana";
  }

  const selectedWeek = getDistinctWeekOptions(metrics).find(
    (week) => week.weekStartDate === weekStartDate
  );

  return selectedWeek?.weekLabel ?? `Semana (${weekStartDate})`;
}

export function filterMetricsByPreset(
  metrics: WeeklyMetrics[],
  preset: DateRangePreset,
  accounts: AccountHandle[] = []
): WeeklyMetrics[] {
  const filtered = filterByAccounts(metrics, accounts);

  if (isWeekPreset(preset)) {
    const selectedWeek = getWeekStartDateFromPreset(preset);
    if (!selectedWeek) {
      return [];
    }

    return filtered.filter((metric) => metric.weekStartDate === selectedWeek);
  }

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
