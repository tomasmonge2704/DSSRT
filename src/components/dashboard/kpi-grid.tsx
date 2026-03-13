"use client";

import { KpiCard } from "./kpi-card";
import type { KpiCardData } from "@/types/metrics";

interface KpiGridProps {
  data: KpiCardData[];
}

export function KpiGrid({ data }: KpiGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((kpi) => (
        <KpiCard
          key={kpi.metricKey}
          metricKey={kpi.metricKey}
          label={kpi.label}
          currentValue={kpi.currentValue}
          variancePercent={kpi.variancePercent}
        />
      ))}
    </div>
  );
}
