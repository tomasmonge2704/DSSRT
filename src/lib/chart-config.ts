import type { ChartConfig } from "@/components/ui/chart";

export const accountColors = {
  "@elosodebresh": "hsl(221, 83%, 53%)",
  "@mundobresh": "hsl(142, 71%, 45%)",
} as const;

export const metricsChartConfig: ChartConfig = {
  elosodebresh: {
    label: "El Oso de Bresh",
    color: "hsl(221, 83%, 53%)",
  },
  mundobresh: {
    label: "Mundo Bresh",
    color: "hsl(142, 71%, 45%)",
  },
};
