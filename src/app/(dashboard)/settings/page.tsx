"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAccounts } from "@/hooks/use-accounts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SyncLog {
  id: string;
  account_handle: string;
  status: "running" | "success" | "error";
  metrics_count: number;
  error_message: string | null;
  started_at: string;
  finished_at: string | null;
}

function SettingsAlerts() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const error = searchParams.get("error");
  const connectedAccount = searchParams.get("account");

  return (
    <>
      {success === "connected" && (
        <div className="rounded-md border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-400">
          Cuenta {connectedAccount} conectada exitosamente.
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">
          Error: {decodeURIComponent(error)}
        </div>
      )}
    </>
  );
}

export default function SettingsPage() {
  const { accounts, isLoading } = useAccounts();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [recentSyncs, setRecentSyncs] = useState<SyncLog[]>([]);

  useEffect(() => {
    fetch("/api/tiktok/sync-log")
      .then((res) => (res.ok ? res.json() : []))
      .then(setRecentSyncs)
      .catch(() => {});
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/tiktok/sync-manual", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setSyncResult(
          `Sync completado: ${data.results?.map((r: { account: string; count?: number; status: string }) => `${r.account}: ${r.count ?? 0} metricas (${r.status})`).join(", ") ?? "ok"}`
        );
      } else {
        setSyncResult(`Error: ${data.error}`);
      }
    } catch {
      setSyncResult("Error de conexion");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Conexiones TikTok</h1>

      <Suspense>
        <SettingsAlerts />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Cuentas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.handle}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{account.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.handle}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={account.isConnected ? "default" : "secondary"}
                  >
                    {account.isConnected ? "Conectada" : "Solo Excel"}
                  </Badge>
                </div>
              ))}

              {accounts.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay cuentas configuradas.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conectar nueva cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Autoriza una cuenta de TikTok para sincronizar metricas
            automaticamente.
          </p>
          <a href="/api/tiktok/auth">
            <Button>Conectar cuenta TikTok</Button>
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sincronizacion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Las metricas se sincronizan automaticamente cada 24 horas. Tambien
            podes sincronizar manualmente.
          </p>
          <Button onClick={handleSync} disabled={syncing}>
            {syncing ? "Sincronizando..." : "Sincronizar ahora"}
          </Button>
          {syncResult && (
            <p className="text-sm text-muted-foreground">{syncResult}</p>
          )}

          {recentSyncs.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium">Ultimos syncs</h3>
              {recentSyncs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded border p-2 text-sm"
                >
                  <span>{log.account_handle}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {log.metrics_count} metricas
                    </span>
                    <Badge
                      variant={
                        log.status === "success"
                          ? "default"
                          : log.status === "error"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
