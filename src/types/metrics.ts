export type AccountHandle = "@elosodebresh" | "@mundobresh";

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
}

export interface MetricsStore {
  lastUpdated: string;
  source: "excel" | "tiktok_api";
  accounts: AccountHandle[];
  weeklyMetrics: WeeklyMetrics[];
}

export interface DashboardFilters {
  accounts: AccountHandle[];
  dateRange: {
    start: string;
    end: string;
  } | null;
}

export type MetricKey = keyof Omit<
  WeeklyMetrics,
  "id" | "account" | "weekLabel" | "weekStartDate" | "weekEndDate"
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
