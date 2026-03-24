import { createServerSupabase } from "./supabase";
import type {
  WeeklyMetrics,
  DashboardFilters,
  TikTokAccount,
} from "@/types/metrics";

// DB row (snake_case) -> WeeklyMetrics (camelCase)
interface MetricRow {
  id: string;
  account_handle: string;
  week_label: string;
  week_start_date: string;
  week_end_date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  profile_visits: number;
  reach: number;
  interactions: number;
  source: "excel" | "tiktok_api";
  synced_at: string;
}

function rowToMetric(row: MetricRow): WeeklyMetrics {
  return {
    id: row.id,
    account: row.account_handle,
    weekLabel: row.week_label,
    weekStartDate: row.week_start_date,
    weekEndDate: row.week_end_date,
    views: row.views,
    likes: row.likes,
    comments: row.comments,
    shares: row.shares,
    followers: row.followers,
    profileVisits: row.profile_visits,
    reach: row.reach,
    interactions: row.interactions,
    source: row.source,
  };
}

function metricToRow(m: WeeklyMetrics) {
  return {
    id: m.id,
    account_handle: m.account,
    week_label: m.weekLabel,
    week_start_date: m.weekStartDate,
    week_end_date: m.weekEndDate,
    views: m.views,
    likes: m.likes,
    comments: m.comments,
    shares: m.shares,
    followers: m.followers,
    profile_visits: m.profileVisits,
    reach: m.reach,
    interactions: m.interactions,
    source: m.source,
  };
}

export async function getFilteredMetrics(
  filters: DashboardFilters
): Promise<WeeklyMetrics[]> {
  const sb = createServerSupabase();
  let query = sb.from("weekly_metrics").select("*");

  if (filters.accounts.length > 0) {
    query = query.in("account_handle", filters.accounts);
  }

  if (filters.dateRange) {
    query = query
      .gte("week_start_date", filters.dateRange.start)
      .lte("week_start_date", filters.dateRange.end);
  }

  if (filters.source && filters.source !== "all") {
    query = query.eq("source", filters.source);
  }

  query = query.order("week_start_date").order("account_handle");

  const { data, error } = await query;
  if (error) throw error;
  return (data as MetricRow[]).map(rowToMetric);
}

export async function upsertMetrics(
  metrics: WeeklyMetrics[]
): Promise<number> {
  const sb = createServerSupabase();
  const rows = metrics.map(metricToRow);

  const { error } = await sb
    .from("weekly_metrics")
    .upsert(rows, { onConflict: "id" });

  if (error) throw error;
  return metrics.length;
}

export async function getAccounts(): Promise<TikTokAccount[]> {
  const sb = createServerSupabase();
  const { data, error } = await sb
    .from("accounts")
    .select("*")
    .order("created_at");

  if (error) throw error;

  return (data ?? []).map((row) => ({
    handle: row.handle,
    displayName: row.display_name,
    colorHsl: row.color_hsl,
    tiktokOpenId: row.tiktok_open_id,
    isConnected: row.tiktok_open_id !== null,
  }));
}
