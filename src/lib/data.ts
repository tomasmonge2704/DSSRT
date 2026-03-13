import { promises as fs } from "fs";
import path from "path";
import type { MetricsStore, WeeklyMetrics, DashboardFilters } from "@/types/metrics";

const DATA_PATH = path.join(process.cwd(), "data", "metrics.json");

export async function getMetrics(): Promise<MetricsStore> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as MetricsStore;
}

export async function saveMetrics(data: MetricsStore): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getFilteredMetrics(
  filters: DashboardFilters
): Promise<WeeklyMetrics[]> {
  const store = await getMetrics();
  let metrics = store.weeklyMetrics;

  if (filters.accounts.length > 0) {
    metrics = metrics.filter((m) => filters.accounts.includes(m.account));
  }

  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    metrics = metrics.filter(
      (m) => m.weekStartDate >= start && m.weekStartDate <= end
    );
  }

  return metrics.sort(
    (a, b) => a.weekStartDate.localeCompare(b.weekStartDate) || a.account.localeCompare(b.account)
  );
}

export async function upsertMetrics(newMetrics: WeeklyMetrics[]): Promise<number> {
  const store = await getMetrics();
  const existing = new Map(store.weeklyMetrics.map((m) => [m.id, m]));

  for (const metric of newMetrics) {
    existing.set(metric.id, metric);
  }

  store.weeklyMetrics = Array.from(existing.values());
  store.lastUpdated = new Date().toISOString();
  await saveMetrics(store);
  return newMetrics.length;
}
