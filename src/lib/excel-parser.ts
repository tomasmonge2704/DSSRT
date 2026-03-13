import * as XLSX from "xlsx";
import type { WeeklyMetrics, AccountHandle } from "@/types/metrics";

const COLUMN_MAP: Record<string, keyof WeeklyMetrics> = {
  views: "views",
  Views: "views",
  Visualizaciones: "views",
  likes: "likes",
  Likes: "likes",
  comentarios: "comments",
  Comentarios: "comments",
  Comments: "comments",
  compartidos: "shares",
  Compartidos: "shares",
  Shares: "shares",
  seguidores: "followers",
  Seguidores: "followers",
  Followers: "followers",
  "visu perfil": "profileVisits",
  "Visu perfil": "profileVisits",
  "Profile Visits": "profileVisits",
  reach: "reach",
  Reach: "reach",
  Alcance: "reach",
  interacciones: "interactions",
  Interacciones: "interactions",
  Interactions: "interactions",
};

const WEEK_DATES: Record<string, { start: string; end: string }> = {
  w1: { start: "2026-01-05", end: "2026-01-11" },
  w2: { start: "2026-01-12", end: "2026-01-18" },
  w3: { start: "2026-01-19", end: "2026-01-25" },
  w4: { start: "2026-01-26", end: "2026-02-01" },
  w5: { start: "2026-02-02", end: "2026-02-08" },
  w6: { start: "2026-02-09", end: "2026-02-15" },
  w7: { start: "2026-02-16", end: "2026-02-22" },
  w8: { start: "2026-02-23", end: "2026-03-01" },
  w9: { start: "2026-03-02", end: "2026-03-08" },
  w10: { start: "2026-03-09", end: "2026-03-15" },
  w11: { start: "2026-03-16", end: "2026-03-22" },
  w12: { start: "2026-03-23", end: "2026-03-29" },
};

function normalizeWeekLabel(raw: string): string | null {
  const cleaned = raw.toString().trim().toLowerCase();
  const match = cleaned.match(/^w(\d+)$/);
  if (match) return `w${match[1]}`;
  const match2 = cleaned.match(/^semana\s*(\d+)$/i);
  if (match2) return `w${match2[1]}`;
  return null;
}

export interface ParseResult {
  metrics: WeeklyMetrics[];
  warnings: string[];
}

export function parseExcelBuffer(buffer: ArrayBuffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: "array" });
  const warnings: string[] = [];
  const allMetrics: WeeklyMetrics[] = [];

  const metricasSheet =
    workbook.Sheets["Metricas Tiktok"] ||
    workbook.Sheets["Metricas TikTok"] ||
    workbook.Sheets[workbook.SheetNames.find((n) => n.toLowerCase().includes("metricas")) || ""];

  if (metricasSheet) {
    const parsed = parseMetricasTiktokSheet(metricasSheet);
    allMetrics.push(...parsed.metrics);
    warnings.push(...parsed.warnings);
  } else {
    warnings.push("No se encontro la hoja 'Metricas Tiktok'");
  }

  return { metrics: allMetrics, warnings };
}

function parseMetricasTiktokSheet(sheet: XLSX.WorkSheet): ParseResult {
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
  const metrics: WeeklyMetrics[] = [];
  const warnings: string[] = [];

  let currentAccount: AccountHandle | null = null;
  let headerRow: string[] = [];
  let headerMap: Map<number, keyof WeeklyMetrics> = new Map();

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const firstCell = String(row[0] || "").trim();

    // Detect account header
    if (firstCell.toLowerCase().includes("oso") || firstCell.toLowerCase().includes("elosodebresh")) {
      currentAccount = "@elosodebresh";
      continue;
    }
    if (firstCell.toLowerCase().includes("mundo") || firstCell.toLowerCase().includes("mundobresh")) {
      currentAccount = "@mundobresh";
      continue;
    }

    // Detect column headers (row that contains Views, Likes, etc.)
    const rowStrings = row.map((c) => String(c || "").trim());
    const isHeaderRow = rowStrings.some(
      (s) => COLUMN_MAP[s] !== undefined
    );
    if (isHeaderRow) {
      headerRow = rowStrings;
      headerMap = new Map();
      for (let j = 0; j < headerRow.length; j++) {
        const mapped = COLUMN_MAP[headerRow[j]];
        if (mapped) headerMap.set(j, mapped);
      }
      continue;
    }

    // Skip non-data rows
    if (!currentAccount || headerMap.size === 0) continue;
    if (firstCell.toUpperCase() === "TOTALES" || firstCell === "") continue;

    // Try to parse as week data
    const weekKey = normalizeWeekLabel(firstCell);
    if (!weekKey) continue;

    const dates = WEEK_DATES[weekKey];
    if (!dates) {
      warnings.push(`Fecha no mapeada para ${weekKey}`);
      continue;
    }

    const weekNum = weekKey.replace("w", "");
    const id = `2026-W${weekNum.padStart(2, "0")}-${currentAccount.replace("@", "")}`;

    const metric: WeeklyMetrics = {
      id,
      account: currentAccount,
      weekLabel: `Semana ${weekNum}`,
      weekStartDate: dates.start,
      weekEndDate: dates.end,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      followers: 0,
      profileVisits: 0,
      reach: 0,
      interactions: 0,
    };

    for (const [colIdx, field] of headerMap.entries()) {
      const val = Number(row[colIdx]) || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (metric as any)[field] = val;
    }

    metrics.push(metric);
  }

  return { metrics, warnings };
}
