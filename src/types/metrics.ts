export type AccountHandle = string;

export type MetricSource = "excel" | "tiktok_api";

export interface WeeklyMetrics {
  id: string;
  account: AccountHandle;
  weekLabel: string;
  weekStartDate: string;
  weekEndDate: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  profileVisits: number;
  reach: number;
  interactions: number;
  source: MetricSource;
}

export interface TikTokAccount {
  handle: AccountHandle;
  displayName: string;
  colorHsl: string | null;
  tiktokOpenId: string | null;
  isConnected: boolean;
}

/** @deprecated Use Supabase queries directly. Kept for migration script. */
export interface MetricsStore {
  lastUpdated: string;
  source: MetricSource;
  accounts: AccountHandle[];
  weeklyMetrics: Omit<WeeklyMetrics, "source">[];
}

export interface DashboardFilters {
  accounts: AccountHandle[];
  dateRange: {
    start: string;
    end: string;
  } | null;
  source?: MetricSource | "all";
}

export type MetricKey = keyof Omit<
  WeeklyMetrics,
  "id" | "account" | "weekLabel" | "weekStartDate" | "weekEndDate" | "source"
>;

export interface KpiCardData {
  metricKey: MetricKey;
  label: string;
  currentValue: number;
  previousValue: number | null;
  variancePercent: number | null;
}

export const METRIC_LABELS: Record<MetricKey, string> = {
  views: "Views",
  likes: "Likes",
  comments: "Comentarios",
  shares: "Compartidos",
  followers: "Seguidores",
  profileVisits: "Visitas al Perfil",
  reach: "Alcance",
  interactions: "Interacciones",
};

export const ALL_METRIC_KEYS: MetricKey[] = [
  "views",
  "likes",
  "comments",
  "shares",
  "followers",
  "profileVisits",
  "reach",
  "interactions",
];
