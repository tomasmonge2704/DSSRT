"use client";

import { useState, useEffect, useCallback } from "react";
import type { WeeklyMetrics, AccountHandle } from "@/types/metrics";

interface UseMetricsOptions {
  accounts?: AccountHandle[];
  startDate?: string;
  endDate?: string;
}

export function useMetrics(options: UseMetricsOptions = {}) {
  const [data, setData] = useState<WeeklyMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accountsKey = options.accounts?.join(",") ?? "";

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (accountsKey) {
      params.set("accounts", accountsKey);
    }
    if (options.startDate) params.set("startDate", options.startDate);
    if (options.endDate) params.set("endDate", options.endDate);

    try {
      const res = await fetch(`/api/metrics?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar metricas");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, [accountsKey, options.startDate, options.endDate]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { data, isLoading, error, refetch: fetchMetrics };
}
