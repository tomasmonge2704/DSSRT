"use client";

import { useState, useEffect } from "react";
import type { TikTokAccount } from "@/types/metrics";

export function useAccounts() {
  const [accounts, setAccounts] = useState<TikTokAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch("/api/accounts");
        if (!res.ok) throw new Error("Error al cargar cuentas");
        const data = await res.json();
        setAccounts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  return { accounts, isLoading, error };
}
