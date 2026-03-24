"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/metrics-calculator";
import type { WeeklyMetrics, TikTokAccount } from "@/types/metrics";

interface MetricsTableProps {
  data: WeeklyMetrics[];
  accounts: TikTokAccount[];
}

export function MetricsTable({ data, accounts }: MetricsTableProps) {
  const getDisplayName = (handle: string) => {
    const account = accounts.find((a) => a.handle === handle);
    return account?.displayName ?? handle;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Semana</TableHead>
            <TableHead>Cuenta</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Likes</TableHead>
            <TableHead className="text-right">Comentarios</TableHead>
            <TableHead className="text-right">Compartidos</TableHead>
            <TableHead className="text-right">Seguidores</TableHead>
            <TableHead className="text-right">Visitas Perfil</TableHead>
            <TableHead className="text-right">Alcance</TableHead>
            <TableHead className="text-right">Interacciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.weekLabel}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {getDisplayName(row.account)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{formatNumber(row.views)}</TableCell>
              <TableCell className="text-right">{formatNumber(row.likes)}</TableCell>
              <TableCell className="text-right">{formatNumber(row.comments)}</TableCell>
              <TableCell className="text-right">{formatNumber(row.shares)}</TableCell>
              <TableCell className="text-right">{formatNumber(row.followers)}</TableCell>
              <TableCell className="text-right">{formatNumber(row.profileVisits)}</TableCell>
              <TableCell className="text-right">{formatNumber(row.reach)}</TableCell>
              <TableCell className="text-right">{formatNumber(row.interactions)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
